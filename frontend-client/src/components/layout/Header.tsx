import React from "react";
import CartButton from "../cart/CartButton";
import { cn } from "../../utils/cn";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header
      className={cn(
        "bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">
                🍽️ <span className="text-blue-600">RestauranteApp</span>
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="#menu"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Menú
            </a>
            <a
              href="#about"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Nosotros
            </a>
            <a
              href="#contact"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Contacto
            </a>
          </nav>

          {/* Cart Button */}
          <div className="flex items-center">
            <CartButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
