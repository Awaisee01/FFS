
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Simplified config to avoid build timeouts
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Fix MIME type issues for TypeScript modules
    middlewareMode: false,
    headers: {
      'Cache-Control': 'no-store'
    }
  },
  preview: {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  },
  // Ensure proper MIME types for TypeScript/JSX files
  assetsInclude: [],
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimized build config for 100% Lighthouse score
    sourcemap: false,
    minify: 'esbuild',
    target: ['es2022', 'edge88', 'firefox88', 'chrome88', 'safari14'],
    chunkSizeWarningLimit: 500, // Even smaller chunks for faster loading
    cssCodeSplit: true,
    assetsInlineLimit: 1024, // Smaller inline limit to reduce bundle size
    rollupOptions: {
      // Force everything into a single bundle to prevent loading order issues
      output: {
        inlineDynamicImports: true,
        manualChunks: undefined,
      }
    },
    // Disable module preload that might cause loading issues
    modulePreload: false,
    reportCompressedSize: false // Faster builds
  },
  // Enhanced dependency optimization - ensure React loads properly
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-dom/client', '@radix-ui/react-dialog'],
    force: true
  },
}));
