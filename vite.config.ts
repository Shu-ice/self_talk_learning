import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      plugins: [react()],
      
      define: {
        'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        '__PWA_VERSION__': JSON.stringify(process.env.npm_package_version || '1.0.0')
      },
      
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      
      // PWA and multi-device optimization
      build: {
        target: ['es2015', 'edge88', 'firefox78', 'chrome87', 'safari14'],
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: true,
        rollupOptions: {
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom'],
              'ai-vendor': ['@google/genai']
            }
          }
        }
      },
      
      // Development server configuration
      server: {
        port: 5174,
        host: true, // Allow external access for testing on mobile devices
        cors: true
      },
      
      // Optimize for mobile devices
      optimizeDeps: {
        include: ['react', 'react-dom', '@google/genai'],
        exclude: []
      },
      
      // CSS optimization
      css: {
        devSourcemap: true
      },
      
      // Asset handling
      assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
      
      // Preview configuration for testing
      preview: {
        port: 4173,
        host: true,
        strictPort: true
      }
    };
});
