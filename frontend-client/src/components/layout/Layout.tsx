import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { cn } from '../../utils/cn';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  className,
  showHeader = true,
  showFooter = true,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {showHeader && <Header />}
      
      <main className={cn('flex-1', className)}>
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;