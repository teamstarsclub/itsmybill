import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.set('trust proxy', true);

// 1. Single-Hop 301 Canonical Host, HTTPS & Trailing-Slash Enforcement (Production domain only)
app.use((req, res, next) => {
  const host = (req.headers.host || '').toLowerCase();
  const proto = (req.headers['x-forwarded-proto'] as string || req.protocol || 'http').toLowerCase();
  const isProdDomain = host === 'itsmybill.com' || host === 'www.itsmybill.com';

  const rawPath = req.path || '/';
  const hasFileExtension = /\.[a-z0-9]{1,8}$/i.test(rawPath);
  const isInternalDevAsset =
    rawPath.startsWith('/@') ||
    rawPath.startsWith('/src/') ||
    rawPath.startsWith('/node_modules/') ||
    rawPath.startsWith('/assets/');

  const needsTrailingSlash =
    req.method === 'GET' &&
    rawPath !== '/' &&
    !rawPath.endsWith('/') &&
    !hasFileExtension &&
    !isInternalDevAsset;

  if (isProdDomain) {
    const needsHostOrProto = host !== 'www.itsmybill.com' || proto !== 'https';
    if (needsHostOrProto || needsTrailingSlash) {
      const targetPath = needsTrailingSlash ? `${rawPath}/` : rawPath;
      const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
      return res.redirect(301, `https://www.itsmybill.com${targetPath}${qs}`);
    }
  } else if (needsTrailingSlash && process.env.NODE_ENV === 'production') {
    const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    return res.redirect(301, `${rawPath}/${qs}`);
  }

  // Mark chrome-free embed routes as noindex, follow at the HTTP header level too
  if (rawPath.startsWith('/embed/')) {
    res.setHeader('X-Robots-Tag', 'noindex, follow');
  }

  next();
});

// Privacy-First Core: Zero server-side processing of user bills or PII
app.all('/api/*', (_req, res) => {
  res.status(410).json({
    error:
      'ItsMyBill operates 100% client-side to guarantee user privacy. No bill statements or personal financial inputs are accepted by the server.',
  });
});

// SEO & AI Crawler Static Discovery Endpoints
app.get('/robots.txt', (_req, res) => {
  res.type('text/plain');
  res.sendFile(path.resolve(__dirname, 'public', 'robots.txt'));
});

app.get('/sitemap.xml', (_req, res) => {
  res.type('application/xml');
  res.sendFile(path.resolve(__dirname, 'public', 'sitemap.xml'));
});

app.get('/sitemaps/:file', (req, res, next) => {
  const safeName = path.basename(req.params.file);
  const target = path.resolve(__dirname, 'public', 'sitemaps', safeName);
  if (safeName.endsWith('.xml') && fs.existsSync(target)) {
    res.type('application/xml');
    return res.sendFile(target);
  }
  return next();
});

app.get(['/llms.txt', '/.well-known/llms.txt'], (_req, res) => {
  res.type('text/markdown');
  res.sendFile(path.resolve(__dirname, 'public', 'llms.txt'));
});

app.get(['/llms-full.txt', '/.well-known/llms-full.txt'], (_req, res) => {
  res.type('text/markdown');
  res.sendFile(path.resolve(__dirname, 'public', 'llms-full.txt'));
});

app.get('/rss.xml', (_req, res) => {
  res.type('application/rss+xml');
  res.sendFile(path.resolve(__dirname, 'public', 'rss.xml'));
});

// Vite Middleware for Dev vs Pre-rendered Static Directory Serving in Production
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(
      express.static(distPath, {
        extensions: ['html'],
        redirect: true,
      })
    );
    app.get('*', (req, res) => {
      // Serve pre-rendered directory index.html if it exists, otherwise fallback to root index.html
      const cleanRel = req.path.replace(/^\/+|\/+$/g, '');
      const candidate = cleanRel ? path.resolve(distPath, cleanRel, 'index.html') : path.resolve(distPath, 'index.html');
      if (fs.existsSync(candidate)) {
        return res.sendFile(candidate);
      }
      return res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ItsMyBill privacy-first server running on port ${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
});
