import images from '../assets/'

const Footer = () => {
  return (
    <footer className="relative z-10 py-16 px-8 bg-slate-900/80">
      <div className="max-w-7xl mx-auto">
        {/* Footer Content Container with Green Border */}
        <div className="border border-[#a2e535] rounded-3xl p-12 bg-slate-800/30 backdrop-blur-sm">
          <div className="relative flex flex-col md:flex-row">

            {/* Brand Section */}
            <div className="flex-1 space-y-6 px-0 md:pr-12 text-center md:text-left">
              <div className="flex justify-center md:justify-start items-center space-x-3">
                <img src={images.logo} alt="SenTriq" className="h-12 w-12" />
                <span className="text-3xl font-bold text-white">SenTriq</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Where Privacy</h3>
                <h3 className="text-2xl font-bold text-white">Meets Control.</h3>
              </div>
            </div>

            {/* Divider 1 → Vertical on desktop, horizontal on mobile */}
            <div className="md:hidden my-8 h-px w-full bg-[#a2e535]"></div>
            <div className="hidden md:block absolute left-1/3 top-0 bottom-0 w-px bg-[#a2e535]"></div>

            {/* Information Section */}
            <div className="flex-1 space-y-6 px-0 md:px-12 mt-12 md:mt-0 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white">Information</h3>
              <div className="space-y-4">
                {["Privacy Policy", "Terms of Service", "About Us", "Contact", "FAQ"].map((item, i) => (
                  <a
                    key={i}
                    href="#"
                    className="block text-slate-300 hover:text-[#a2e535] transition-colors text-lg"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* Divider 2 → Vertical on desktop, horizontal on mobile */}
            <div className="md:hidden my-8 h-px w-full bg-[#a2e535]"></div>
            <div className="hidden md:block absolute left-2/3 top-0 bottom-0 w-px bg-[#a2e535]"></div>

            {/* Connect With Us Section */}
            <div className="flex-1 space-y-6 px-0 md:pl-12 mt-12 md:mt-0 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white">Connect With Us</h3>
              <div className="space-y-4">
                {["Twitter", "LinkedIn", "GitHub", "Discord", "Support"].map((item, i) => (
                  <a
                    key={i}
                    href="#"
                    className="block text-slate-300 hover:text-[#a2e535] transition-colors text-lg"
                  >
                    {item}
                  </a>
                ))}
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
  )
}

export default Footer
