import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-white mb-4">404</h1>
        <h2 className="text-4xl font-bold text-gray-200 mb-2">Page Not Found</h2>
        <p className="text-xl text-gray-400 mb-8">এই পেজটি খুঁজে পাওয়া যায়নি</p>
        
        <div className="mb-8">
          <svg className="w-32 h-32 mx-auto text-gray-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <Link to="/" className="btn btn-lg btn-primary bg-purple-600 border-0 hover:bg-purple-700">
          Home এ ফিরে যান
        </Link>
      </div>
    </div>
  )
}
