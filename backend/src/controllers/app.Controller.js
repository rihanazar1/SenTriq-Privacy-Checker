const asyncHandler = require('express-async-handler');
const fetch = require('node-fetch');
const App = require('../models/appSchema');
// const User = require('../models/userSchema');
const urlLib = require('url');
// const mongoose = require('mongoose');
const { setCache, getCache, isRedisAvailable } = require('../config/redis');
const memoryCache = require('../utils/memoryCache');
const {
  DEFAULT_WEIGHTS,
  SYNERGY_RULES,
  BREACH_MULTIPLIER,
  calculateMaxPossible,
  getRiskLevel,
//   generateSuggestions
} = require('../config/riskWeights');

// Extract domain from URL
const extractDomain = (rawUrl) => {
  try {
    const u = new urlLib.URL(rawUrl);
    return u.hostname.replace(/^www\./, '');
  } catch (err) {
    // Try if it's already a domain
    return rawUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  }
};

// Check domain breaches with Redis caching
// Check domain breaches with Redis/Memory caching
const checkDomainBreaches = async (domain) => {
  if (!domain) return 0;

  const cacheKey = `domain_breaches:${domain}`;

  // Check cache (Redis first, then memory fallback)
  let cached = await getCache(cacheKey);
  if (cached === null && !isRedisAvailable()) {
    cached = memoryCache.get(cacheKey);
  }
  
  if (cached !== null) {
    return cached;
  }

  try {
    const endpoint = `https://api.xposedornot.com/v1/breaches?domain=${encodeURIComponent(domain)}`;
    const resp = await fetch(endpoint, {
      method: 'GET',
      timeout: 5000 // 5 second timeout
    });

    if (!resp.ok) {
      console.warn(`xposedornot API returned ${resp.status} for domain ${domain}`);
      // Cache zero breaches for failed requests (shorter TTL)
      const success = await setCache(cacheKey, 0, 3600); // 1 hour
      if (!success) {
        memoryCache.set(cacheKey, 0, 3600); // Fallback to memory cache
      }
      return 0;
    }

    const data = await resp.json();
    let count = 0;

    if (Array.isArray(data)) count = data.length;
    else if (data && typeof data.count === 'number') count = data.count;
    else if (data && Array.isArray(data.results)) count = data.results.length;
    else count = 0;

    // Cache successful results for 24 hours
    const success = await setCache(cacheKey, count, 86400);
    if (!success) {
      memoryCache.set(cacheKey, count, 86400); // Fallback to memory cache
    }
    return count;
  } catch (err) {
    console.error('Error checking domain breaches:', err);
    // Cache zero breaches for errors (shorter TTL)
    const success = await setCache(cacheKey, 0, 3600);
    if (!success) {
      memoryCache.set(cacheKey, 0, 3600); // Fallback to memory cache
    }
    return 0;
  }
};

// Calculate risk score with configurable weights
const calculateRiskScore = (permissions, userEmail, userPhoneNumber, breachCount, weights = DEFAULT_WEIGHTS) => {
  // 1. Base score from permissions and user data
  let rawScore = 0;
  for (const [field, weight] of Object.entries(weights)) {
    if (field === 'userEmail' && userEmail) {
      rawScore += weight;
    } else if (field === 'userPhoneNumber' && userPhoneNumber) {
      rawScore += weight;
    } else if (permissions[field]) {
      rawScore += weight;
    }
  }

  // 2. Apply synergy rules
  let synergyPenalty = 0;
  for (const [ruleName, rule] of Object.entries(SYNERGY_RULES)) {
    const hasAllConditions = rule.conditions.every(condition => {
      if (condition === 'userEmail') return !!userEmail;
      if (condition === 'userPhoneNumber') return !!userPhoneNumber;
      return permissions[condition];
    });
    if (hasAllConditions) {
      synergyPenalty += rule.penalty;
    }
  }

  // 3. Domain breach modifier
  const urlModifier = Math.min(
    BREACH_MULTIPLIER.perBreach * breachCount,
    BREACH_MULTIPLIER.maxModifier
  );

  const totalRaw = rawScore + synergyPenalty + urlModifier;
  const maxPossible = calculateMaxPossible(weights);
  const normalized = Math.round((totalRaw / maxPossible) * 100);

  return {
    rawScore,
    synergyPenalty,
    urlModifier,
    totalRaw,
    normalized,
    maxPossible,
    breachCount
  };
};



const checkAppRisk = asyncHandler(async (req, res) => {
  const { appName, url, permissions = {}, userEmail, userPhoneNumber, save = true } = req.body;
  const userId = req.user._id;

  // Extract domain if URL provided
  let domain = null;
  if (url) {
    domain = extractDomain(url);
  }

  // Check domain breaches
  const breachCount = domain ? await checkDomainBreaches(domain) : 0;

  // Calculate risk score
  const scoreData = calculateRiskScore(permissions, userEmail, userPhoneNumber, breachCount);
  const riskLevel = getRiskLevel(scoreData.normalized);

  // Create combined permissions object for suggestions (includes user data flags)
  const combinedPermissions = {
    ...permissions,
    userEmail: !!userEmail,
    userPhoneNumber: !!userPhoneNumber
  };

  // Generate suggestions
//   const suggestions = generateSuggestions(combinedPermissions, scoreData.urlModifier, riskLevel);

  // Save to database if requested
  let savedRecord = null;
  if (save) {
    // Check if app already exists for this user
    const existingApp = await App.findOne({ userId, appName });

    if (existingApp) {
      // Update existing app
      existingApp.url = url || existingApp.url;
      existingApp.domain = domain;
      existingApp.permissions = permissions;
      existingApp.userEmail = userEmail || null;
      existingApp.userPhoneNumber = userPhoneNumber || null;
      existingApp.riskScore = scoreData.normalized;
      existingApp.riskLevel = riskLevel;
      existingApp.domainBreaches = {
        count: breachCount,
        lastChecked: new Date()
      };
      existingApp.lastRiskCheck = new Date();

      savedRecord = await existingApp.save();
    } else {
      // Create new app
      savedRecord = await App.create({
        userId,
        appName,
        url: url || null,
        domain,
        permissions,
        userEmail: userEmail || null,
        userPhoneNumber: userPhoneNumber || null,
        riskScore: scoreData.normalized,
        riskLevel,
        domainBreaches: {
          count: breachCount,
          lastChecked: new Date()
        }
      });
    }
  }

  return res.json({
    success: true,
    data: {
      appName,
      url,
      domain,
      userEmail,
      userPhoneNumber,
      riskScore: scoreData.normalized,
      riskLevel,
      breakdown: {
        baseScore: scoreData.rawScore,
        synergyPenalty: scoreData.synergyPenalty,
        breachModifier: scoreData.urlModifier,
        totalRaw: scoreData.totalRaw,
        maxPossible: scoreData.maxPossible,
        breachCount: scoreData.breachCount
      },
    //   suggestions,
      permissions,
      savedRecord: savedRecord ? { id: savedRecord._id } : null
    }
  });
});




const getUserApps = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const {
    page = 1,
    limit = 10,
    riskLevel,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    search
  } = req.query;

  // Build query
  const query = { userId, isActive: true };

  if (riskLevel) {
    query.riskLevel = riskLevel;
  }

  if (search) {
    query.appName = { $regex: search, $options: 'i' };
  }

  // Build sort
  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  // Execute query with pagination
  const skip = (page - 1) * limit;
  const [apps, total] = await Promise.all([
    App.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-emailHash'),
    App.countDocuments(query)
  ]);

  return res.json({
    success: true,
    data: {
      apps,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});




const getUserAppStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [riskStats, highRiskApps, domainAnalysis] = await Promise.all([
    App.getUserAppStats(userId),
    App.getHighRiskApps(userId, 5),
    App.getDomainRiskAnalysis(userId)
  ]);

  return res.json({
    success: true,
    data: {
      riskDistribution: riskStats,
      highRiskApps,
      domainAnalysis,
      summary: {
        totalApps: riskStats.reduce((sum, stat) => sum + stat.count, 0),
        averageRiskScore: riskStats.reduce((sum, stat) => sum + (stat.avgScore * stat.count), 0) /
          riskStats.reduce((sum, stat) => sum + stat.count, 0) || 0
      }
    }
  });
});



const updateApp = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const updates = req.body;

  const app = await App.findOne({ _id: id, userId });

  if (!app) {
    return res.status(404).json({
      success: false,
      error: 'App not found'
    });
  }

  // Update fields
  Object.keys(updates).forEach(key => {
    if (updates[key] !== undefined) {
      app[key] = updates[key];
    }
  });

  // Recalculate risk if permissions changed
  if (updates.permissions) {
    const breachCount = app.domainBreaches?.count || 0;
    const scoreData = calculateRiskScore(updates.permissions, breachCount);
    app.riskScore = scoreData.normalized;
    app.riskLevel = getRiskLevel(scoreData.normalized);
    app.lastRiskCheck = new Date();
  }

  const updatedApp = await app.save();

  return res.json({
    success: true,
    data: updatedApp
  });
});



const deleteApp = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const app = await App.findOne({ _id: id, userId });

  if (!app) {
    return res.status(404).json({
      success: false,
      error: 'App not found'
    });
  }

  // Soft delete
  app.isActive = false;
  await app.save();

  return res.json({
    success: true,
    message: 'App deleted successfully'
  });
});





const getApp = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const app = await App.findOne({ _id: id, userId, isActive: true });

  if (!app) {
    return res.status(404).json({
      success: false,
      error: 'App not found'
    });
  }

  return res.json({
    success: true,
    data: app
  });
});

module.exports = {
  checkAppRisk,
  getUserApps,
  getUserAppStats,
  updateApp,
  deleteApp,
  getApp
};
