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

function App() {
  return (
    <CartProvider>
      <Router>
        <ThemeInjector />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pagina/:slug" element={<InstitutionalPage />} />
        </Routes>
        <Footer />
        <CartDrawer />
        <CookieConsent />
      </Router>
    </CartProvider>
  );
}

export default App;
