import { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Clock, Ticket, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchEvents, fetchSettings, getSettingsCache } from '../services/api';
import { useCart } from '../contexts/CartContext';
import type { Event } from '../types';

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function availabilityColor(event: Event, settings: any) {
  if (event.status === 'sold_out' || event.sold >= event.quantity) return '#6b7280'; // cinza
  const pct = (event.sold / event.quantity) * 100;
  const critical = Number(settings?.ticket_availability_critical) || 90;
  const warning = Number(settings?.ticket_availability_warning) || 70;
  if (pct >= critical) return '#ef4444';
  if (pct >= warning) return '#f59e0b';
  return '#10b981';
}

function availabilityLabel(event: Event, settings: any) {
  if (event.status === 'sold_out' || event.sold >= event.quantity) return 'Esgotado';
  const pct = (event.sold / event.quantity) * 100;
  const critical = Number(settings?.ticket_availability_critical) || 90;
  const warning = Number(settings?.ticket_availability_warning) || 70;
  if (pct >= critical) return 'Últimos ingressos!';
  if (pct >= warning) return 'Poucos ingressos';
  return 'Disponível';
}

function EventCard({ event, settings }: { event: Event; settings: any }) {
  const { items, addItem } = useCart();
  const [hovered, setHovered] = useState(false);
  const remaining = event.quantity - event.sold;
  const pct = (event.sold / event.quantity) * 100;
  const color = availabilityColor(event, settings);
  
  const isSoldOut = event.status === 'sold_out' || event.sold >= event.quantity;
  const inCart = items.find(i => i.event.id === event.id)?.quantity || 0;
  const max = Number(settings?.ticket_max_per_user) || 10;
  const canAdd = !isSoldOut && inCart < max;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${hovered ? 'rgba(139,92,246,0.4)' : 'rgba(139,92,246,0.12)'}`,
        borderRadius: '20px',
        overflow: 'hidden',
        transition: 'all 0.35s ease',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 24px 60px rgba(139,92,246,0.25)'
          : '0 4px 20px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image */}
      <div style={{
        height: '200px',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1a0a3e, #2d0a3e)',
        flexShrink: 0,
      }}>
        {event.image ? (
          <img 
            src={`http://127.0.0.1:8000${event.image}`}
            alt={event.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 30% 40%, rgba(139,92,246,0.5) 0%, transparent 55%), radial-gradient(ellipse at 70% 60%, rgba(236,72,153,0.4) 0%, transparent 55%)',
              transition: 'opacity 0.3s ease',
              opacity: hovered ? 1 : 0.8,
            }} />
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}>
              <div style={{ fontSize: '3.5rem' }}>
                🎵
              </div>
            </div>
          </>
        )}

        {/* Featured badge */}
        {event.featured && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            color: 'white',
            fontSize: '0.7rem',
            fontWeight: 800,
            padding: '4px 12px',
            borderRadius: '50px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            boxShadow: '0 2px 12px rgba(139,92,246,0.5)',
          }}>
            ⭐ Destaque
          </div>
        )}

        {/* Availability badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: `${color}22`,
          border: `1px solid ${color}66`,
          color: pct >= (Number(settings?.ticket_availability_critical) || 90) ? 'white' : color,
          fontSize: '0.7rem',
          fontWeight: 700,
          padding: '4px 10px',
          borderRadius: '50px',
        }}>
          {availabilityLabel(event, settings)}
        </div>

        {/* Hover overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(139,92,246,0.08)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }} />
      </div>

      {/* Content */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        <div>
          <h3 style={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 800,
            fontSize: '1.1rem',
            color: 'white',
            margin: '0 0 8px',
            lineHeight: 1.3,
          }}>
            {event.name}
          </h3>
          <p style={{
            fontSize: '0.83rem',
            color: 'rgba(248,250,252,0.55)',
            margin: 0,
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {event.description}
          </p>
        </div>

        {/* Info rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.83rem', color: 'rgba(248,250,252,0.6)' }}>
            <Calendar size={13} style={{ color: '#a78bfa', flexShrink: 0 }} />
            {formatDate(event.date)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.83rem', color: 'rgba(248,250,252,0.6)' }}>
            <Clock size={13} style={{ color: '#a78bfa', flexShrink: 0 }} />
            {event.time}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.83rem', color: 'rgba(248,250,252,0.6)' }}>
            <MapPin size={13} style={{ color: '#a78bfa', flexShrink: 0 }} />
            {event.venue} — {event.city}
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span style={{ fontSize: '0.72rem', color: 'rgba(248,250,252,0.45)' }}>
              {remaining} ingressos restantes
            </span>
            <span style={{ fontSize: '0.72rem', color, fontWeight: 700 }}>
              {Math.round(pct)}% vendido
            </span>
          </div>
          <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${pct}%`,
              background: `linear-gradient(90deg, #8b5cf6, ${color})`,
              borderRadius: '2px',
              transition: 'width 0.8s ease',
            }} />
          </div>
        </div>

        {/* Amenidades */}
        {event.amenities && event.amenities.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
            {event.amenities.map((amenity, idx) => (
              <span key={idx} style={{
                fontSize: '0.7rem', fontWeight: 600,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(248,250,252,0.8)', padding: '2px 8px', borderRadius: '20px',
              }}>✓ {amenity}</span>
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          marginTop: 'auto',
        }}>
          <div style={{ flex: 1 }}>
            {event.original_price && (
              <div style={{ fontSize: '0.75rem', color: 'rgba(248,250,252,0.4)', textDecoration: 'line-through' }}>
                R$ {event.original_price.toFixed(2).replace('.', ',')}
              </div>
            )}
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>
              R$ {Number(event.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          
          <button 
            className="btn-primary" 
            style={{ 
              padding: '8px 20px', 
              fontSize: '0.85rem',
              opacity: canAdd ? 1 : 0.5,
              cursor: canAdd ? 'pointer' : 'not-allowed',
              background: isSoldOut ? '#4b5563' : undefined,
              borderColor: isSoldOut ? '#4b5563' : undefined,
            }}
            onClick={(e) => {
              e.preventDefault();
              if (canAdd) addItem(event);
            }}
          >
            <Ticket size={16} />
            <span>{isSoldOut ? 'Esgotado' : (canAdd ? 'Comprar' : 'Máximo atingido')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Record<string, string>>(getSettingsCache() || {});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { addItem } = useCart();
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    async function load() {
      try {
        const [data, config] = await Promise.all([
          fetchEvents(),
          fetchSettings()
        ]);
        setEvents(data);
        setSettings(config);
      } catch (err: any) {
        console.error('Failed to load events', err);
        setErrorMsg(err.message || String(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Auto-play effect
  useEffect(() => {
    if (!events.length) return;
    
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        const maxScroll = scrollWidth - clientWidth;
        
        if (scrollLeft >= maxScroll - 10) {
          // Voltar para o início
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Rolar para o próximo (aprox. 320px do card + gap)
          carouselRef.current.scrollBy({ left: 324, behavior: 'smooth' });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [events]);

  return (
    <section id="eventos" className="section">
      <div className="container-main">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="badge" style={{ marginBottom: '16px', display: 'inline-flex' }}>
            <Tag size={12} />
            {settings.events_badge || 'Próximos Eventos'}
          </div>
          <h2 style={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            letterSpacing: '-0.03em',
            margin: '0 0 16px',
            color: 'white',
          }}>
            {settings.events_title || 'Ingressos em'}{' '}
            <span className="gradient-text">{settings.events_title_gradient || 'Destaque'}</span>
          </h2>
          <p style={{ color: 'rgba(248,250,252,0.6)', fontSize: '1rem', maxWidth: '480px', margin: '0 auto' }}>
            {settings.events_subtitle || 'Garanta seu ingresso antes que esgotem. Os melhores eventos do Brasil, com entrega digital instantânea.'}
          </p>
        </div>

        {/* Carousel Container */}
        <div style={{ position: 'relative' }}>
          
          {/* Navigation Arrows (Desktop) */}
          {events.length > 0 && (
            <>
              <button 
                onClick={scrollLeft}
                className="carousel-btn left"
                aria-label="Anterior"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={scrollRight}
                className="carousel-btn right"
                aria-label="Próximo"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div 
            ref={carouselRef}
            className="events-carousel hide-scrollbar"
            style={{
              display: 'flex',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              gap: '24px',
              paddingBottom: '24px',
              scrollBehavior: 'smooth',
            }}
          >
            {loading ? (
              <div style={{ color: 'white', textAlign: 'center', width: '100%', padding: '40px 0' }}>
                Carregando eventos em destaque...
              </div>
            ) : errorMsg ? (
              <div style={{ color: '#ef4444', textAlign: 'center', width: '100%', padding: '40px 0' }}>
                Erro: {errorMsg}
              </div>
            ) : events.length === 0 ? (
              <div style={{ color: 'white', textAlign: 'center', width: '100%', padding: '40px 0' }}>
                Nenhum evento em destaque no momento.
              </div>
            ) : (
              events.map(event => (
                <div key={event.id} style={{ scrollSnapAlign: 'start', flex: '0 0 auto', width: '300px' }}>
                  <EventCard event={event} settings={settings} />
                </div>
              ))
            )}
          </div>
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
        .carousel-btn {
          position: absolute;
          top: calc(50% - 12px);
          transform: translateY(-50%);
          z-index: 10;
          background: rgba(5,2,15,0.8);
          border: 1px solid rgba(139,92,246,0.3);
          color: white;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        }
        .carousel-btn:hover {
          background: rgba(139,92,246,0.2);
          border-color: rgba(139,92,246,0.6);
        }
        .carousel-btn.left {
          left: -60px;
        }
        .carousel-btn.right {
          right: -60px;
        }
        @media (max-width: 900px) {
          .carousel-btn { display: none; }
        }
      `}</style>
    </section>
  );
}
