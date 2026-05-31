import { Search, CreditCard, Mail } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { fetchSettings, getSettingsCache } from '../services/api';

export default function HowItWorks() {
  const [settings, setSettings] = useState<Record<string, string>>(getSettingsCache() || {});

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetchSettings();
        setSettings(response || {});
      } catch (err) {
        console.error('Failed to load settings in HowItWorks:', err);
      }
    }
    loadSettings();
  }, []);

  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto-play effect
  useEffect(() => {
    // Apenas roda no mobile onde o display muda para scroll-snap
    if (window.innerWidth > 768) return;

    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        const maxScroll = scrollWidth - clientWidth;
        
        if (scrollLeft >= maxScroll - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carouselRef.current.scrollBy({ left: clientWidth * 0.8, behavior: 'smooth' });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      number: '01',
      icon: <Search size={28} />,
      title: settings.how_step1_title || 'Escolha seu Evento',
      description: settings.how_step1_text || 'Navegue pela nossa seleção de eventos e encontre o que combina com você. Shows, festivais, festas e muito mais.',
      color: '#8b5cf6',
      glow: 'rgba(139,92,246,0.4)',
    },
    {
      number: '02',
      icon: <CreditCard size={28} />,
      title: settings.how_step2_title || 'Finalize sua Compra',
      description: settings.how_step2_text || 'Pague com segurança via PIX, cartão de crédito ou boleto. Todo o processo em menos de 2 minutos.',
      color: '#ec4899',
      glow: 'rgba(236,72,153,0.4)',
    },
    {
      number: '03',
      icon: <Mail size={28} />,
      title: settings.how_step3_title || 'Receba no seu E-mail',
      description: settings.how_step3_text || 'Seu ingresso digital chega imediatamente no e-mail com QR Code único. Simples, rápido e seguro.',
      color: '#a78bfa',
      glow: 'rgba(167,139,250,0.4)',
    },
  ];

  return (
    <section id="como-funciona" style={{
      padding: '96px 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background accent */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '400px',
        background: 'radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container-main" style={{ position: 'relative' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div className="badge" style={{ marginBottom: '16px', display: 'inline-flex' }}>
            <span className="badge-dot" />
            {settings.how_badge || 'Simples assim'}
          </div>
          <h2 style={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            letterSpacing: '-0.03em',
            margin: '0 0 16px',
            color: 'white',
          }}>
            {settings.how_title || 'Como Funciona'}
          </h2>
          <p style={{ color: 'rgba(248,250,252,0.6)', fontSize: '1rem', maxWidth: '420px', margin: '0 auto' }}>
            {settings.how_subtitle || 'Em 3 passos rápidos você garante seu lugar no melhor evento da cidade.'}
          </p>
        </div>

        {/* Divider Line */}
        <div style={{
          height: '1px',
          width: '100%',
          maxWidth: '600px',
          margin: '0 auto 48px',
          background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), rgba(236,72,153,0.5), rgba(167,139,250,0.5), transparent)',
        }}
          className="connector-line"
        />

        {/* Steps */}
        <div 
          ref={carouselRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px',
            position: 'relative',
          }}
          className="steps-grid hide-scrollbar"
        >
          {steps.map((step, i) => (
            <div
              key={i}
              className="step-card"
              style={{
                position: 'relative',
                zIndex: 1,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '36px 28px',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(8px)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = `${step.color}40`;
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 50px ${step.glow}`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              }}
            >
              {/* Step number */}
              <div style={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 900,
                fontSize: '0.75rem',
                color: step.color,
                letterSpacing: '0.1em',
                marginBottom: '20px',
                opacity: 0.7,
              }}>
                PASSO {step.number}
              </div>

              {/* Icon circle */}
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: `${step.color}18`,
                border: `1px solid ${step.color}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                color: step.color,
                boxShadow: `0 0 24px ${step.glow}`,
              }}>
                {step.icon}
              </div>

              <h3 style={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 800,
                fontSize: '1.15rem',
                color: 'white',
                margin: '0 0 12px',
              }}>
                {step.title}
              </h3>
              <p style={{
                fontSize: '0.88rem',
                color: 'rgba(248,250,252,0.6)',
                lineHeight: 1.65,
                margin: 0,
              }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: '56px' }}>
          <a href="#eventos" className="btn-primary" style={{ display: 'inline-flex' }}>
            <span>{settings.how_btn_text || 'Começar Agora'}</span>
          </a>
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @media (max-width: 768px) {
          .steps-grid { 
            display: flex !important;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            padding-bottom: 24px;
            scroll-behavior: smooth;
          }
          .step-card {
            scroll-snap-align: center;
            flex: 0 0 85%;
          }
          .connector-line { display: none; }
        }
      `}</style>
    </section>
  );
}
