import React from 'react';
import { cn } from '../../utils/cn';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn(
      'bg-gray-900 text-white py-8 mt-auto',
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Información del restaurante */}
          <div>
            <h3 className="text-lg font-semibold mb-4">RestauranteApp</h3>
            <p className="text-gray-300 text-sm">
              Disfruta de la mejor experiencia gastronómica con nuestros platos únicos y servicio excepcional.
            </p>
            <div className="mt-4 text-sm text-gray-400">
              <p>📍 Dirección: Calle Principal 123</p>
              <p>📞 Teléfono: (123) 456-7890</p>
              <p>📧 Email: info@restauranteapp.com</p>
            </div>
          </div>

          {/* Horarios */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Horarios</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <p>Lunes - Viernes: 11:00 AM - 10:00 PM</p>
              <p>Sábado: 12:00 PM - 11:00 PM</p>
              <p>Domingo: 12:00 PM - 9:00 PM</p>
            </div>
          </div>

          {/* Redes sociales y enlaces */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                📘
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                📷
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                🐦
              </a>
            </div>
            <div className="text-sm text-gray-300">
              <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
              <span className="mx-2">|</span>
              <a href="#" className="hover:text-white transition-colors">Términos de Servicio</a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} RestauranteApp. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;