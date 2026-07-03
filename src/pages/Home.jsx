import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white flex items-center">
        <div className="max-w-6xl mx-auto px-4 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Create Your Perfect CV
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Build a professional resume in minutes with our easy-to-use CV management system. Stand out to employers!
              </p>
              <div className="flex gap-4 mt-4 ">
                <Link to="/my-cv" className="btn text-center btn-lg btn-outline text-2xl font-bold text-white border-white hover:bg-white hover:text-purple-600">
                  Start Creating
                </Link>
                <Link to="/templates" className="btn btn-lg btn-outline text-2xl font-bold text-white border-white hover:bg-white hover:text-purple-600">
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

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">Why Choose Us?</h2>
          <h6 className="text-center  text-gray-600 mb-4 text-lg max-w-2xl mx-auto">
            Everything you need to create a stunning CV that gets you noticed by employers.
          </h6>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Lightning Fast</h3>
              <p className="text-gray-600">
                Create and edit your CV in seconds. Our intuitive interface makes it easy for everyone.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Professional Templates</h3>
              <p className="text-gray-600">
                Choose from beautifully designed templates that are proven to impress employers.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Secure & Private</h3>
              <p className="text-gray-600">
                Your data is encrypted and stored securely. We never share your information.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Mobile Friendly</h3>
              <p className="text-gray-600">
                Access your CV from any device. Update it anytime, anywhere with ease.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">ATS Optimized</h3>
              <p className="text-gray-600">
                Our CVs are optimized for Applicant Tracking Systems to pass filters.
              </p>
            </div>

            {/* Feature 6 */}
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

      {/* How It Works */}
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

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of job seekers who have created their perfect CV
          </p>
          <Link to="/my-cv" className="btn btn-lg bg-white text-purple-600 border-0 hover:bg-gray-100">
            Create Your CV Now
          </Link>
        </div>
      </section>

      {/* Stats Section */}
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
