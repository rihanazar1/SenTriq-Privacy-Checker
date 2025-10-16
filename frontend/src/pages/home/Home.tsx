import React from 'react'
import Particles from '../../components/Particles'
import ScrollVelocity from '../../components/ScrollVelocity'
import images from '../../assets'

const Home: React.FC = () => {
  const scrollTexts = [
    "Protect . Fake . Track . Detect . Secure . Analyze . Encrypt . Monitor",
    "Sentriq is your personal data command center . Built with Privacy",
    "first tools . Simple . Smart . Track . Control . Defend ."
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">



      {/* Hero Section Container for Particles and Content */}
      <div className="relative min-h-[70vh] pb-10">

        {/* Navigation */}
        <nav className="relative z-20 flex items-center justify-between px-8 py-6">
          <div className="flex items-center space-x-2">
            <img src={images.logo} alt="SenTriq" className="h-10 w-10" />
            <span className="text-xl font-bold text-[#ffffff]">SenTriq</span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4 bg-slate-800/50 rounded-full px-6 py-2 backdrop-blur-sm">
              <button className="text-white hover:text-[#a6cf63] transition-colors">Home</button>
              <button className="text-white hover:text-[#a6cf63] transition-colors">Features</button>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#a2e535] rounded-full"></div>
                <div className="w-2 h-2 bg-[#a2e535] rounded-full"></div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="bg-[#a2e535] text-black px-6 py-2 rounded-full font-semibold hover:bg-[#a6cf63] transition-colors">
                Get Started
              </button>
              <button className="bg-slate-700 text-white px-6 py-2 rounded-full font-semibold hover:bg-slate-600 transition-colors">
                Login
              </button>
            </div>
          </div>
        </nav>
        {/* Particles Background - Now limited to the Hero section */}
        <div className="absolute inset-0 z-0">
          <Particles
            particleColors={['#ffffff', '#ffffff']}
            particleCount={200}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={100}
            moveParticlesOnHover={true}
            alphaParticles={false}
            disableRotation={false}
          />
        </div>

        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute bottom-0 left-0 right-0 h-80">
            <div className='absolute inset-0 bg-gradient-to-t from-[#146536] to-transparent'></div>
          </div>
        </div>

        {/* Hero Section Content */}
        <div className="relative z-20 flex flex-col items-center justify-center min-h-[70vh] px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="w-full text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Your Data. Your Privacy. Your Rules.
            </h1>

            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Track the apps you've shared personal info with, generate fake data and
              generate fake data to protect your identity effortlessly find securely
            </p>

            <div className="flex items-center justify-center space-x-4">
              <button className="bg-[#a2e535] text-black px-8 py-3 rounded-full font-semibold text-lg hover:bg-[#a6cf63] transition-colors">
                Get Started Free
              </button>
              <button className="bg-slate-700 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-slate-600 transition-colors">
                How Its Work
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute  left-0 right-0 h-64">
        <div className='absolute inset-0 bg-gradient-to-b from-[#146536] to-transparent'></div>
      </div>

      {/* Scroll Velocity Animation Section */}
      <div className="relative z-10 py-16">
        <ScrollVelocity
          texts={scrollTexts}
          velocity={50}
          className="text-white"
          parallaxClassName="py-4"
          scrollerClassName="text-2xl md:text-4xl font-bold"
        />
      </div>

      {/* What You Can Do Section */}
      <div className="relative z-10 py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">What You Can Do</h2>
            <p className="text-xl text-slate-300">
              Explore the tools that put privacy back in your hands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Breach Detection */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:bg-slate-800/50 transition-all duration-300">
              <div className="flex items-start space-x-4">
                {/* 🔴 Background removed, image size increased */}
                <div className="flex-shrink-0 w-20 h-20 flex items-center justify-center"> {/* Increased size for the icon container */}
                  <img src={images.img5} alt="Breach Detection" className="w-full h-full object-contain" /> {/* Image fills its new larger container */}
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Breach Detection</h3>
                  <p className="text-slate-300 leading-relaxed">
                    Know instantly when your email appears in a data leak using real-
                    time monitoring and get alerted by HaveIBeenPwned.
                  </p>
                </div>
              </div>
            </div>

            {/* Fake Data Generator */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:bg-slate-800/50 transition-all duration-300">
              <div className="flex items-start space-x-4">
                {/* 🔴 Background removed, image size increased */}
                <div className="flex-shrink-0 w-20 h-20 flex items-center justify-center"> {/* Increased size for the icon container */}
                  <img src={images.img7} alt="Fake Data Generator" className="w-full h-full object-contain" /> {/* Image fills its new larger container */}
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Fake Data Generator</h3>
                  <p className="text-slate-300 leading-relaxed">
                    Protect your real identity by generating fake names, emails,
                    PAN, Aadhar and more with a click.
                  </p>
                </div>
              </div>
            </div>

            {/* Data Risk Score */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:bg-slate-800/50 transition-all duration-300">
              <div className="flex items-start space-x-4">
                {/* 🔴 Background added for consistency, image size increased */}
                <div className="flex-shrink-0 w-20 h-20 flex items-center justify-center"> {/* Consistent container for this icon */}
                  <img src={images.img8} alt="Data Risk Score" className="w-full h-full object-contain" /> {/* Image fills its new larger container */}
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Data Risk Score</h3>
                  <p className="text-slate-300 leading-relaxed">
                    Analyze the apps you've shared your data with and get a visual
                    "Data Risk Score" to see how secure you are.
                  </p>
                </div>
              </div>
            </div>

            {/* Encrypted Data Vault */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:bg-slate-800/50 transition-all duration-300">
              <div className="flex items-start space-x-4">
                {/* 🔴 Background removed, image size increased */}
                <div className="flex-shrink-0 w-20 h-20 flex items-center justify-center"> {/* Increased size for the icon container */}
                  <img src={images.img6} alt="Encrypted Data Vault" className="w-full h-full object-contain" /> {/* Image fills its new larger container */}
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Encrypted Data Vault</h3>
                  <p className="text-slate-300 leading-relaxed">
                    Store license keys, personal notes or sensitive data securely
                    with optional Pay-lock encryption.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Eye Cards Section */}
      <div className="relative z-10 py-20 px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-slate-300">
              Simple, Secure and Smart. Here's how you take back control:
            </p>
          </div>

          {/* Eye Cards Vertical Layout */}
          <div className="space-y-8 max-w-5xl mx-auto">
            {/* Card 1 - Connect Your Accounts */}
            <div className="bg-gradient-to-r from-green-500/20 to-green-400/20 border border-green-500/30 rounded-3xl p-8 backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <img src={images.img1} alt="Connect Accounts" className="w-24 h-24 object-contain" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-4 text-white">Connect Your Accounts</h3>
                  <p className="text-xl text-slate-300 leading-relaxed">
                    Securely link apps and services to analyze shared data.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 - Use Fake Info */}
            <div className="bg-gradient-to-r from-red-500/20 to-orange-400/20 border border-red-500/30 rounded-3xl p-8 backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <img src={images.img2} alt="Fake Info" className="w-24 h-24 object-contain" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-4 text-white">Use Fake Info When You Need It</h3>
                  <p className="text-xl text-slate-300 leading-relaxed">
                    Generate fake names, emails, PAN etc. to protect your real identity where needed.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 - Detect Breaches */}
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-400/20 border border-blue-500/30 rounded-3xl p-8 backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <img src={images.img3} alt="Detect Breaches" className="w-24 h-24 object-contain" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-4 text-white">Detect Breaches Instantly</h3>
                  <p className="text-xl text-slate-300 leading-relaxed">
                    We scan your email against public leak databases and notify you if your data is compromised.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4 - Store Notes Safely */}
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-400/20 border border-purple-500/30 rounded-3xl p-8 backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <img src={images.img9} alt="Store Notes" className="w-24 h-24 object-contain" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-4 text-white">Store Notes Safely</h3>
                  <p className="text-xl text-slate-300 leading-relaxed">
                    Store license keys, passwords or any sensitive data in a secure, encrypted vault with PIN protection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="relative z-10 py-16 px-8 bg-slate-900/80">
        <div className="max-w-7xl mx-auto">
          {/* Footer Content Container with Green Border */}
          <div className="border border-[#a2e535] rounded-3xl p-12 bg-slate-800/30 backdrop-blur-sm">
            <div className="relative flex flex-col md:flex-row">

              {/* Brand Section */}
              <div className="flex-1 space-y-6 px-0 md:pr-12">
                <div className="flex items-center space-x-3">
                  <img src={images.logo} alt="SenTriq" className="h-12 w-12" />
                  <span className="text-3xl font-bold text-white">SenTriq</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Where Privacy</h3>
                  <h3 className="text-2xl font-bold text-white">Meets Control.</h3>
                </div>
              </div>

              {/* Vertical Divider 1 - Hidden on mobile */}
              <div className="hidden md:block absolute left-1/3 top-0 bottom-0 w-px bg-[#a2e535]"></div>

              {/* Information Section */}
              <div className="flex-1 space-y-6 px-0 md:px-12 mt-12 md:mt-0">
                <h3 className="text-2xl font-bold text-white">Information</h3>
                <div className="space-y-4">
                  <a href="#" className="block text-slate-300 hover:text-[#a2e535] transition-colors text-lg">
                    Privacy Policy
                  </a>
                  <a href="#" className="block text-slate-300 hover:text-[#a2e535] transition-colors text-lg">
                    Terms of Service
                  </a>
                  <a href="#" className="block text-slate-300 hover:text-[#a2e535] transition-colors text-lg">
                    About Us
                  </a>
                  <a href="#" className="block text-slate-300 hover:text-[#a2e535] transition-colors text-lg">
                    Contact
                  </a>
                  <a href="#" className="block text-slate-300 hover:text-[#a2e535] transition-colors text-lg">
                    FAQ
                  </a>
                </div>
              </div>

              {/* Vertical Divider 2 - Hidden on mobile */}
              <div className="hidden md:block absolute left-2/3 top-0 bottom-0 w-px bg-[#a2e535]"></div>

              {/* Connect With Us Section */}
              <div className="flex-1 space-y-6 px-0 md:pl-12 mt-12 md:mt-0">
                <h3 className="text-2xl font-bold text-white">Connect With Us</h3>
                <div className="space-y-4">
                  <a href="#" className="block text-slate-300 hover:text-[#a2e535] transition-colors text-lg">
                    Twitter
                  </a>
                  <a href="#" className="block text-slate-300 hover:text-[#a2e535] transition-colors text-lg">
                    LinkedIn
                  </a>
                  <a href="#" className="block text-slate-300 hover:text-[#a2e535] transition-colors text-lg">
                    GitHub
                  </a>
                  <a href="#" className="block text-slate-300 hover:text-[#a2e535] transition-colors text-lg">
                    Discord
                  </a>
                  <a href="#" className="block text-slate-300 hover:text-[#a2e535] transition-colors text-lg">
                    Support
                  </a>
                </div>
              </div>
            </div>

            {/* Copyright Section */}
            <div className="border-t border-slate-700 mt-12 pt-8 text-center">
              <p className="text-slate-400 text-lg">
                © 2025 SenTriq. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home