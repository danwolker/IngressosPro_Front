import { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verifica se já respondeu (aceitou ou recusou)
    const consent = localStorage.getItem('@IngressoPro:cookie_consent');
    if (!consent) {
      // Pequeno delay para a animação de subida ficar suave ao abrir o site
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('@IngressoPro:cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('@IngressoPro:cookie_consent', 'declined');
    setIsVisible(false);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(90deg, rgba(10,5,20,0.95) 0%, rgba(15,8,30,0.98) 100%)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(139,92,246,0.2)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.5)',
        padding: '12px 24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div style={{ flex: '1 1 300px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <ShieldAlert size={20} color="#a78bfa" style={{ flexShrink: 0 }} />
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: '1.4', margin: 0 }}>
          Nós utilizamos cookies essenciais para o funcionamento do site e de terceiros para fins de análise. 
          Ao clicar em "Aceitar", você concorda com o uso de todos os cookies.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
        <button 
          onClick={handleDecline}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.7)',
            padding: '8px 16px',
            borderRadius: '50px',
            fontSize: '0.85rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          Recusar
        </button>
        <button 
          onClick={handleAccept}
          className="btn-primary"
          style={{ padding: '8px 20px', fontSize: '0.85rem' }}
        >
          Aceitar
        </button>
      </div>
    </div>
  );
}
