import { useState, useEffect } from 'react';
import { Menu, X, Ticket, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems, setCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { label: 'Eventos', href: '#eventos' },
    { label: 'Como Funciona', href: '#como-funciona' },
    { label: 'Contato', href: '#contato' },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.4s ease',
        background: scrolled
          ? 'rgba(5, 2, 15, 0.85)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled
          ? '1px solid rgba(139, 92, 246, 0.15)'
          : '1px solid transparent',
      }}
    >
      <div className="container-main">
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
          {/* Logo */}
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
            }}>
              <Ticket size={18} color="white" />
            </div>
            <span style={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 800,
              fontSize: '1.25rem',
              letterSpacing: '-0.02em',
              color: 'white',
            }}>
              Ingresso<span style={{ color: '#a78bfa' }}>Pro</span>
            </span>
          </a>

          {/* Desktop Links */}
          <ul style={{
            display: 'flex',
            listStyle: 'none',
            gap: '36px',
            margin: 0,
            padding: 0,
          }}
            className="nav-links-desktop"
          >
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  style={{
                    color: 'rgba(248, 250, 252, 0.75)',
                    textDecoration: 'none',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    transition: 'color 0.2s ease',
                    fontFamily: 'Outfit, sans-serif',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#a78bfa')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248, 250, 252, 0.75)')}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA / Cart */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <button 
                className="btn-primary" 
                style={{ padding: '10px 16px', fontSize: '0.88rem' }}
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCart size={20} style={{ position: 'relative', zIndex: 1 }} />
                <span className="nav-links-desktop" style={{ marginLeft: '4px', position: 'relative', zIndex: 1 }}>Carrinho</span>
              </button>
              
              {totalItems > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  background: '#ef4444',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #05020f',
                  zIndex: 2,
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.5)',
                }}>
                  {totalItems}
                </div>
              )}
            </div>
            {/* Mobile menu toggle */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '4px',
                display: 'none',
              }}
              aria-label="Menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: 'rgba(5, 2, 15, 0.98)',
          borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
          padding: '16px 24px 24px',
          backdropFilter: 'blur(20px)',
        }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '12px 0',
                    color: 'rgba(248, 250, 252, 0.8)',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li style={{ marginTop: '16px' }}>
              <button 
                className="btn-primary" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  setMenuOpen(false);
                  setCartOpen(true);
                }}
              >
                <ShoppingCart size={16} />
                <span>Ver Carrinho ({totalItems})</span>
              </button>
            </li>
          </ul>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
