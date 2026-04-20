import { defineConfig } from 'vite';

export default defineConfig({
  base: '/video-audio-converter/',
  server: {
    port: 7771,
    strictPort: true,
  },
  plugins: [
    {
      name: 'configure-response-headers',
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
          res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
          next();
        });
      },
    },
  ],
});
