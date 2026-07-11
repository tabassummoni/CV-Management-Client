import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './Components/Nevber'
import Footer from './Components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import LoginPage from './pages/LoginPage'
import SignUp from './pages/SignUp'
import NotFound from './pages/NotFound'
import LoginSuccess from './pages/LoginSuccess'
import Dashboard from './pages/Dashboard'
import ViewCv from './pages/ViewCv'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/login-success" element={<LoginSuccess />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/view-cv/:id" 
            element={
              <ProtectedRoute>
                <ViewCv />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </Router>
  )
}

export default App