import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api.jsx';



export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About CV Management</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About Us</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            CV Management System is a modern and user-friendly platform that helps you create and manage your professional CV easily. Whether you're a student, job seeker, or career changer, our platform provides all the tools you need.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            We believe that a good CV is crucial for your career success. That's why we provide the best tools, templates, and resources to help you stand out to employers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-3">Our Mission</h3>
            <p className="text-blue-800">To help every individual achieve their career goals by providing them with the best CV management tools and resources.</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-purple-900 mb-3">Our Vision</h3>
            <p className="text-purple-800">To build a global platform where anyone can create professional, ATS-optimized CVs that get them hired.</p>
          </div>
        </div>

        <Link to="/" className="btn btn-primary bg-purple-600 border-0 hover:bg-purple-700">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
