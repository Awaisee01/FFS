import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
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
    sourcemap: false,
    minify: 'esbuild',
    target: ['es2020'], // Modern target for smaller bundles
    chunkSizeWarningLimit: 200, // Smaller warning limit
    cssCodeSplit: true,
    assetsInlineLimit: 2048, // Slightly larger for better inlining
    
    rollupOptions: {
      output: {
        // Better chunking to reduce waterfall
        manualChunks: {
          // Core dependencies 
          'react-vendor': ['react', 'react-dom'],
          
          // Routing (commonly used)
          'router': ['react-router-dom'],
          
          // Heavy form libraries
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          
          // UI components (split by frequency of use)
          'ui-core': ['@radix-ui/react-dialog', '@radix-ui/react-slot'],
          'ui-forms': ['@radix-ui/react-label', '@radix-ui/react-checkbox'],
          
          // Database/API
          'data': ['@supabase/supabase-js', '@tanstack/react-query'],
          
          // Utilities
          'utils': ['clsx', 'tailwind-merge', 'class-variance-authority'],
          
          // Icons (can be large)
          'icons': ['lucide-react']
        },
        
        // Better file naming for caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
      
      // Enable tree shaking
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false
      }
    },
    
    // ENABLE module preload for faster loading
    modulePreload: {
      polyfill: true,
      resolveDependencies: (filename, deps) => {
        // Only preload critical chunks
        return deps.filter(dep => 
          dep.includes('react-vendor') || 
          dep.includes('router') ||
          dep.includes('ui-core')
        );
      }
    },
    
    reportCompressedSize: false
  },
  
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-dom/client', 
      'react-router-dom'
    ],
    force: true
  },
}));