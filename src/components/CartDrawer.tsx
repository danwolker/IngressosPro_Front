import { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { fetchSettings } from '../services/api';

export default function CartDrawer() {
  const { items, cartOpen, setCartOpen, removeItem, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    if (cartOpen) {
      fetchSettings().then(setSettings).catch(console.error);
    }
  }, [cartOpen]);

  return (
    <div style={{ 
      pointerEvents: cartOpen ? 'auto' : 'none',
      position: 'fixed',
      inset: 0,
      zIndex: 999,
      visibility: cartOpen ? 'visible' : 'hidden',
      transition: 'visibility 0.4s'
    }}>
      {/* Backdrop */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          opacity: cartOpen ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div 
        style={{
          position: 'fixed',
          top: '16px', // Float effect
          right: '16px',
          bottom: '16px',
          width: 'calc(100% - 32px)',
          maxWidth: '350px',
          background: 'linear-gradient(180deg, rgba(15, 6, 40, 0.95) 0%, rgba(5, 2, 15, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px', // Arredondado em todos os cantos
          border: '1px solid rgba(139, 92, 246, 0.2)',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          transform: cartOpen ? 'translateX(0)' : 'translateX(120%)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'hidden',
        }}
      >
        {/* Dynamic Glow Background inside Drawer */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-20%',
          width: '80%',
          height: '50%',
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />
        {/* Header */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          padding: '24px',
          borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.02)',
        }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '8px', 
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <ShoppingBag size={16} color="white" />
            </div>
            Seu Carrinho
          </h2>
          <button 
            onClick={() => setCartOpen(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50%',
              color: 'rgba(255,255,255,0.8)',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
              e.currentTarget.style.color = '#ef4444';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'white', marginTop: '40px' }}>
              <ShoppingBag size={48} style={{ margin: '0 auto 16px', opacity: 1, color: 'white' }} />
              <p style={{ fontWeight: 500, fontSize: '1.1rem' }}>Seu carrinho está vazio.</p>
              <button 
                onClick={() => setCartOpen(false)}
                style={{
                  background: 'none',
                  border: '1px solid #a78bfa',
                  color: '#a78bfa',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  marginTop: '16px',
                  cursor: 'pointer',
                }}
              >
                Continuar comprando
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {items.map((item) => (
                <div key={item.event.id} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  padding: '12px',
                  display: 'flex',
                  gap: '12px',
                }}>
                  {item.event.image ? (
                    <img 
                      src={`http://127.0.0.1:8000${item.event.image}`} 
                      alt={item.event.name}
                      style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ 
                      width: '60px', height: '60px', borderRadius: '8px', 
                      background: 'rgba(139, 92, 246, 0.2)', display: 'flex', 
                      alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' 
                    }}>
                      {item.event.icon || '🎵'}
                    </div>
                  )}
                  
                  <div style={{ flex: 1 }}>
                    <h4 style={{ color: 'white', margin: '0 0 4px 0', fontSize: '0.9rem' }}>{item.event.name}</h4>
                    <p style={{ color: '#a78bfa', margin: '0 0 8px 0', fontWeight: 700, fontSize: '0.9rem' }}>
                      R$ {Number(item.event.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {/* Quantity Controls */}
                      <div style={{ 
                        display: 'flex', alignItems: 'center', gap: '12px', 
                        background: 'rgba(0,0,0,0.3)', borderRadius: '20px', padding: '2px 4px' 
                      }}>
                        <button 
                          onClick={() => updateQuantity(item.event.id, item.quantity - 1)}
                          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '4px' }}
                        ><Minus size={14} /></button>
                        <span style={{ color: 'white', fontSize: '0.9rem', width: '20px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => {
                            const max = Number(settings.ticket_max_per_user) || 10;
                            if (item.quantity < max) updateQuantity(item.event.id, item.quantity + 1);
                          }}
                          style={{ 
                            background: 'none', border: 'none', 
                            color: item.quantity >= (Number(settings.ticket_max_per_user) || 10) ? 'rgba(255,255,255,0.2)' : 'white', 
                            cursor: item.quantity >= (Number(settings.ticket_max_per_user) || 10) ? 'not-allowed' : 'pointer', 
                            padding: '4px' 
                          }}
                        ><Plus size={14} /></button>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(item.event.id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            position: 'relative',
            zIndex: 1,
            padding: '24px',
            borderTop: '1px solid rgba(139, 92, 246, 0.1)',
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'white', fontSize: '1.1rem' }}>
              <span>Total:</span>
              <span style={{ fontWeight: 800 }}>
                R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            
            <button 
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
              onClick={() => {
                setCartOpen(false);
                navigate('/checkout');
              }}
            >
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
