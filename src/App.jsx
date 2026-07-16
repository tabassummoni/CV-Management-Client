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
import Templates from './pages/Tamplates';
import Contact from './pages/Contact';
import Search from './pages/Search';


const ProtectedRoute = ({ children }) => {
const token = localStorage.getItem('token');
const userRaw = localStorage.getItem('user');

  if (!token || !userRaw) {
    return <Navigate to="/login" replace />;
  }

  try {
    const parsedUser = JSON.parse(userRaw);
    if (!parsedUser || !parsedUser.email) {
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.error("🚨 App Guard Auth Error: Invalid user format in localStorage");
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
          <Route path="/templates" element={<Templates />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/Search" element={<Search />} />
          
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

export default App;