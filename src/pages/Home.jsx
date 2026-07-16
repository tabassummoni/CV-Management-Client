import { Link, useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="bg-white">
      <section className="min-h-[700px] bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white flex items-center">
        <div className="max-w-6xl mx-auto px-4 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl text-center rounded-2xl font-bold mb-6  leading-tight">
                Create Your Perfect CV
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Build a professional resume in minutes with our easy-to-use CV management system. Stand out to employers!
              </p>
              <div className="flex gap-4 mt-4 ">
                <Link to="/dashboard" state={{ openCreateCvModal: true }} className="btn text-center btn-lg rounded-2xl btn-outline text-2xl font-bold text-white border-white hover:bg-white hover:text-purple-600">
                  Start Creating
                </Link>
                <Link to="/templates" className="btn btn-lg btn-outline text-2xl rounded-2xl font-bold text-white border-white hover:bg-white hover:text-purple-600">
                  View Templates
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="w-full h-96 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm flex items-center justify-center">
                <div className="text-6xl">📄</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">Why Choose Us?</h2>
          <h6 className="text-center  text-gray-600 mb-4 text-lg max-w-2xl mx-auto">
            Everything you need to create a stunning CV that gets you noticed by employers.
          </h6>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Lightning Fast</h3>
              <p className="text-gray-600">
                Create and edit your CV in seconds. Our intuitive interface makes it easy for everyone.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Professional Templates</h3>
              <p className="text-gray-600">
                Choose from beautifully designed templates that are proven to impress employers.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Secure & Private</h3>
              <p className="text-gray-600">
                Your data is encrypted and stored securely. We never share your information.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Mobile Friendly</h3>
              <p className="text-gray-600">
                Access your CV from any device. Update it anytime, anywhere with ease.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">ATS Optimized</h3>
              <p className="text-gray-600">
                Our CVs are optimized for Applicant Tracking Systems to pass filters.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Export Options</h3>
              <p className="text-gray-600">
                Download as PDF, Word, or share directly with employers.
              </p>
            </div>
          </div>
        </div>
      </section>
<section>
  <div className="relative my-16 mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral/60 to-base-300/80 p-8 shadow-2xl backdrop-blur-xl">
  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl animate-pulse"></div>
  <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-accent/20 blur-3xl animate-pulse delay-700"></div>

  <div className="relative flex flex-col items-center text-center">
    <div className="badge badge-outline badge-accent gap-2 px-4 py-3 text-xs font-semibold tracking-wider uppercase mb-4">
      ✨ Talent Directory
    </div>

    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-3">
      Explore All Generated <span className="bg-gradient-to-r from-primary via-purple-400 to-accent bg-clip-text text-transparent">Candidate CVs</span>
    </h2>

    <p className="max-w-xl text-sm leading-relaxed text-base-content/70 mb-6">
      Access the global registry of professionally generated resumes. Filter by customized recruiter positions, view live talent statistics, and review portfolios seamlessly in a clean database table view.
    </p>

    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
      <button
        onClick={() => navigate('/all-cvs')}
        className="group relative inline-flex items-center justify-center gap-2 btn btn-primary px-8 text-white bg-gradient-to-r from-primary to-purple-600 border-none shadow-lg hover:from-purple-600 hover:to-primary hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
      >
        🔍 View All CVs Directory
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={2} 
          stroke="currentColor" 
          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </button>
    </div>
  </div>
</div>
</section>
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Choose Template</h3>
              <p className="text-gray-600">Select from our professional CV templates</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Fill Information</h3>
              <p className="text-gray-600">Add your experience, education, and skills</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Customize Design</h3>
              <p className="text-gray-600">Personalize colors, fonts, and layout</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-bold mb-2">Download & Share</h3>
              <p className="text-gray-600">Get your CV and start applying!</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of job seekers who have created their perfect CV
          </p>
          <Link to="/dashboard" state={{ openCreateCvModal: true }} className="btn btn-lg bg-white text-purple-600 border-0 hover:bg-gray-100">
            Create Your CV Now
          </Link>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-purple-600 mb-2">10K+</div>
              <p className="text-gray-600 text-lg">CVs Created</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-purple-600 mb-2">95%</div>
              <p className="text-gray-600 text-lg">Success Rate</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-purple-600 mb-2">50+</div>
              <p className="text-gray-600 text-lg">Templates</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
