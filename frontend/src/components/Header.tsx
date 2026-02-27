import React from 'react';
import { ShoppingBag, LogIn, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const { isAuthenticated, isLoggingIn, login, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-charcoal-dark/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber shadow-amber-glow">
            <ShoppingBag className="h-5 w-5 text-charcoal-dark" />
          </div>
          <span className="font-display text-lg font-bold text-white tracking-tight">
            My Amazon Picks
          </span>
        </div>

        {/* Auth Button */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={login}
              disabled={isLoggingIn}
              className="bg-amber text-charcoal-dark hover:bg-amber-light font-semibold gap-2 shadow-amber-glow"
            >
              {isLoggingIn ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              <span>{isLoggingIn ? 'Logging in…' : 'Login'}</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
