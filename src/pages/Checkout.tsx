import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, MapPin, Calendar, Clock, AlertTriangle, ShieldCheck, CreditCard, Ticket } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { fetchSettings, createOrder } from '../services/api';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, removeItem, clearCart } = useCart();
  const [processing, setProcessing] = useState(false);
  const [rules, setRules] = useState<string | null>(null);
  
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix'>('credit_card');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [ticketCode, setTicketCode] = useState('');

  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSettings().then(setSettings).catch(console.error);
  }, []);

  if (items.length === 0) {
    return (
      <main style={{ minHeight: '100vh', paddingTop: '140px', paddingBottom: '80px', background: '#05020f' }}>
        <div className="container-main" style={{ textAlign: 'center' }}>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px',
            padding: '80px 20px',
            maxWidth: '600px',
            margin: '0 auto',
            backdropFilter: 'blur(10px)',
          }}>
            <ShoppingBagEmpty />
            <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '16px' }}>Carrinho Vazio</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '32px' }}>
              Você não possui ingressos selecionados para finalizar a compra.
            </p>
            <Link to="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
              Procurar Eventos
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const handleCheckout = async () => {
    if (!buyerName || !buyerEmail) {
      alert("Por favor, preencha seu Nome Completo e E-mail.");
      return;
    }

    setProcessing(true);
    
    try {
      const payload = {
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        payment_method: paymentMethod,
        items: items.map(i => ({ id: i.event.id, quantity: i.quantity }))
      };
      
      const result = await createOrder(payload);
      const code = result?.ticket_code ?? '';
      
      clearCart();
      setTicketCode(code);
      setOrderSuccess(true);
      window.scrollTo(0, 0);

      // ── Redirecionamento para o gateway de pagamento ──────────────────
      // Quando a API de pagamento for integrada, substitua a URL abaixo
      // pelo link real gerado pelo gateway (ex: Mercado Pago, Stripe, etc.)
      // Por ora, redireciona para a tela interna de placeholder.
      if (code) {
        // window.location.href = `https://gateway.com/pay?ref=${code}`; // ← trocar aqui no futuro
        // Enquanto isso, mantém na tela de sucesso abaixo.
      }
      // ──────────────────────────────────────────────────────────────────
    } catch (err) {
      alert("Ocorreu um erro ao gerar seu pedido. Tente novamente.");
    } finally {
      setProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <main style={{ minHeight: '100vh', paddingTop: '140px', paddingBottom: '80px', background: '#05020f' }}>
        <div className="container-main" style={{ textAlign: 'center' }}>
          <div style={{
            background: 'linear-gradient(145deg, rgba(16,185,129,0.1) 0%, rgba(5,2,15,0.9) 100%)',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: '24px',
            padding: '80px 20px',
            maxWidth: '600px',
            margin: '0 auto',
            backdropFilter: 'blur(10px)',
          }}>
            <CheckCircle size={80} color="#10b981" style={{ margin: '0 auto 24px', display: 'block' }} />
            <h2 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '16px', fontFamily: 'Outfit' }}>Pedido Registrado!</h2>
            {ticketCode && (
              <div style={{ 
                background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', 
                borderRadius: '12px', padding: '14px 20px', marginBottom: '20px', display: 'inline-block' 
              }}>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Código do Pedido: </span>
                <strong style={{ color: '#a78bfa', fontSize: '1.1rem', letterSpacing: '0.05em' }}>{ticketCode}</strong>
              </div>
            )}
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', marginBottom: '32px', lineHeight: 1.6 }}>
              Olá <strong>{buyerName}</strong>, seu pedido foi registrado com sucesso. <br/>
              <span style={{ color: '#f59e0b', fontWeight: 600 }}>Status: Aguardando Pagamento</span><br/>
              <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>Em breve você será redirecionado para o ambiente de pagamento.</span>
            </p>
            <Link to="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
              Voltar ao Início
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px', background: '#05020f', position: 'relative' }}>
      {/* Dynamic Background Glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100vw',
        height: '60vh',
        background: 'radial-gradient(ellipse at top, rgba(139,92,246,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div className="container-main" style={{ position: 'relative', zIndex: 1 }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px',
            color: '#a78bfa',
            background: 'none',
            border: 'none',
            fontSize: '0.9rem',
            fontWeight: 600,
            marginBottom: '32px',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} /> Voltar
        </button>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px',
        }}>
          {/* Coluna Esquerda: Itens do Carrinho e Regras */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 style={{ color: 'white', fontSize: '1.8rem', margin: 0, fontFamily: 'Outfit' }}>Seus Ingressos</h2>
            
            {items.map((item) => (
              <div key={item.event.id} className="glass-card" style={{
                background: 'linear-gradient(145deg, rgba(20,10,35,0.8) 0%, rgba(5,2,15,0.9) 100%)',
                borderRadius: '24px',
                border: '1px solid rgba(139,92,246,0.2)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  {item.event.image ? (
                    <img 
                      src={`http://127.0.0.1:8000${item.event.image}`} 
                      alt={item.event.name}
                      style={{ width: '100px', height: '100px', borderRadius: '16px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ 
                      width: '100px', height: '100px', borderRadius: '16px', 
                      background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.2))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' 
                    }}>
                      🎫
                    </div>
                  )}
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: 'white', margin: '0 0 8px 0', fontSize: '1.4rem' }}>{item.event.name}</h3>
                    <p style={{ color: '#ec4899', margin: '0 0 16px 0', fontWeight: 800, fontSize: '1.2rem' }}>
                      R$ {Number(item.event.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} <span style={{fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', fontWeight: 400}}>x {item.quantity}</span>
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  background: 'rgba(255,255,255,0.03)',
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                    <Calendar size={16} color="#a78bfa" />
                    <span>{new Date(item.event.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                    <Clock size={16} color="#a78bfa" />
                    <span>{item.event.time.slice(0, 5)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', gridColumn: '1 / -1' }}>
                    <MapPin size={16} color="#a78bfa" style={{ flexShrink: 0 }} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.event.venue} — {item.event.city}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Regras do Evento */}
            <div className="glass-card" style={{
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.05)',
              padding: '24px',
              marginTop: '16px',
            }}>
              <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} color="#f59e0b" />
                Regras e Informações Importantes
              </h3>
              <ul style={{ 
                color: 'rgba(255,255,255,0.6)', 
                fontSize: '0.95rem', 
                lineHeight: '1.6',
                paddingLeft: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                margin: 0
              }}>
                <li>O ingresso é nominal e intransferível. É obrigatória a apresentação de documento original com foto.</li>
                <li>Proibida a entrada de menores de 18 anos desacompanhados (sujeito às regras específicas de cada local).</li>
                <li>Chegue com pelo menos 1h de antecedência para evitar filas e atrasos.</li>
                <li>O cancelamento pode ser feito em até 7 dias após a compra, desde que falte mais de 48h para o evento.</li>
              </ul>
            </div>
          </div>

          {/* Coluna Direita: Resumo e Pagamento */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 style={{ color: 'white', fontSize: '1.8rem', margin: 0, fontFamily: 'Outfit' }}>Resumo do Pedido</h2>
            
            <div className="glass-card" style={{
              background: 'linear-gradient(145deg, rgba(20,10,35,0.8) 0%, rgba(5,2,15,0.9) 100%)',
              borderRadius: '24px',
              border: '1px solid rgba(139,92,246,0.3)',
              padding: '32px',
              position: 'sticky',
              top: '120px',
            }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.7)', fontSize: '1rem' }}>
                  <span>Subtotal ({items.reduce((acc, item) => acc + item.quantity, 0)} ingressos)</span>
                  <span>R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.7)', fontSize: '1rem' }}>
                  <span>Taxa de Serviço ({settings.ticket_service_fee || 10}%)</span>
                  <span>R$ {(totalPrice * (Number(settings.ticket_service_fee || 10) / 100)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontSize: '1.4rem', fontWeight: 700 }}>
                  <span>Total</span>
                  <span style={{ color: '#a78bfa' }}>R$ {(totalPrice * (1 + Number(settings.ticket_service_fee || 10) / 100)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', marginBottom: '16px' }}>Seus Dados</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input 
                    type="text" 
                    placeholder="Nome Completo" 
                    value={buyerName}
                    onChange={e => setBuyerName(e.target.value)}
                    style={{ 
                      width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', 
                      border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.95rem', outline: 'none' 
                    }} 
                  />
                  <input 
                    type="email" 
                    placeholder="E-mail" 
                    value={buyerEmail}
                    onChange={e => setBuyerEmail(e.target.value)}
                    style={{ 
                      width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', 
                      border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.95rem', outline: 'none' 
                    }} 
                  />
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', marginBottom: '16px' }}>Método de Pagamento</h4>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => setPaymentMethod('credit_card')}
                    style={{ 
                    flex: 1, padding: '16px', borderRadius: '12px', 
                    background: paymentMethod === 'credit_card' ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.03)', 
                    border: paymentMethod === 'credit_card' ? '1px solid #8b5cf6' : '1px solid rgba(255,255,255,0.1)', 
                    color: paymentMethod === 'credit_card' ? 'white' : 'rgba(255,255,255,0.5)', 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}>
                    <CreditCard size={24} color={paymentMethod === 'credit_card' ? "#8b5cf6" : "rgba(255,255,255,0.5)"} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Cartão</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('pix')}
                    style={{ 
                    flex: 1, padding: '16px', borderRadius: '12px', 
                    background: paymentMethod === 'pix' ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.03)', 
                    border: paymentMethod === 'pix' ? '1px solid #8b5cf6' : '1px solid rgba(255,255,255,0.1)', 
                    color: paymentMethod === 'pix' ? 'white' : 'rgba(255,255,255,0.5)', 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L22 7V17L12 22L2 17V7L12 2ZM12 4.23L4 8.23V15.77L12 19.77L20 15.77V8.23L12 4.23Z" />
                    </svg>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>PIX</span>
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '24px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px' }}>
                <ShieldCheck size={20} color="#10b981" style={{ flexShrink: 0 }} />
                <span>Ambiente 100% seguro. Seus dados estão criptografados.</span>
              </div>

              <button 
                className="btn-primary" 
                style={{ width: '100%', padding: '16px', fontSize: '1.1rem', justifyContent: 'center' }}
                onClick={handleCheckout}
                disabled={processing}
              >
                {processing ? 'Processando...' : 'Confirmar e Pagar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function ShoppingBagEmpty() {
  return (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'white', opacity: 0.2, margin: '0 auto 24px', display: 'block' }}>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
  );
}
