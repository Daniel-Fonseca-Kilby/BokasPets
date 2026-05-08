import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  /** Si es true, agrega meta noindex para que los buscadores no indexen la página */
  noIndex?: boolean;
}

const SITE_NAME = 'BokasPets';
const DEFAULT_IMAGE = '/og-image.png';
const SITE_URL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5174';

/**
 * Componente SEO reutilizable.
 * Agrega title, description, Open Graph y Twitter Card en el <head>.
 * Usar noIndex en páginas privadas (dashboard, admin) para excluirlas de Google.
 */
const SEO = ({ title, description, image, noIndex = false }: SEOProps) => {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const ogImage = image || `${SITE_URL}${DEFAULT_IMAGE}`;

  return (
    <Helmet>
      {/* Título de la pestaña del navegador */}
      <title>{fullTitle}</title>

      {/* Meta básico */}
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph — para previews en redes sociales (Facebook, LinkedIn, WhatsApp) */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Card — para previews en Twitter/X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
