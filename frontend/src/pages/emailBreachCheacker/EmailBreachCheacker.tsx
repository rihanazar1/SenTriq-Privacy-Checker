import { useState } from 'react'
import Footer from "../../components/Footer"
import Navbar from "../../components/Navbar"
import Particles from "../../components/Particles"
import { useScanEmailBreachMutation } from '../../store/api/emailBreachApi'
import type { EmailBreachScanResponse, BreachRecord } from '../../store/api/emailBreachApi'
import { toastService } from '../../utils/toast'
import {
  Search,
  Shield,
  Zap,
  Lock,
  RotateCcw,
  Mail,
  Smartphone,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  ShieldCheck
} from 'lucide-react'

const EmailBreachCheacker = () => {
  const [email, setEmail] = useState('')
  const [scanResult, setScanResult] = useState<EmailBreachScanResponse | null>(null)
  const [scanEmailBreach, { isLoading }] = useScanEmailBreachMutation()

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      toastService.error('Please enter an email address')
      return
    }

    try {
      const result = await scanEmailBreach({ email: email.trim() }).unwrap()
      setScanResult(result)

      if (result.data.breachCount > 0) {
        toastService.success(`Scan complete! Found ${result.data.breachCount} breach(es)`)
      } else {
        toastService.success('Good news! No breaches found for this email')
      }
    } catch (error) {
      toastService.error('Failed to scan email. Please try again.')
      console.error('Email breach scan error:', error)
    }
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low':
        return 'text-green-300 bg-green-900/30 border border-green-700'
      case 'Medium':
        return 'text-yellow-300 bg-yellow-900/30 border border-yellow-700'
      case 'High':
        return 'text-red-300 bg-red-900/30 border border-red-700'
      default:
        return 'text-gray-300 bg-gray-800/30 border border-gray-600'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <>
      <div className="min-h-screen bg-[#0A191F] text-white relative overflow-hidden">
        {/* Hero Section Container for Particles and Content */}
        <div className="relative mt-20 min-h-[70vh] pb-10">
          <Navbar />

          {/* Particles Background */}
          <div className="absolute inset-0 z-0">
            <Particles
              particleCount={250}
              particleSpread={10}
              speed={0.7}
              particleSize={30}
              particleColor="#A3E635"
              moveParticlesOnHover={true}
              disableRotation={true}
            />
          </div>

          {/* <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="absolute bottom-0 left-0 right-0 h-80">
              <div className='absolute inset-0 bg-gradient-to-t from-[#146536] to-transparent'></div>
            </div>
          </div> */}

          {/* Main Content */}
          <div className="relative z-20 container mx-auto px-4 pt-20">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#A3E635] to-[#028fa5] bg-clip-text text-transparent">
                Email Breach Scanner
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Check if your email has been compromised in data breaches
              </p>
            </div>

            {/* Information Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/40 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-[#A3E635]/30 transition-all duration-300">
                <div className="bg-gradient-to-br from-[#A3E635] to-[#146536] p-3 rounded-full w-fit mb-4">
                  <Search className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                  Comprehensive Scanning
                </h3>
                <p className="text-gray-300 text-sm">
                  We check your email against billions of compromised accounts from major data breaches worldwide.
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/40 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-[#A3E635]/30 transition-all duration-300">
                <div className="bg-gradient-to-br from-[#A3E635] to-[#146536] p-3 rounded-full w-fit mb-4">
                  <Shield className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                  Privacy Protected
                </h3>
                <p className="text-gray-300 text-sm">
                  Your email is never stored. We only check it against our breach database and immediately discard it.
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/40 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-[#A3E635]/30 transition-all duration-300">
                <div className="bg-gradient-to-br from-[#A3E635] to-[#146536] p-3 rounded-full w-fit mb-4">
                  <Zap className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                  Real-time Results
                </h3>
                <p className="text-gray-300 text-sm">
                  Get instant results with detailed information about each breach including dates and compromised data.
                </p>
              </div>
            </div>

            {/* Email Input Form */}
            <div className="max-w-4xl mx-auto mb-12">
              <form onSubmit={handleScan} className="bg-gradient-to-br from-gray-800/60 to-gray-900/40 backdrop-blur-sm rounded-xl p-8 border border-gray-700 shadow-2xl">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-[#A3E635] to-[#028fa5] bg-clip-text text-transparent mb-3">
                    Check Your Email Security
                  </h2>
                  <p className="text-gray-400 text-lg">Enter your email address to scan for data breaches</p>
                </div>
                <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                  <div className="flex-1">
                    <label className="block text-sm font-medium bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent mb-3">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-4 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/20 transition-all duration-300"
                      required
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-8 py-4 bg-gradient-to-r from-[#A3E635] via-[#8BC34A] to-[#146536] text-black font-bold rounded-lg hover:shadow-lg hover:shadow-[#A3E635]/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer min-w-[140px] flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
                          Scanning...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          Scan Email
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-2 text-sm text-gray-400 bg-gray-800/50 px-4 py-2 rounded-full">
                    <Lock className="w-4 h-4 text-[#A3E635]" />
                    Your email is not stored and is only used for breach checking
                  </div>
                </div>
              </form>
            </div>

            {/* What are Data Breaches Section */}
            {!scanResult && (
              <div className="w-full mx-auto mb-12">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-[#A3E635] to-[#028fa5] bg-clip-text text-transparent mb-8 text-center">
                    What are Data Breaches?
                  </h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Understanding Data Breaches</h3>
                      <div className="space-y-4 text-gray-300">
                        <p>
                          A data breach occurs when cybercriminals gain unauthorized access to a company's database
                          and steal sensitive information like emails, passwords, and personal data.
                        </p>
                        <p>
                          Major companies like Facebook, LinkedIn, Yahoo, and Adobe have experienced massive breaches
                          affecting millions of users worldwide.
                        </p>
                        <p>
                          When your email is found in a breach, it means your account information was compromised
                          and may be available to malicious actors.
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Common Types of Compromised Data</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
                          <div className="text-red-300 font-medium text-sm">Email Addresses</div>
                        </div>
                        <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
                          <div className="text-red-300 font-medium text-sm">Passwords</div>
                        </div>
                        <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
                          <div className="text-red-300 font-medium text-sm">Phone Numbers</div>
                        </div>
                        <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
                          <div className="text-red-300 font-medium text-sm">Personal Names</div>
                        </div>
                        <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
                          <div className="text-red-300 font-medium text-sm">Credit Cards</div>
                        </div>
                        <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
                          <div className="text-red-300 font-medium text-sm">Social Security</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tips Section */}
            {!scanResult && (
              <div className="w-full mx-auto mb-12">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-[#A3E635] to-[#146536] bg-clip-text text-transparent mb-8 text-center">
                    Protect Yourself from Data Breaches
                  </h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="bg-gradient-to-br from-[#A3E635] to-[#146536] p-2 rounded-lg">
                          <Lock className="w-5 h-5 text-black" />
                        </div>
                        <div>
                          <h4 className="font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Use Strong, Unique Passwords
                          </h4>
                          <p className="text-gray-300 text-sm">Create different passwords for each account and use a password manager.</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="bg-gradient-to-br from-[#A3E635] to-[#146536] p-2 rounded-lg">
                          <RotateCcw className="w-5 h-5 text-black" />
                        </div>
                        <div>
                          <h4 className="font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Enable Two-Factor Authentication
                          </h4>
                          <p className="text-gray-300 text-sm">Add an extra layer of security to your important accounts.</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="bg-gradient-to-br from-[#A3E635] to-[#146536] p-2 rounded-lg">
                          <Mail className="w-5 h-5 text-black" />
                        </div>
                        <div>
                          <h4 className="font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Monitor Your Accounts
                          </h4>
                          <p className="text-gray-300 text-sm">Regularly check for suspicious activity and unauthorized access.</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="bg-gradient-to-br from-[#A3E635] to-[#146536] p-2 rounded-lg">
                          <RotateCcw className="w-5 h-5 text-black" />
                        </div>
                        <div>
                          <h4 className="font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Update Passwords Regularly
                          </h4>
                          <p className="text-gray-300 text-sm">Change passwords immediately if you're notified of a breach.</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="bg-gradient-to-br from-[#A3E635] to-[#146536] p-2 rounded-lg">
                          <WifiOff className="w-5 h-5 text-black" />
                        </div>
                        <div>
                          <h4 className="font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Avoid Public Wi-Fi for Sensitive Tasks
                          </h4>
                          <p className="text-gray-300 text-sm">Don't access sensitive accounts on unsecured networks.</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="bg-gradient-to-br from-[#A3E635] to-[#146536] p-2 rounded-lg">
                          <Smartphone className="w-5 h-5 text-black" />
                        </div>
                        <div>
                          <h4 className="font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Keep Software Updated
                          </h4>
                          <p className="text-gray-300 text-sm">Install security updates promptly to protect against vulnerabilities.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Statistics Section */}
            {!scanResult && (
              <div className="w-full mx-auto mb-12">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-[#A3E635] to-[#146536] bg-clip-text text-transparent mb-8 text-center">
                    Data Breach Statistics
                  </h2>
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center bg-gradient-to-br from-gray-800/40 to-gray-900/20 rounded-lg p-6 border border-gray-700/50">
                      <div className="text-4xl font-bold bg-gradient-to-r from-[#A3E635] to-[#146536] bg-clip-text text-transparent mb-3">15B+</div>
                      <div className="text-gray-300 text-sm font-medium">Compromised Accounts</div>
                    </div>
                    <div className="text-center bg-gradient-to-br from-gray-800/40 to-gray-900/20 rounded-lg p-6 border border-gray-700/50">
                      <div className="text-4xl font-bold bg-gradient-to-r from-[#A3E635] to-[#146536] bg-clip-text text-transparent mb-3">500+</div>
                      <div className="text-gray-300 text-sm font-medium">Major Breaches Tracked</div>
                    </div>
                    <div className="text-center bg-gradient-to-br from-gray-800/40 to-gray-900/20 rounded-lg p-6 border border-gray-700/50">
                      <div className="text-4xl font-bold bg-gradient-to-r from-[#A3E635] to-[#146536] bg-clip-text text-transparent mb-3">$4.45M</div>
                      <div className="text-gray-300 text-sm font-medium">Average Breach Cost</div>
                    </div>
                    <div className="text-center bg-gradient-to-br from-gray-800/40 to-gray-900/20 rounded-lg p-6 border border-gray-700/50">
                      <div className="text-4xl font-bold bg-gradient-to-r from-[#A3E635] to-[#146536] bg-clip-text text-transparent mb-3">287</div>
                      <div className="text-gray-300 text-sm font-medium">Days to Identify</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Scan Results */}
            {scanResult && (
              <div className="w-full mx-auto">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-[#A3E635] to-[#028fa5] bg-clip-text text-transparent mb-3">
                        Scan Results for {scanResult.data.email}
                      </h2>
                      <p className="text-gray-300 text-lg">
                        Found {scanResult.data.breachCount} breach(es) • Risk Score: {scanResult.data.riskScore}/100
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        Scanned on {new Date(scanResult.data.scannedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-full ${getRiskLevelColor(scanResult.data.riskLevel)}`}>
                        {scanResult.data.riskLevel.toUpperCase()} RISK
                      </span>
                      <div className="text-right">
                        <div className="text-2xl font-bold bg-gradient-to-r from-[#A3E635] to-[#028fa5] bg-clip-text text-transparent">
                          {scanResult.data.riskScore}/100
                        </div>
                        <div className="text-xs text-gray-400">Risk Score</div>
                      </div>
                    </div>
                  </div>

                  {scanResult.data.breachCount === 0 ? (
                    <div className="text-center py-16">
                      <div className="bg-gradient-to-br from-green-400 to-green-600 p-6 rounded-full w-24 h-24 mx-auto mb-8 flex items-center justify-center shadow-lg shadow-green-500/25">
                        <ShieldCheck className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent mb-4">
                        Excellent News!
                      </h3>
                      <p className="text-xl text-gray-300 mb-2">
                        <span className="font-semibold bg-gradient-to-r from-[#A3E635] to-[#146536] bg-clip-text text-transparent">
                          No breaches found
                        </span> for this email address.
                      </p>
                      <p className="text-gray-400 mb-8 max-w-md mx-auto">
                        Your email was not found in any known data breaches in our comprehensive database.
                      </p>

                      <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700/50 rounded-xl p-8 max-w-lg mx-auto backdrop-blur-sm">
                        <div className="flex items-center justify-center gap-2 mb-4">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <h4 className="text-lg font-semibold bg-gradient-to-r from-green-300 to-green-500 bg-clip-text text-transparent">
                            Stay Protected
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 gap-3 text-left">
                          <div className="flex items-center gap-3 text-green-200 text-sm">
                            <div className="w-2 h-2 bg-gradient-to-r from-[#A3E635] to-[#146536] rounded-full"></div>
                            <span>Continue using strong, unique passwords</span>
                          </div>
                          <div className="flex items-center gap-3 text-green-200 text-sm">
                            <div className="w-2 h-2 bg-gradient-to-r from-[#A3E635] to-[#146536] rounded-full"></div>
                            <span>Enable two-factor authentication</span>
                          </div>
                          <div className="flex items-center gap-3 text-green-200 text-sm">
                            <div className="w-2 h-2 bg-gradient-to-r from-[#A3E635] to-[#146536] rounded-full"></div>
                            <span>Monitor your accounts regularly</span>
                          </div>
                          <div className="flex items-center gap-3 text-green-200 text-sm">
                            <div className="w-2 h-2 bg-gradient-to-r from-[#A3E635] to-[#146536] rounded-full"></div>
                            <span>Check back periodically for new breaches</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setEmail('')
                          setScanResult(null)
                        }}
                        className="mt-8 px-6 py-3 bg-gradient-to-r from-[#A3E635] to-[#146536] text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-[#A3E635]/25 transform hover:scale-105 transition-all duration-300 cursor-pointer inline-flex items-center gap-2"
                      >
                        <Search className="w-4 h-4" />
                        Scan Another Email
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent mb-6">
                        Breach Details ({scanResult.data.breachCount} found)
                      </h3>
                      {scanResult.data.breaches && scanResult.data.breaches.length > 0 && scanResult.data.breaches.map((breach: BreachRecord, index: number) => (
                        <div key={index} className="bg-gradient-to-br from-gray-700/60 to-gray-800/40 rounded-xl p-6 border border-gray-600 hover:border-red-500/30 transition-all duration-300">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h4 className="text-xl font-bold bg-gradient-to-r from-[#A3E635] to-[#146536] bg-clip-text text-transparent mb-1">
                                {breach.name || 'Unknown Breach'}
                              </h4>
                              {breach.domain && breach.domain.trim() && (
                                <p className="text-sm text-gray-400 mb-2">Domain: {breach.domain}</p>
                              )}
                              <div className="flex flex-wrap gap-2 mb-2">
                                {breach.isVerified && (
                                  <span className="px-2 py-1 bg-green-900/30 text-green-300 text-xs rounded border border-green-700">
                                    Verified
                                  </span>
                                )}
                                {breach.isSensitive && (
                                  <span className="px-2 py-1 bg-red-900/30 text-red-300 text-xs rounded border border-red-700">
                                    Sensitive
                                  </span>
                                )}
                                {breach.isRetired && (
                                  <span className="px-2 py-1 bg-gray-900/30 text-gray-300 text-xs rounded border border-gray-700">
                                    Retired
                                  </span>
                                )}
                                {breach.isSpamList && (
                                  <span className="px-2 py-1 bg-yellow-900/30 text-yellow-300 text-xs rounded border border-yellow-700">
                                    Spam List
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <p className="text-sm text-gray-400">Breach Date</p>
                              <p className="text-sm font-medium text-white">
                                {breach.breachDate ? formatDate(breach.breachDate) : 'Unknown'}
                              </p>
                              {breach.pwnCount && breach.pwnCount > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs text-gray-400">Affected Accounts</p>
                                  <p className="text-sm font-bold text-red-400">
                                    {breach.pwnCount.toLocaleString()}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {breach.description && breach.description.trim() && (
                            <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-600">
                              <p className="text-gray-300 text-sm leading-relaxed">{breach.description}</p>
                            </div>
                          )}

                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-300 mb-3">Compromised Data Types:</p>
                            <div className="flex flex-wrap gap-2">
                              {breach.dataClasses && breach.dataClasses.length > 0 ? breach.dataClasses.map((dataClass: string, idx: number) => (
                                <span key={idx} className="px-3 py-1 bg-red-900/30 text-red-300 text-xs rounded-full border border-red-700 font-medium">
                                  {dataClass}
                                </span>
                              )) : (
                                <span className="px-3 py-1 bg-gray-800/50 text-gray-400 text-xs rounded-full border border-gray-600">
                                  No specific data types listed
                                </span>
                              )}
                            </div>
                          </div>

                          {(breach.addedDate || breach.modifiedDate) && (
                            <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-600">
                              {breach.addedDate && (
                                <span>Added: {formatDate(breach.addedDate)}</span>
                              )}
                              {breach.modifiedDate && (
                                <span>Modified: {formatDate(breach.modifiedDate)}</span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recommendations Section */}
                {scanResult.data.breachCount > 0 && (
                  <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/20 border border-yellow-700/50 rounded-xl p-8 mt-8 backdrop-blur-sm">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent mb-6 flex items-center">
                      <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-lg mr-3">
                        <AlertTriangle className="w-6 h-6 text-black" />
                      </div>
                      Immediate Actions Required
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-yellow-200 mb-3">Priority Actions:</h4>
                        <ul className="space-y-2 text-yellow-100 text-sm">
                          <li className="flex items-start">
                            <span className="text-yellow-300 mr-2">1.</span>
                            <span>Change your password immediately on all affected services</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-yellow-300 mr-2">2.</span>
                            <span>Enable two-factor authentication where available</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-yellow-300 mr-2">3.</span>
                            <span>Check for unauthorized account activity</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-yellow-300 mr-2">4.</span>
                            <span>Monitor your credit reports for suspicious activity</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-yellow-200 mb-3">Long-term Security:</h4>
                        <ul className="space-y-2 text-yellow-100 text-sm">
                          <li className="flex items-start">
                            <span className="text-yellow-300 mr-2">•</span>
                            <span>Use a password manager for unique passwords</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-yellow-300 mr-2">•</span>
                            <span>Set up account alerts for login attempts</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-yellow-300 mr-2">•</span>
                            <span>Consider using a different email for sensitive accounts</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-yellow-300 mr-2">•</span>
                            <span>Regularly scan your email for new breaches</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* <div className="absolute left-0 right-0 h-64">
          <div className='absolute inset-0 bg-gradient-to-b from-[#146536] to-transparent'></div>
        </div> */}
        <Footer />
      </div>
    </>
  )
}

export default EmailBreachCheacker