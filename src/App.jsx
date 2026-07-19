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
import ShowCv from './pages/ShowCv';
import AllCvs from './pages/AllCvs';
import RecruiterDashboard from  "./RecruitersPages/RecruiterDashboard";
import PositionForm from './RecruitersPages/PositionForm';
import PositionDetails from './RecruitersPages/PositionDetails';
import PublicPositionDetails from './pages/PublicPositionDetails';
import JobBoard from './pages/JobBoard';
import Profile from './pages/Profile';
import AdminDashboard from './AdminPages/AdminDashboard';

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
  const userRaw = localStorage.getItem('user');
  let userId = null;
  if (userRaw) {
    try {
      const parsedUser = JSON.parse(userRaw);
      if (parsedUser && parsedUser.id) {
        userId = parsedUser.id;
      }
    } catch (error) {
      console.error("🚨 App.jsx User-ID Parse Error:", error);
    }
  }

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
          <Route path="/all-cvs" element={<AllCvs />} />
          <Route path="/job-board" element={<JobBoard />} />
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="/recruiter/positions/new" element={<PositionForm />} />
          <Route path="/recruiter/positions/edit/:id" element={<PositionForm />} />
          <Route path="/apply/:id" element={<PublicPositionDetails />} />
          <Route path="/recruiter/positions/:id" element={<PositionDetails currentUserId={userId} />} />

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/show-cv/:id" 
            element={
              <ProtectedRoute>
                <ShowCv />
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