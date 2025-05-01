
import React from 'react';
import { Button } from '@/components/ui/button';
import { Receipt, User, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
              <Receipt className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">
              Split<span className="text-primary">Tab</span>
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-sm font-medium transition-colors hover:text-primary">How It Works</a>
            <a href="#" className="text-sm font-medium transition-colors hover:text-primary">About</a>
            <a href="#" className="text-sm font-medium transition-colors hover:text-primary">Contact</a>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Sign In</span>
            </Button>
          </nav>
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
