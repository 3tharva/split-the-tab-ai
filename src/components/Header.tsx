
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 w-full">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
                <path d="M4 6v18M14 6v18"></path>
                <path d="M7 12h8M7 18h8"></path>
                <path d="M8 6h12l-4 6 4 6H8a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4Z"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold">Split<span className="text-primary">Tab</span></h1>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">How It Works</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">About</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Contact</a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
