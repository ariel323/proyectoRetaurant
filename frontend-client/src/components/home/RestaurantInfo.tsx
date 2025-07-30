import React from 'react';
import { cn } from '../../utils/cn';

interface RestaurantInfoProps {
  /**
   * Información del restaurante
   */
  restaurantData?: {
    name: string;
    description: string;
    founded: string;
    specialties: string[];
    story: string;
    chef: {
      name: string;
      experience: string;
      specialties: string[];
      image?: string;
    };
    awards: Array<{
      title: string;
      year: string;
      description: string;
      icon?: string;
    }>;
    stats: Array<{
      value: string;
      label: string;
      icon: string;
    }>;
  };
  
  /**
   * Mostrar sección del chef
   */
  showChef?: boolean;
  
  /**
   * Mostrar premios
   */
  showAwards?: boolean;
  
  /**
   * Mostrar estadísticas
   */
  showStats?: boolean;
  
  /**
   * Layout de la sección
   */
  layout?: 'default' | 'centered' | 'split';
  
  /**
   * Clases CSS adicionales
   */
  className?: string;
}

/**
 * Componente RestaurantInfo - Información sobre el restaurante
 */
export const RestaurantInfo: React.FC<RestaurantInfoProps> = ({
  restaurantData = {
    name: "Restaurante Delizioso",
    description: "Un lugar donde la tradición culinaria se encuentra con la innovación moderna.",
    founded: "1995",
    specialties: ["Cocina Mediterránea", "Mariscos Frescos", "Carnes Premium", "Postres Artesanales"],
    story: "Desde hace más de 25 años, hemos estado comprometidos con ofrecer la mejor experiencia gastronómica. Nuestro restaurante nació de la pasión por la buena comida y el deseo de crear un espacio donde las familias y amigos puedan reunirse para disfrutar de momentos inolvidables. Utilizamos solo los ingredientes más frescos y de la más alta calidad, trabajando con proveedores locales para apoyar a nuestra comunidad.",
    chef: {
      name: "Chef María González",
      experience: "15 años de experiencia",
      specialties: ["Cocina Mediterránea", "Fusión Internacional", "Repostería Artesanal"],
      image: "/assets/images/chef.jpg"
    },
    awards: [
      {
        title: "Mejor Restaurante del Año",
        year: "2023",
        description: "Premio otorgado por la Asociación Gastronómica",
        icon: "🏆"
      },
      {
        title: "Excelencia en Servicio",
        year: "2022",
        description: "Reconocimiento por la calidad en atención al cliente",
        icon: "⭐"
      },
      {
        title: "Chef del Año",
        year: "2021",
        description: "Reconocimiento a la innovación culinaria",
        icon: "👨‍🍳"
      }
    ],
    stats: [
      { value: "25+", label: "Años de Experiencia", icon: "📅" },
      { value: "10K+", label: "Clientes Satisfechos", icon: "😊" },
      { value: "200+", label: "Platos en Menú", icon: "🍽️" },
      { value: "50+", label: "Especialidades", icon: "⭐" }
    ]
  },
  showChef = true,
  showAwards = true,
  showStats = true,
  layout = 'default',
  className,
}) => {
  const getLayoutClasses = () => {
    switch (layout) {
      case 'centered':
        return 'text-center max-w-4xl mx-auto';
      case 'split':
        return 'grid grid-cols-1 lg:grid-cols-2 gap-12 items-center';
      default:
        return '';
    }
  };

  return (
    <section className={cn('py-16 bg-white', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={getLayoutClasses()}>
          {/* Información principal del restaurante */}
          <div className={layout === 'split' ? '' : 'mb-12'}>
            <div className={layout === 'centered' ? '' : 'max-w-3xl'}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Sobre {restaurantData.name}
              </h2>
              
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {restaurantData.description}
              </p>
              
              <div className="prose prose-lg text-gray-700 mb-8">
                <p>{restaurantData.story}</p>
              </div>

              {/* Especialidades */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Nuestras Especialidades
                </h3>
                <div className="flex flex-wrap gap-2">
                  {restaurantData.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Año de fundación */}
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>Fundado en {restaurantData.founded}</span>
              </div>
            </div>
          </div>

          {/* Imagen o contenido adicional para layout split */}
          {layout === 'split' && (
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-200">
                <img
                  src="/assets/images/restaurant-interior.jpg"
                  alt="Interior del restaurante"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = '<div class="flex items-center justify-center h-full bg-gray-200"><span class="text-6xl">🏪</span></div>';
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Estadísticas */}
        {showStats && (
          <div className="mt-16 bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              En Números
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {restaurantData.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold text-orange-600 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Información del chef */}
        {showChef && (
          <div className="mt-16">
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {/* Imagen del chef */}
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-200 mb-4">
                    {restaurantData.chef.image ? (
                      <img
                        src={restaurantData.chef.image}
                        alt={restaurantData.chef.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = '<div class="flex items-center justify-center h-full bg-gray-200"><span class="text-4xl">👨‍🍳</span></div>';
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-200">
                        <span className="text-4xl">👨‍🍳</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Información del chef */}
                <div className="md:col-span-2">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {restaurantData.chef.name}
                  </h3>
                  <p className="text-orange-600 font-medium mb-4">
                    {restaurantData.chef.experience}
                  </p>
                  
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Especialidades:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {restaurantData.chef.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-gray-700 border border-gray-200"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Premios y reconocimientos */}
        {showAwards && restaurantData.awards.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Premios y Reconocimientos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {restaurantData.awards.map((award, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="text-4xl mb-3">
                    {award.icon || '🏆'}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {award.title}
                  </h4>
                  <p className="text-orange-600 font-medium mb-2">
                    {award.year}
                  </p>
                  <p className="text-sm text-gray-600">
                    {award.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call to action */}
        <div className="mt-16 text-center">
          <div className="bg-orange-500 text-white rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">
              ¿Listo para una experiencia inolvidable?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Reserva tu mesa y descubre por qué somos el restaurante favorito de la ciudad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
                Reservar Mesa
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-500 transition-colors duration-200">
                Ver Menú
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RestaurantInfo;