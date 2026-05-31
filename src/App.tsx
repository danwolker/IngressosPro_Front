import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import InstitutionalPage from './pages/InstitutionalPage';
import { CartProvider } from './contexts/CartContext';
import CartDrawer from './components/CartDrawer';
import Checkout from './pages/Checkout';
import CookieConsent from './components/CookieConsent';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ThemeInjector from './components/ThemeInjector';

import { useState } from 'react';

function App() {
  const [themeLoaded, setThemeLoaded] = useState(false);

  return (
    <CartProvider>
      <Router>
        <ThemeInjector onLoaded={() => setThemeLoaded(true)} />
        
        {!themeLoaded ? (
          <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#05020f', color: '#fff', flexDirection: 'column', gap: '20px' }}>
             <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid rgba(139, 92, 246, 0.3)', borderTopColor: '#8b5cf6', borderRadius: '50%' }} />
             <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Preparando Experiência...</span>
          </div>
        ) : (
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/pagina/:slug" element={<InstitutionalPage />} />
            </Routes>
            <Footer />
            <CartDrawer />
            <CookieConsent />
          </>
        )}
      </Router>
    </CartProvider>
  );
}

export default App;
