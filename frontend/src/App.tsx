import React from 'react';
import { Heart } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { useAuth } from './hooks/useAuth';
import { useGetCallerUserProfile, useGetProducts } from './hooks/useQueries';
import Header from './components/Header';
import ProfileHero from './components/ProfileHero';
import ProfileSetupModal from './components/ProfileSetupModal';
import ProductGrid from './components/ProductGrid';

export default function App() {
  const { isAuthenticated, isInitializing, getPrincipal } = useAuth();
  const principal = getPrincipal();

  // Fetch the authenticated user's own profile
  const {
    data: callerProfile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useGetCallerUserProfile();

  // Fetch products for the authenticated user
  const {
    data: products,
    isLoading: productsLoading,
  } = useGetProducts(principal);

  // Show profile setup modal when authenticated user has no profile yet
  const showProfileSetup =
    isAuthenticated && !profileLoading && profileFetched && callerProfile === null;

  // Determine if the current viewer is the owner
  const isOwner = isAuthenticated && !!principal;

  const appId = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'amazon-advertiser-profile'
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        {/* Profile Hero Section */}
        <ProfileHero
          profile={isAuthenticated ? callerProfile : null}
          isLoading={isInitializing || (isAuthenticated && profileLoading)}
          isOwner={isOwner}
        />

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-amber/30 to-transparent" />

        {/* Product Showcase */}
        <ProductGrid
          products={products ?? []}
          isLoading={isAuthenticated ? productsLoading : false}
          isOwner={isOwner}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-charcoal-dark py-8">
        <div className="container mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/50">
          <p>© {new Date().getFullYear()} My Amazon Picks. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with{' '}
            <Heart className="h-3.5 w-3.5 fill-amber text-amber" />
            {' '}using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber hover:text-amber-light transition-colors font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      {/* Profile Setup Modal */}
      <ProfileSetupModal open={showProfileSetup} />

      {/* Toast Notifications */}
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
