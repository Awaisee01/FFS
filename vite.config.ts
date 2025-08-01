
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
// import { visualizer } from 'rollup-plugin-visualizer';
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
//  visualizer({ open: true, gzipSize: true }),
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
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        router: ['react-router-dom'],
        forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
        ui: ['@radix-ui/react-dialog', '@radix-ui/react-slot', '@radix-ui/react-label'],
        supabase: ['@supabase/supabase-js', '@tanstack/react-query'],
        utils: ['clsx', 'tailwind-merge', 'class-variance-authority']
      }
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
