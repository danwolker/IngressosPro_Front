import { Ticket, Instagram, Twitter, Youtube, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchSettings, subscribeNewsletter } from '../services/api';
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    
    setLoading(true);
    setError(false);
    try {
      await subscribeNewsletter(email);
      setSuccess(true);
      setEmail('');
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetchSettings();
        setSettings(response || {});
      } catch (err) {
        console.error('Failed to load settings in footer:', err);
      }
    }
    loadSettings();
  }, []);

  return (
    <footer id="contato" style={{
      position: 'relative',
      borderTop: '1px solid rgba(139,92,246,0.15)',
      overflow: 'hidden',
    }}>
      {/* Top gradient line */}
      <div className="neon-divider" />

      {/* Main content */}
      <div style={{
        background: 'rgba(5,2,15,0.95)',
        padding: '72px 0 0',
      }}>
        <div className="container-main">
          <div className="footer-grid" style={{
            display: 'grid',
            gap: '48px',
            marginBottom: '64px',
          }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(139,92,246,0.4)',
                }}>
                  <Ticket size={18} color="white" />
                </div>
                <span style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  color: 'white',
                }}>
                  Ingresso<span style={{ color: '#a78bfa' }}>Pro</span>
                </span>
              </div>
              <p style={{
                color: 'rgba(248,250,252,0.55)',
                fontSize: '0.9rem',
                lineHeight: 1.7,
                marginBottom: '24px',
                maxWidth: '280px',
              }}>
                {settings.footer_about || 'A forma mais fácil e segura de comprar ingressos para os melhores eventos do Brasil. Entrega digital instantânea.'}
              </p>

              {/* Social */}
              <div style={{ display: 'flex', gap: '12px' }}>
                {[
                  { icon: <Instagram size={16} />, label: 'Instagram', href: '#' },
                  { icon: <Twitter size={16} />, label: 'Twitter', href: '#' },
                  { icon: <Youtube size={16} />, label: 'YouTube', href: '#' },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(248,250,252,0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.background = 'rgba(139,92,246,0.2)';
                      el.style.borderColor = 'rgba(139,92,246,0.4)';
                      el.style.color = '#a78bfa';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.background = 'rgba(255,255,255,0.05)';
                      el.style.borderColor = 'rgba(255,255,255,0.1)';
                      el.style.color = 'rgba(248,250,252,0.6)';
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links: Eventos */}
            <div>
              <h4 style={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 700,
                fontSize: '0.85rem',
                color: 'white',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}>
                Eventos
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[1, 2, 3, 4, 5].map(num => {
                  const defaultEvents = ['Shows', 'Festivais', 'Festas', 'Culturais', 'Esportes'];
                  const defaultUrls = ['#eventos', '#eventos', '#eventos', '#eventos', '#eventos'];
                  
                  const text = settings[`footer_event_link${num}_text`] ?? defaultEvents[num - 1];
                  const url = settings[`footer_event_link${num}_url`] ?? defaultUrls[num - 1];
                  
                  if (!text) return null;
                  
                  const isInternal = url.startsWith('/pagina/');
                  const linkStyle = {
                    color: 'rgba(248,250,252,0.55)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: 'color 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  };

                  return (
                    <li key={`event-${num}`}>
                      {isInternal ? (
                        <Link
                          to={url}
                          style={linkStyle}
                          onMouseEnter={e => (e.currentTarget.style.color = '#a78bfa')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,250,252,0.55)')}
                        >
                          <ArrowRight size={12} style={{ opacity: 0.5 }} />
                          {text}
                        </Link>
                      ) : (
                        <a
                          href={url}
                          style={linkStyle}
                          onMouseEnter={e => (e.currentTarget.style.color = '#a78bfa')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,250,252,0.55)')}
                        >
                          <ArrowRight size={12} style={{ opacity: 0.5 }} />
                          {text}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Links: Empresa */}
            <div>
              <h4 style={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 700,
                fontSize: '0.85rem',
                color: 'white',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}>
                Empresa
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[1, 2, 3, 4, 5].map(num => {
                  const defaultCorp = ['Sobre Nós', 'Como Funciona', 'Segurança', 'Política de Privacidade', 'Termos de Uso'];
                  const defaultUrls = ['/pagina/sobre-nos', '#como-funciona', '/pagina/seguranca', '/pagina/politica-de-privacidade', '/pagina/termos-de-uso'];
                  
                  const text = settings[`footer_corp_link${num}_text`] ?? defaultCorp[num - 1];
                  const url = settings[`footer_corp_link${num}_url`] ?? defaultUrls[num - 1];
                  
                  if (!text) return null;
                  
                  const isInternal = url.startsWith('/pagina/');
                  const linkStyle = {
                    color: 'rgba(248,250,252,0.55)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: 'color 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  };

                  return (
                    <li key={`corp-${num}`}>
                      {isInternal ? (
                        <Link
                          to={url}
                          style={linkStyle}
                          onMouseEnter={e => (e.currentTarget.style.color = '#a78bfa')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,250,252,0.55)')}
                        >
                          <ArrowRight size={12} style={{ opacity: 0.5 }} />
                          {text}
                        </Link>
                      ) : (
                        <a
                          href={url}
                          style={linkStyle}
                          onMouseEnter={e => (e.currentTarget.style.color = '#a78bfa')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,250,252,0.55)')}
                        >
                          <ArrowRight size={12} style={{ opacity: 0.5 }} />
                          {text}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 style={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 700,
                fontSize: '0.85rem',
                color: 'white',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}>
                Contato
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                {[
                  { icon: <Mail size={15} />, text: settings.contact_email || 'contato@ingressopro.com.br' },
                  { icon: <Phone size={15} />, text: settings.contact_phone || '(11) 9 9999-9999' },
                  { icon: <MapPin size={15} />, text: settings.contact_address || 'São Paulo, SP — Brasil' },
                ].map((c) => (
                  <div key={c.text} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(248,250,252,0.6)', fontSize: '0.88rem' }}>
                    <span style={{ color: '#a78bfa', flexShrink: 0 }}>{c.icon}</span>
                    {c.text}
                  </div>
                ))}
              </div>

              {/* Newsletter */}
              <div style={{
                background: 'rgba(139,92,246,0.08)',
                border: '1px solid rgba(139,92,246,0.2)',
                borderRadius: '12px',
                padding: '16px',
              }}>
                <p style={{ fontSize: '0.82rem', color: 'rgba(248,250,252,0.7)', margin: '0 0 12px', fontWeight: 500 }}>
                  Receba novidades de eventos
                </p>
                <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px', position: 'relative' }}>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.06)',
                      border: error ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: 'white',
                      fontSize: '0.82rem',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={loading || success}
                    className="btn-primary"
                    style={{ 
                      padding: '8px 14px', 
                      fontSize: '0.82rem', 
                      borderRadius: '8px',
                      background: success ? '#10b981' : undefined
                    }}
                  >
                    {loading ? '...' : success ? <span style={{fontSize: '14px'}}>✓</span> : <ArrowRight size={14} />}
                  </button>
                  {success && (
                    <span style={{ position: 'absolute', top: '-24px', left: 0, color: '#10b981', fontSize: '0.75rem', fontWeight: 600 }}>
                      Inscrito com sucesso!
                    </span>
                  )}
                  {error && (
                    <span style={{ position: 'absolute', top: '-24px', left: 0, color: '#ef4444', fontSize: '0.75rem', fontWeight: 600 }}>
                      Erro ao cadastrar.
                    </span>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            padding: '24px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <p style={{ fontSize: '0.82rem', color: 'rgba(248,250,252,0.4)', margin: 0 }}>
              © {year} IngressoPro. Todos os direitos reservados.
            </p>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'rgba(248,250,252,0.4)' }}>Pagamentos seguros por</span>
              {['PIX', 'Visa', 'Master'].map(p => (
                <span key={p} style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'rgba(248,250,252,0.6)',
                  background: 'rgba(255,255,255,0.06)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .footer-grid {
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
        }
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </footer>
  );
}
