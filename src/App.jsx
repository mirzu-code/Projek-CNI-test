import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BookingFlow from './pages/BookingFlow';
import Admin from './pages/Admin';
import MyBooking from './pages/MyBooking';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book" element={<BookingFlow />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/my-booking" element={<MyBooking />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
