import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetProfileQuery } from '../../store/api/authApi'
import Particles from '../../components/Particles'
import ScrollVelocity from '../../components/ScrollVelocity'
import images from '../../assets'
import Footer from '../../components/Footer'
import Navbar from '../../components/Navbar'
import TextType from '../../components/TextType'

const Home: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  // Only fetch profile if user is logged in
  const { data: profileData } = useGetProfileQuery(undefined, {
    skip: !token
  });

  useEffect(() => {
    // If user is logged in and deactivated, redirect to deactivated page
    if (token && profileData?.data && profileData.data.isActive === false) {
      navigate('/account-deactivated', { replace: true });
    }
  }, [token, profileData, navigate]);

  // const cards = [
  //   {
  //     img: images.img1,
  //     title: 'Connect Your Accounts',
  //     desc: "Securely link apps and services to analyze shared data.",
  //     gradient: 'from-green-500/20 to-green-400/20',
  //     border: 'border-green-500/30',
  //   },
  //   {
  //     img: images.img2,
  //     title: 'Use Fake Info When You Need It',
  //     desc: 'Generate fake names, emails, PAN etc. to protect your real identity where needed.',
  //     gradient: 'from-red-500/20 to-orange-400/20',
  //     border: 'border-red-500/30',
  //   },
  //   {
  //     img: images.img3,
  //     title: 'Detect Breaches Instantly',
  //     desc: 'We scan your email against public leak databases and notify you if your data is compromised.',
  //     gradient: 'from-blue-500/20 to-cyan-400/20',
  //     border: 'border-blue-500/30',
  //   },
  //   {
  //     img: images.img9,
  //     title: 'Store Notes Safely',
  //     desc: 'Store license keys, passwords or any sensitive data in a secure, encrypted vault with PIN protection.',
  //     gradient: 'from-purple-500/20 to-pink-400/20',
  //     border: 'border-purple-500/30',
  //   },
  // ];


  const scrollTexts = [
    "Protect . Fake . Track . Detect . Secure . Analyze . Encrypt . Monitor",
    "Sentriq is your personal data command center . Built with Privacy",
    "first tools . Simple . Smart . Track . Control . Defend ."
  ]

  return (
    <div className="min-h-screen bg-[#0A191F] text-white relative overflow-hidden">



      {/* Hero Section Container for Particles and Content */}
      <div className="relative mt-20 min-h-[70vh] pb-10">

        <Navbar />
        {/* Particles Background - Now limited to the Hero section */}
        <div className="absolute inset-0 z-0">
          <Particles
            particleCount={250}
            particleSpread={10}
            speed={0.7}
            particleSize={30}
            particleColor="#00ffcc"
            moveParticlesOnHover={true}
            disableRotation={true}
          />
        </div>

        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute bottom-0 left-0 right-0 h-80">
            <div className='absolute inset-0 bg-gradient-to-t from-[#146536] to-transparent'></div>
          </div>
        </div>

        {/* Hero Section Content */}
        <div className="relative z-20 flex flex-col items-center justify-center min-h-[70vh] px-8">
          <div className="text-center max-w-7xl mx-auto">
            <h1 className="w-full text-6xl md:text-7xl font-bold mb-6 leading-tight">

              <TextType
                text={[
                  "Your Data. Your Privacy. Your Rules.",
                  "Built with Privacy at the Core.",
                ]}
                typingSpeed={80}
                deletingSpeed={80}
                pauseDuration={2500}
                cursorCharacter="_"
                cursorBlinkDuration={0.6}
                hideCursorWhileTyping={false}
                variableSpeed={{ min: 50, max: 100 }}
              />
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

      <Footer />
    </div>
  )
}

export default Home