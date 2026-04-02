
  import { defineConfig, loadEnv } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';

  const resolveBaseUrl = (raw: string | undefined) => {
    if (!raw) return 'http://localhost:5000';
    try {
      const url = new URL(raw);
      return url.origin;
    } catch {
      return raw.startsWith('http') ? raw : 'http://localhost:5000';
    }
  };

  export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const apiBase = env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    const serverBase = resolveBaseUrl(apiBase);
    return {
    plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'vaul@1.1.2': 'vaul',
        'sonner@2.0.3': 'sonner',
        'recharts@2.15.2': 'recharts',
        'react-resizable-panels@2.1.7': 'react-resizable-panels',
        'react-hook-form@7.55.0': 'react-hook-form',
        'react-day-picker@8.10.1': 'react-day-picker',
        'next-themes@0.4.6': 'next-themes',
        'lucide-react@0.487.0': 'lucide-react',
        'input-otp@1.4.2': 'input-otp',
        'figma:asset/ad3c4a6fc8106487e1b4ed62fb5d5e6add2a8858.png': path.resolve(__dirname, './src/assets/ad3c4a6fc8106487e1b4ed62fb5d5e6add2a8858.png'),
        'embla-carousel-react@8.6.0': 'embla-carousel-react',
        'cmdk@1.1.1': 'cmdk',
        'class-variance-authority@0.7.1': 'class-variance-authority',
        '@radix-ui/react-tooltip@1.1.8': '@radix-ui/react-tooltip',
        '@radix-ui/react-toggle@1.1.2': '@radix-ui/react-toggle',
        '@radix-ui/react-toggle-group@1.1.2': '@radix-ui/react-toggle-group',
        '@radix-ui/react-tabs@1.1.3': '@radix-ui/react-tabs',
        '@radix-ui/react-switch@1.1.3': '@radix-ui/react-switch',
        '@radix-ui/react-slot@1.1.2': '@radix-ui/react-slot',
        '@radix-ui/react-slider@1.2.3': '@radix-ui/react-slider',
        '@radix-ui/react-separator@1.1.2': '@radix-ui/react-separator',
        '@radix-ui/react-select@2.1.6': '@radix-ui/react-select',
        '@radix-ui/react-scroll-area@1.2.3': '@radix-ui/react-scroll-area',
        '@radix-ui/react-radio-group@1.2.3': '@radix-ui/react-radio-group',
        '@radix-ui/react-progress@1.1.2': '@radix-ui/react-progress',
        '@radix-ui/react-popover@1.1.6': '@radix-ui/react-popover',
        '@radix-ui/react-navigation-menu@1.2.5': '@radix-ui/react-navigation-menu',
        '@radix-ui/react-menubar@1.1.6': '@radix-ui/react-menubar',
        '@radix-ui/react-label@2.1.2': '@radix-ui/react-label',
        '@radix-ui/react-hover-card@1.1.6': '@radix-ui/react-hover-card',
        '@radix-ui/react-dropdown-menu@2.1.6': '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-dialog@1.1.6': '@radix-ui/react-dialog',
        '@radix-ui/react-context-menu@2.2.6': '@radix-ui/react-context-menu',
        '@radix-ui/react-collapsible@1.1.3': '@radix-ui/react-collapsible',
        '@radix-ui/react-checkbox@1.1.4': '@radix-ui/react-checkbox',
        '@radix-ui/react-avatar@1.1.3': '@radix-ui/react-avatar',
        '@radix-ui/react-aspect-ratio@1.1.2': '@radix-ui/react-aspect-ratio',
        '@radix-ui/react-alert-dialog@1.1.6': '@radix-ui/react-alert-dialog',
        '@radix-ui/react-accordion@1.2.3': '@radix-ui/react-accordion',
        '@': path.resolve(__dirname, './src'),
      },
    },
  build: {
      target: 'esnext',
      outDir: 'build',
      modulePreload: {
        resolveDependencies: (filename, deps, context) => {
          if (context.hostType !== 'html') return deps;

          return deps.filter((dep) => {
            if (dep.includes('superadmin-')) return false;
            if (dep.includes('admin-')) return false;
            if (dep.includes('account-')) return false;
            if (dep.includes('checkout-')) return false;
            if (dep.includes('compare-')) return false;
            if (dep.includes('offers-')) return false;
            if (dep.includes('products-')) return false;
            if (dep.includes('product-detail-')) return false;
            if (dep.includes('home-hero-')) return false;
            if (dep.includes('home-search-')) return false;
            if (dep.includes('home-categories-')) return false;
            if (dep.includes('home-offers-ui-')) return false;
            if (dep.includes('home-services-')) return false;
            if (dep.includes('home-secondary-')) return false;
            return true;
          });
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-router')) return 'react-router';
              if (id.includes('react-dom') || id.includes('react')) return 'react';
              if (id.includes('@radix-ui')) return 'radix-ui';
              if (id.includes('embla-carousel')) return 'embla';
              if (id.includes('recharts')) return 'charts';
              if (id.includes('firebase')) return 'firebase';
              if (id.includes('motion')) return 'motion';
              return 'vendor';
            }

            if (id.includes('/src/features/account/pages/superadmin/')) return 'superadmin';
            if (id.includes('/src/features/account/pages/admin/')) return 'admin';
            if (id.includes('/src/features/account/')) return 'account';
            if (id.includes('/src/features/home/pages/HomePage')) return 'home';
            if (id.includes('/src/features/home/components/HeroCarousel')) return 'home-hero';
            if (id.includes('/src/features/home/components/CategorySection')) return 'home-categories';
            if (id.includes('/src/features/home/components/SearchSection')) return 'home-search';
            if (id.includes('/src/features/home/components/OfferTypeSlider')) return 'home-offers-ui';
            if (id.includes('/src/features/home/components/ServicesGrid')) return 'home-services';
            if (
              id.includes('/src/features/home/components/CompanyStrength') ||
              id.includes('/src/features/home/components/WarrantySection') ||
              id.includes('/src/features/home/components/SEOSection') ||
              id.includes('/src/features/home/components/PrintingService') ||
              id.includes('/src/features/home/components/EPaymentService') ||
              id.includes('/src/features/home/components/WarrantyCheckService') ||
              id.includes('/src/features/home/components/MaintenanceStatusService')
            ) return 'home-secondary';
            if (id.includes('/src/features/products/pages/ProductDetailPage')) return 'product-detail';
            if (id.includes('/src/features/products/')) return 'products';
            if (id.includes('/src/features/offer/')) return 'offers';
            if (id.includes('/src/features/checkout/')) return 'checkout';
            if (id.includes('/src/features/compare/')) return 'compare';
            if (id.includes('/src/features/home/')) return 'home';
            return undefined;
          },
        },
      },
    },
    server: {
      port: 3005,
      open: true,
      proxy: {
        '/sitemap.xml': {
          target: serverBase,
          changeOrigin: true,
        },
      },
    },
  };
  });
