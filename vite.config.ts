import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ["dompurify"],
  },
  build: {
    // Otimizações de build
    target: "esnext",
    minify: "esbuild",
    cssMinify: true,
    sourcemap: false,
    
    // Code splitting e chunk optimization
    rollupOptions: {
      external: (id) => {
        // Não externalizar dompurify - deve ser incluído no bundle
        return false;
      },
      output: {
        // Separar vendor chunks (React não deve ser separado)
        manualChunks: (id) => {
          // Vendor chunks para bibliotecas grandes
          if (id.includes('node_modules')) {
            // NÃO separar React - deve ficar no bundle principal
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return undefined; // React fica no bundle principal
            }
            // Radix UI components
            if (id.includes('@radix-ui')) {
              return 'vendor-radix';
            }
            // Supabase
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            // TanStack Query
            if (id.includes('@tanstack')) {
              return 'vendor-tanstack';
            }
            // Lucide icons
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            // React Router
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            // Outros vendors
            return 'vendor';
          }
        },
        // Nomes de arquivos otimizados
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          if (/\.(png|jpe?g|svg|gif|webp|avif)$/.test(assetInfo.name || '')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    
    // Otimizações de chunk size
    chunkSizeWarningLimit: 1000,
    
    // Tree shaking
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
  },
  
  // Otimizações de CSS
  css: {
    devSourcemap: false,
  },
}));
