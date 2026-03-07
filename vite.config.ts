import path from "path"
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Sitemap from 'vite-plugin-sitemap';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://virtuenex.com',
      dynamicRoutes: [
        '/services/ai-chat-assistants',
        '/services/inbound-phone-agents',
        '/services/real-estate-websites',
        '/services/intelligent-data-sync',
        '/how-it-works',
        '/pricing',
        '/contact',
        '/privacy-policy',
        '/blogs',
        '/blogs/future-of-ai-in-real-estate',
        '/blogs/maximizing-conversion-ai-chatbots',
        '/blogs/business-automation-for-brokers'
      ],
      exclude: ['/admin', '/dashboard', '/login', '/unauthorized']
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
