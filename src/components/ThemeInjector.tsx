import { useEffect, useState } from 'react';
import { fetchSettings } from '../services/api';

export default function ThemeInjector() {
  const [themeStyles, setThemeStyles] = useState<string>('');

  useEffect(() => {
    async function loadTheme() {
      try {
        const response = await fetchSettings();
        if (response.success === false) return; // Se for o formato antigo que não é um Record
        
        // As configurações da API agora vêm como um Record<string, string> diretamente, ou num array `data`
        // Vamos extrair as variáveis
        let settingsData: Record<string, string> = {};
        if (response.data && Array.isArray(response.data)) {
          response.data.forEach((s: any) => {
            settingsData[s.key] = s.value;
          });
        } else {
          settingsData = response;
        }

        const bg0 = settingsData['color_bg_0'];
        const primary = settingsData['color_primary'];
        const secondary = settingsData['color_secondary'];

        let css = '';
        if (bg0 || primary || secondary) {
          css = `
            :root {
              ${bg0 ? `--color-bg-0: ${bg0} !important;` : ''}
              ${bg0 ? `--color-bg-1: ${bg0} !important;` : ''}
              ${primary ? `--color-primary: ${primary} !important;` : ''}
              ${primary ? `--color-primary-light: ${primary} !important;` : ''}
              ${primary ? `--color-primary-dark: ${primary} !important;` : ''}
              ${secondary ? `--color-secondary: ${secondary} !important;` : ''}
              ${secondary ? `--color-secondary-light: ${secondary} !important;` : ''}
              ${secondary ? `--color-secondary-dark: ${secondary} !important;` : ''}
            }
          `;
        }
        
        setThemeStyles(css);
      } catch (err) {
        console.error('Failed to load theme settings:', err);
      }
    }
    loadTheme();
  }, []);

  if (!themeStyles) return null;

  return (
    <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
  );
}
