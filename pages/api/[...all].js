import { createProxyMiddleware } from 'http-proxy-middleware';
import nextConnect from 'next-connect';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

const handler = nextConnect();

handler.use(
  '/api',
  createProxyMiddleware({
    target: 'https://quiz-app-xi-umber.vercel.app/', // Die Ziel-URL der externen API
    changeOrigin: true,
    pathRewrite: {
      '^/api': '', // Entfernt /api aus dem Pfad, bevor die Anfrage an die externe API gesendet wird
    },
    // Weitere Konfigurationsoptionen hier
  })
);

export default handler;
