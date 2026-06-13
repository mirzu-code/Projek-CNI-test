import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BookingFlow.css';
import './DessertAddon.css';

const DESSERTS = [
  {
    id: 'd1',
    name: 'Pandan Gula Melaka Cheesecake',
    description: 'A creamy cheesecake infused with fresh pandan leaves, topped with a rich Gula Melaka glaze.',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'd2',
    name: 'Matcha Lava Cake',
    description: 'Warm matcha green tea cake with a molten center, served with vanilla bean ice cream.',
    price: 22.00,
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'd3',
    name: 'Classic Italian Tiramisu',
    description: 'Espresso-soaked ladyfingers layered with light mascarpone cream and dusted with premium cocoa.',
    price: 24.00,
    image: 'https://images.unsplash.com/photo-1571115177098-24c42d640fc9?auto=format&fit=crop&w=400&q=80'
  }
];

const DessertAddon = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.bookingData;
  const [selectedDesserts, setSelectedDesserts] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!bookingData) {
      const timer = setTimeout(() => navigate('/book'), 1500);
      return () => clearTimeout(timer);
    }
  }, [bookingData, navigate]);

  if (!bookingData) {
    return (
      <div className="booking-page animate-fade-in">
        <div className="booking-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h2>No Booking Found</h2>
          <p>Redirecting to the start...</p>
        </div>
      </div>
    );
  }

  const toggleDessert = (dessert) => {
    setSelectedDesserts(prev => {
      const isSelected = prev.find(d => d.id === dessert.id);
      if (isSelected) {
        return prev.filter(d => d.id !== dessert.id);
      } else {
        return [...prev, dessert];
      }
    });
  };

  const handleContinue = () => {
    setIsProcessing(true);
    
    // Add desserts to booking data
    const nextBooking = {
      ...bookingData,
      addonDesserts: selectedDesserts.length > 0 ? selectedDesserts : null,
      dessertTotal: selectedDesserts.reduce((sum, d) => sum + d.price, 0)
    };

    setTimeout(() => {
      navigate('/checkout', { state: { bookingData: nextBooking } });
    }, 600); // Small artificial delay for smooth UX transition
  };

  const handleSkip = () => {
    setIsProcessing(true);
    setTimeout(() => {
      navigate('/checkout', { state: { bookingData } });
    }, 600);
  };

  return (
    <div className="booking-page animate-fade-in">
      <div className="booking-container dessert-addon-container">
        <div className="booking-header">
          <span className="subtitle">Enhance Your Dining</span>
          <h2>Premium Dessert Add-Ons</h2>
          <p>Treat yourself. Pre-order our chef's signature desserts to guarantee availability.</p>
        </div>

        <div className="dessert-grid">
          {DESSERTS.map(dessert => {
            const isSelected = selectedDesserts.some(d => d.id === dessert.id);
            return (
              <div 
                key={dessert.id} 
                className={`dessert-card ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleDessert(dessert)}
              >
                <div className="dessert-img-wrapper">
                  <img src={dessert.image} alt={dessert.name} className="dessert-img" />
                  {isSelected && (
                    <div className="dessert-selected-overlay">
                      <span className="check-icon">✓ Added</span>
                    </div>
                  )}
                </div>
                <div className="dessert-info">
                  <h3>{dessert.name}</h3>
                  <p className="dessert-desc">{dessert.description}</p>
                  <div className="dessert-bottom">
                    <span className="dessert-price">RM {dessert.price.toFixed(2)}</span>
                    <button 
                      type="button" 
                      className={`btn-small ${isSelected ? 'btn-outline-active' : 'btn-outline'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDessert(dessert);
                      }}
                    >
                      {isSelected ? 'Remove' : 'Select'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="dessert-actions">
          <div className="dessert-summary">
            {selectedDesserts.length > 0 ? (
              <p><strong>{selectedDesserts.length}</strong> dessert(s) selected (+ RM {selectedDesserts.reduce((sum, d) => sum + d.price, 0).toFixed(2)})</p>
            ) : (
              <p>No desserts selected.</p>
            )}
          </div>
          <div className="dessert-btn-group">
            <button 
              type="button" 
              className="btn-text" 
              onClick={handleSkip} 
              disabled={isProcessing}
            >
              Skip & Continue
            </button>
            <button 
              type="button" 
              className="btn-primary" 
              onClick={handleContinue} 
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : (selectedDesserts.length > 0 ? 'Add & Continue to Payment' : 'Continue to Payment')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DessertAddon;
