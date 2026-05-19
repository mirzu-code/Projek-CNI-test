import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BookingFlow from './pages/BookingFlow';
import Admin from './pages/Admin';
import MyBooking from './pages/MyBooking';
import Menu from './pages/Menu';
import MalayCuisine from './pages/MalayCuisine';
import ChineseCuisine from './pages/ChineseCuisine';
import JapaneseCuisine from './pages/JapaneseCuisine';
import WesternCuisine from './pages/WesternCuisine';
import IndianCuisine from './pages/IndianCuisine';
import About from './pages/About';
import Checkout from './pages/Checkout';
import SelectTable from './pages/SelectTable';
import SplashScreen from './components/SplashScreen';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <Router>
      {showSplash && <SplashScreen onFinished={() => setShowSplash(false)} />}
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book" element={<BookingFlow />} />
            <Route path="/select-table" element={<SelectTable />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/my-booking" element={<MyBooking />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/menu/malay" element={<MalayCuisine />} />
            <Route path="/menu/chinese" element={<ChineseCuisine />} />
            <Route path="/menu/japanese" element={<JapaneseCuisine />} />
            <Route path="/menu/western" element={<WesternCuisine />} />
            <Route path="/menu/indian" element={<IndianCuisine />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

