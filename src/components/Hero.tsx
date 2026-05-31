import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Play, Star, Zap, Users, Ticket } from 'lucide-react';
import { fetchFeaturedEvents, fetchSettings, getSettingsCache } from '../services/api';
import { useCart } from '../contexts/CartContext';
import type { Event } from '../types';

// Animated particle background
function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      r: number; opacity: number;
      color: string;
    }

    const colors = ['#8b5cf6', '#ec4899', '#a78bfa', '#f472b6'];
    const particles: Particle[] = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.6 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
}

export default function Hero() {
  const [heroEvent, setHeroEvent] = useState<Event | null>(null);
  const [settings, setSettings] = useState<Record<string, string>>(getSettingsCache() || {});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    async function loadData() {
      try {
        const [events, config] = await Promise.all([
          fetchFeaturedEvents(),
          fetchSettings()
        ]);
        if (events && events.length > 0) {
          setHeroEvent(events[0]);
        }
        setSettings(config);
      } catch (err: any) {
        console.error('Failed to load hero data', err);
        setErrorMsg(err.message || String(err));
      }
    }
    loadData();
  }, []);

  return (
    <section
      id="home"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background image layer */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${settings.hero_bg_image || '/assets/hero-bg.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
      }} />

      {/* Dark overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          linear-gradient(to right, rgba(5,2,15,0.95) 0%, rgba(5,2,15,0.75) 55%, rgba(5,2,15,0.5) 100%),
          linear-gradient(to bottom, rgba(5,2,15,0.3) 0%, transparent 30%, transparent 70%, rgba(5,2,15,1) 100%)
        `,
      }} />

      {/* Particles */}
      <Particles />

      {/* Glow orbs */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '5%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div className="container-main" style={{ position: 'relative', zIndex: 2, paddingTop: '100px', paddingBottom: '80px' }}>
        <div className="hero-grid" style={{ display: 'grid', gap: '60px', alignItems: 'center' }}>

          {/* Left: Text */}
          <div>
            {/* Badge */}
            <div className="badge" style={{ marginBottom: '28px' }}>
              <span className="badge-dot" />
              {settings.hero_badge || 'Temporada 2025 — Novos Eventos Disponíveis'}
            </div>

            {/* Headline */}
            <h1 style={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              margin: '0 0 24px',
              color: 'white',
            }}>
              {settings.hero_title || 'Sua Experiência'}{' '}
              <span className="gradient-text" style={{ display: 'block' }}>
                {settings.hero_title_gradient || 'Começa Aqui'}
              </span>
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: '1.1rem',
              lineHeight: 1.7,
              color: 'rgba(248,250,252,0.70)',
              maxWidth: '480px',
              margin: '0 0 40px',
              fontWeight: 400,
            }}>
              {settings.hero_subtitle || 'Ingressos para os melhores shows, festivais e festas do Brasil. Compra 100% segura, entrega digital instantânea no seu e-mail.'}
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '52px' }}>
              <a href="#eventos" className="btn-primary">
                <span>Explorar Eventos</span>
                <ArrowRight size={18} />
              </a>
              <a href="#como-funciona" className="btn-ghost">
                <Play size={16} fill="currentColor" />
                <span>Como Funciona</span>
              </a>
            </div>

            </div>

          {/* Right: Floating event card */}
          <div style={{ display: 'flex', justifyContent: 'center' }}
            className="hero-right-panel"
          >
            <div
              className="animate-float"
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '420px',
              }}
            >
              {/* Main card */}
              {heroEvent ? (
              <div
                className="glass-card animate-glow-pulse"
                style={{
                  overflow: 'hidden',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                }}
              >
                <div style={{
                  height: '260px',
                  background: 'linear-gradient(135deg, #1a0a3e 0%, #2d0a3e 50%, #1a0a2e 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {heroEvent.image ? (
                    <img 
                      src={`http://127.0.0.1:8000${heroEvent.image}`}
                      alt={heroEvent.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <>
                      {/* Concert lights effect */}
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(ellipse at 30% 30%, rgba(139,92,246,0.4) 0%, transparent 50%), radial-gradient(ellipse at 70% 70%, rgba(236,72,153,0.3) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(168,85,247,0.2) 0%, transparent 40%)',
                      }} />
                      <div style={{
                        zIndex: 1,
                        textAlign: 'center',
                      }}>
                        <div style={{ fontSize: '4rem', marginBottom: '8px' }}>🎵</div>
                        <div style={{
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          color: 'white',
                        }}>{heroEvent.name}</div>
                      </div>
                    </>
                  )}
                  {/* Esgotado badge */}
                  {(heroEvent.status === 'sold_out' || heroEvent.quantity - heroEvent.sold <= 0) && (
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: '#475569',
                      color: 'white',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '50px',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      boxShadow: '0 0 12px rgba(71,85,105,0.6)',
                    }}>
                      ESGOTADO
                    </div>
                  )}
                </div>

                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: 'white', marginBottom: '4px' }}>
                        {heroEvent.name}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'rgba(248,250,252,0.55)' }}>
                        📍 {heroEvent.venue}, {heroEvent.city}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.82rem', color: 'rgba(248,250,252,0.55)' }}>
                      🗓 {new Date(heroEvent.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} • {heroEvent.time}
                    </div>
                  </div>

                  {heroEvent.amenities && heroEvent.amenities.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                      {heroEvent.amenities.map((amenity, idx) => (
                        <span key={idx} style={{
                          fontSize: '0.7rem', fontWeight: 600,
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'rgba(248,250,252,0.8)', padding: '2px 8px', borderRadius: '20px',
                        }}>✓ {amenity}</span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#a78bfa' }}>
                      R$ {Number(heroEvent.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    
                    {(heroEvent.status === 'sold_out' || heroEvent.quantity - heroEvent.sold <= 0) ? (
                      <button 
                        className="btn-primary" 
                        style={{ padding: '8px 24px', background: '#334155', cursor: 'not-allowed', color: 'rgba(255,255,255,0.5)', opacity: 0.8 }}
                        disabled
                      >
                        <span>Esgotado</span>
                      </button>
                    ) : (
                      <button 
                        className="btn-primary" 
                        style={{ padding: '8px 24px' }}
                        onClick={(e) => {
                          e.preventDefault();
                          addItem(heroEvent);
                        }}
                      >
                        <Ticket size={16} />
                        <span>Comprar</span>
                      </button>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(248,250,252,0.5)' }}>Ingressos disponíveis</span>
                      <span style={{ fontSize: '0.72rem', color: '#ec4899', fontWeight: 700 }}>
                        {heroEvent.quantity > 0 ? Math.round(((heroEvent.quantity - heroEvent.sold) / heroEvent.quantity) * 100) : 0}% restam
                      </span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: (heroEvent.quantity > 0 ? ((heroEvent.sold / heroEvent.quantity) * 100) : 0) + '%',
                        background: 'linear-gradient(90deg, #8b5cf6, #ec4899)',
                        borderRadius: '2px',
                      }} />
                    </div>
                  </div>
                </div>
              </div>
              ) : (
                <div className="glass-card" style={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', flexDirection: 'column', textAlign: 'center', padding: '20px' }}>
                  {errorMsg ? (
                    <span style={{ color: '#ef4444' }}>Erro: {errorMsg}</span>
                  ) : (
                    <span>Carregando...</span>
                  )}
                </div>
              )}

              {/* Floating badge */}
              <div style={{
                position: 'absolute',
                top: '-16px',
                left: '-16px',
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '8px 16px',
                borderRadius: '50px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                boxShadow: '0 4px 20px rgba(139,92,246,0.5)',
                animation: 'glow-pulse 3s ease-in-out infinite',
              }}>
                Destaque
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom neon divider */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), rgba(236,72,153,0.5), transparent)',
      }} />

      <style>{`
        .hero-grid {
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr; text-align: center; }
          .hero-grid > div:first-child { display: flex; flex-direction: column; align-items: center; width: 100%; }
          .hero-grid > div:first-child p { margin-left: auto; margin-right: auto; text-align: center; }
          .hero-grid > div:first-child h1 { text-align: center; }
          .hero-grid > div:first-child .badge { margin-left: auto; margin-right: auto; }
          .hero-grid > div:first-child div[style*="flex-wrap"] { justify-content: center; width: 100%; }
          .hero-right-panel { display: none !important; }
        }
      `}</style>
    </section>
  );
}
