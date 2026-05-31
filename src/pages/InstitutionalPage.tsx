import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchSettings } from '../services/api';
import { ArrowLeft } from 'lucide-react';

// Mapa de slugs para as chaves no banco de dados (settings)
const SLUG_TO_KEY: Record<string, string> = {
  'sobre-nos': 'page_sobre_nos',
  'seguranca': 'page_seguranca',
  'politica-de-privacidade': 'page_politica',
  'termos-de-uso': 'page_termos',
};

// Mapa de slugs para os Títulos (caso esteja vazio na config)
const SLUG_TO_TITLE: Record<string, string> = {
  'sobre-nos': 'Sobre Nós',
  'seguranca': 'Segurança',
  'politica-de-privacidade': 'Política de Privacidade',
  'termos-de-uso': 'Termos de Uso',
};

export default function InstitutionalPage() {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);

    async function loadContent() {
      if (!slug || !SLUG_TO_KEY[slug]) {
        setContent('<h2>Página não encontrada</h2><p>A página que você procura não existe.</p>');
        setLoading(false);
        return;
      }

      try {
        const response = await fetchSettings();
        
        // response já é um Record<string, string> ex: { 'page_sobre_nos': '<h2>...' }
        const pageContent = response[SLUG_TO_KEY[slug]];
        
        if (pageContent) {
          setContent(pageContent);
        } else {
          setContent(`<h2>${SLUG_TO_TITLE[slug]}</h2><p>O conteúdo desta página ainda não foi publicado.</p>`);
        }
      } catch (err) {
        console.error('Failed to load page content:', err);
        setContent('<h2>Erro</h2><p>Não foi possível carregar o conteúdo.</p>');
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [slug]);

  return (
    <main style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px', background: '#05020f' }}>
      <div className="container-main">
        
        <Link to="/" style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '8px',
          color: '#a78bfa',
          textDecoration: 'none',
          fontSize: '0.9rem',
          fontWeight: 600,
          marginBottom: '40px'
        }}>
          <ArrowLeft size={16} /> Voltar para o início
        </Link>

        <div style={{ position: 'relative', maxWidth: '900px', margin: '0 auto' }}>
          {/* Background Glow */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }} />

          <div 
            className="glass-card" 
            style={{ 
              position: 'relative',
              padding: '64px', 
              borderRadius: '32px',
              border: '1px solid rgba(139,92,246,0.2)',
              background: 'linear-gradient(145deg, rgba(20,10,35,0.8) 0%, rgba(5,2,15,0.9) 100%)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
              zIndex: 1,
            }}
          >
            {/* Subtle top highlight */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '10%',
              right: '10%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)',
            }} />

            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(248,250,252,0.5)' }}>
                <div className="animate-pulse">Carregando conteúdo...</div>
              </div>
            ) : (
              <div 
                className="cms-content"
                dangerouslySetInnerHTML={{ __html: content }} 
              />
            )}
          </div>
        </div>
      </div>

      <style>{`
        .cms-content {
          color: rgba(248,250,252,0.75);
          line-height: 1.8;
          font-size: 1.15rem;
        }
        .cms-content h2:first-of-type {
          font-size: clamp(2rem, 5vw, 3rem);
          background: linear-gradient(135deg, #fff 0%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-align: center;
          margin-top: 0;
          margin-bottom: 1.5em;
          letter-spacing: -0.02em;
          position: relative;
          padding-bottom: 0.8em;
        }
        .cms-content h2:first-of-type::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 3px;
          background: linear-gradient(90deg, #8b5cf6, #ec4899);
          border-radius: 4px;
        }
        .cms-content h1, .cms-content h2, .cms-content h3 {
          color: white;
          font-family: 'Outfit', sans-serif;
          margin-top: 2em;
          margin-bottom: 1em;
          font-weight: 700;
        }
        .cms-content h2:not(:first-of-type) { font-size: 1.8rem; }
        .cms-content h3 { font-size: 1.4rem; color: #a78bfa; }
        .cms-content p { margin-bottom: 1.5em; font-weight: 300; }
        .cms-content ul, .cms-content ol {
          margin-bottom: 1.5em;
          padding-left: 24px;
          font-weight: 300;
        }
        .cms-content li { margin-bottom: 0.8em; }
        .cms-content a {
          color: #ec4899;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .cms-content a:hover { color: #f472b6; text-decoration: underline; }
      `}</style>
    </main>
  );
}
