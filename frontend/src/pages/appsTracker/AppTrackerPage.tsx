import Footer from '../../components/Footer'
import Navbar from '../../components/Navbar'
import Particles from '../../components/Particles'

const AppTrackerPage = () => {
  return (
    <>
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

        
      </div>

      <div className="absolute  left-0 right-0 h-64">
        <div className='absolute inset-0 bg-gradient-to-b from-[#146536] to-transparent'></div>
      </div>
        </div>
        <Footer/>
    </>
    )
}

export default AppTrackerPage