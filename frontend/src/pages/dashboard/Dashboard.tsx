
// import React from 'react';
import robotGif from '../../assets/images/robot.gif';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';

// SVG Gauge Component
const CircularGauge = ({ percentage, size = 120, strokeWidth = 8 }: { percentage: number; size?: number; strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Color based on percentage
  const getColor = (percent: number) => {
    if (percent <= 30) return '#10B981'; // Green
    if (percent <= 60) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#374151"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(percentage)}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-white">{percentage}%</span>
      </div>
    </div>
  );
};

const Dashboard = () => {



  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a191f' }}>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <Navbar />

          {/* Welcome Section */}
          <div className="mt-20 rounded-2xl p-6 mb-8 border border-blue-700/30 backdrop-blur-lg bg-gradient-to-r from-blue-900/40 to-blue-800/40" style={{ background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.3) 0%, rgba(29, 78, 216, 0.2) 100%)', backdropFilter: 'blur(10px)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-between w-full">
                <img src={robotGif} alt="Robot" className="w-32 h-32 rounded-lg" />
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">👋 Welcome back, Rihan!</h1>
                  <p className="text-blue-200">Stay on top of your data privacy in real time.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section - Cyberpunk Premium */}
          <div className="flex gap-6 mb-8">
            {/* Left Side - Stats and Quick Actions */}
            <div className="flex-1 space-y-6">
              {/* Top Row - Tracked Apps and Breaches */}
              <div className="flex gap-6">
                {/* Tracked Apps */}
                <div
                  className="flex flex-col justify-between flex-1 h-[180px] rounded-2xl p-6 backdrop-blur-lg"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(147, 51, 234, 0.25) 0%, rgba(0, 0, 0, 0.45) 100%)',
                    border: '1px solid rgba(147, 51, 234, 0.4)',
                  }}
                >
                  <h3 className="text-purple-200 text-sm font-medium mb-2">Tracked Apps</h3>
                  <div className="mt-auto">
                    <div className="text-5xl font-bold text-white mb-1">5</div>
                    <button className="text-purple-300 text-sm hover:text-white transition-colors">
                      View all →
                    </button>
                  </div>
                </div>

                {/* Breaches */}
                <div
                  className="flex flex-col justify-between flex-1 h-[180px] rounded-2xl p-6 backdrop-blur-lg"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(236, 72, 153, 0.25) 0%, rgba(0, 0, 0, 0.45) 100%)',
                    border: '1px solid rgba(236, 72, 153, 0.4)',
                  }}
                >
                  <h3 className="text-pink-200 text-sm font-medium mb-2">Breaches</h3>
                  <div className="mt-auto">
                    <div className="text-5xl font-bold text-white mb-1">2</div>
                    <button className="text-pink-300 text-sm hover:text-white transition-colors">
                      Check Now →
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Row - Quick Actions */}
              <div
                className="rounded-2xl p-6 backdrop-blur-lg h-[210px] flex flex-col"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(31, 41, 55, 0.4) 0%, rgba(17, 24, 39, 0.5) 100%)',
                  border: '1px solid rgba(75, 85, 99, 0.4)',
                }}
              >
                <h3 className="text-white text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4 flex-1">
                  {[
                    { text: "Add New App", color: "37, 99, 235" }, // blue
                    { text: "Generate Fake Data", color: "168, 85, 247" }, // purple
                    { text: "Check for Breaches", color: "251, 146, 60" }, // orange
                    { text: "Save Secure Note", color: "16, 185, 129" }, // green
                  ].map(({ text, color }) => (
                    <button
                      key={text}
                      className="text-white py-3 px-4 rounded-lg transition-all hover:scale-[1.02] text-sm"
                      style={{
                        background: `linear-gradient(135deg, rgba(${color}, 0.25) 0%, rgba(17, 24, 39, 0.5) 100%)`,
                        border: `1px solid rgba(${color}, 0.5)`,
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      {text}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Overall Data Risk */}
            <div
              className="flex flex-col justify-center items-center w-[350px] rounded-2xl p-6 backdrop-blur-lg"
              style={{
                background:
                  'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(20, 184, 166, 0.25) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
              }}
            >
              <h3 className="text-green-200 text-sm font-medium mb-6">Overall Data Risk</h3>
              <CircularGauge percentage={50} size={150} />
            </div>
          </div>


          {/* Privacy Tips */}
          <div
            className="rounded-2xl p-8 mb-8 border backdrop-blur-xl shadow-xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(17, 24, 39, 0.75) 0%, rgba(3, 7, 18, 0.9) 100%)",
              border: "1px solid rgba(75, 85, 99, 0.5)",
            }}
          >
            <h3 className="text-white text-2xl font-semibold mb-8 text-center tracking-wide">
              Privacy Tips
            </h3>

            <div className="grid grid-cols-1  md:grid-cols-2 gap-6">
              {/* Tip 1 */}
              <div
                className="rounded-xl p-5 h-32 border hover:scale-[1.03] transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(239,68,68,0.25) 0%, rgba(127,29,29,0.3) 100%)",
                  border: "1px solid rgba(239,68,68,0.4)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className='mt-5'>
                  <h4 className="text-white font-semibold mb-2">Use Strong Passwords</h4>
                  <p className="text-red-200 text-sm">
                    Create complex passwords for each service and avoid reusing them.
                  </p>
                </div>
              </div>

              {/* Tip 2 */}
              <div
                className="rounded-xl p-5 h-32 border hover:scale-[1.03] transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(251,191,36,0.25) 0%, rgba(120,53,15,0.3) 100%)",
                  border: "1px solid rgba(251,191,36,0.4)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className='mt-5'>
                  <h4 className="text-white font-semibold mb-2">Limit App Permissions</h4>
                  <p className="text-yellow-200 text-sm">
                    Only allow access to data that’s absolutely necessary for apps to
                    function.
                  </p>
                </div>
              </div>

              {/* Tip 3 */}
              <div
                className="rounded-xl p-5 h-32 border hover:scale-[1.03] transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(168,85,247,0.25) 0%, rgba(88,28,135,0.3) 100%)",
                  border: "1px solid rgba(168,85,247,0.4)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <h4 className="text-white font-semibold mb-2">Use Fake Identity</h4>
                <p className="text-purple-200 text-sm">
                  Use the Fake Data Generator to protect your real details on
                  non-trustworthy platforms.
                </p>
              </div>

              {/* Tip 4 */}
              <div
                className="rounded-xl p-5 border hover:scale-[1.03] transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(34,197,94,0.25) 0%, rgba(6,95,70,0.3) 100%)",
                  border: "1px solid rgba(34,197,94,0.4)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <h4 className="text-white font-semibold mb-2">
                  Check for Data Breaches Regularly
                </h4>
                <p className="text-green-200 text-sm">
                  Scan your email to know if your info has been leaked online.
                </p>
              </div>
            </div>
          </div>


        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;