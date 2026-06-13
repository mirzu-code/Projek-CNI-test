import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BackgroundMusic from './components/BackgroundMusic';
import Home from './pages/Home';
import BookingFlow from './pages/BookingFlow';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import MyBooking from './pages/MyBooking';
import Menu from './pages/Menu';
import MalayCuisine from './pages/MalayCuisine';
import ChineseCuisine from './pages/ChineseCuisine';
import JapaneseCuisine from './pages/JapaneseCuisine';
import WesternCuisine from './pages/WesternCuisine';
import IndianCuisine from './pages/IndianCuisine';
import Desserts from './pages/Desserts';
import About from './pages/About';
import Checkout from './pages/Checkout';
import SelectTable from './pages/SelectTable';
import DessertAddon from './pages/DessertAddon';
import SplashScreen from './components/SplashScreen';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinished={() => setShowSplash(false)} />;
  }

  return (
    <Router>
      <div className="app-container animate-fade-in">
        <Navbar />
        <BackgroundMusic />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book" element={<BookingFlow />} />
            <Route path="/select-table" element={<SelectTable />} />
            <Route path="/add-on-dessert" element={<DessertAddon />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/my-booking" element={<MyBooking />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/menu/malay" element={<MalayCuisine />} />
            <Route path="/menu/chinese" element={<ChineseCuisine />} />
            <Route path="/menu/japanese" element={<JapaneseCuisine />} />
            <Route path="/menu/western" element={<WesternCuisine />} />
            <Route path="/menu/indian" element={<IndianCuisine />} />
            <Route path="/menu/desserts" element={<Desserts />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin-dashboard" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

