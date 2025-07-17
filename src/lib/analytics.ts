import ReactGA from 'react-ga4';
import { hotjar } from 'react-hotjar';

let isInitialized = false;

/**
 * Inicializa Google Analytics e Hotjar usando variáveis de ambiente.
 * Necessário definir VITE_GA_ID, VITE_HOTJAR_ID e opcionalmente VITE_HOTJAR_SV.
 */
export function initAnalytics() {
  if (isInitialized) return;

  const gaId = import.meta.env.VITE_GA_ID as string | undefined;
  if (gaId) {
    ReactGA.initialize(gaId);
  }

  const hjId = import.meta.env.VITE_HOTJAR_ID as string | undefined;
  const hjSvRaw = import.meta.env.VITE_HOTJAR_SV as string | undefined;
  const hjSv = hjSvRaw ? parseInt(hjSvRaw, 10) : 6; // Versão padrão do script
  if (hjId) {
    hotjar.initialize({ id: parseInt(hjId, 10), sv: hjSv });
  }

  isInitialized = true;
}

/**
 * Envia um page-view para o Google Analytics.
 * @param path Caminho da página (pathname + search)
 */
export function trackPageView(path: string) {
  if (!isInitialized) return;
  ReactGA.send({ hitType: 'pageview', page: path });
} 