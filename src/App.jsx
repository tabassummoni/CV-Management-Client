import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './Components/Nevber'
import Footer from './Components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  )
}

export default App
