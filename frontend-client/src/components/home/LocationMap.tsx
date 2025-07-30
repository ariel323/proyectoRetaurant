import React, { useState } from 'react';
import { cn } from '../../utils/cn';

interface LocationData {
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  email?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  mapUrl?: string;
  directions?: {
    bycar: string;
    bypublic: string;
    walking: string;
  };
  landmarks?: string[];
  parking?: {
    available: boolean;
    type: 'free' | 'paid' | 'valet';
    description: string;
  };
}

interface LocationMapProps {
  /**
   * Título de la sección
   */
  title?: string;
  
  /**
   * Subtítulo de la sección
   */
  subtitle?: string;
  
  /**
   * Datos de ubicación
   */
  location?: LocationData;
  
  /**
   * Mostrar mapa embebido
   */
  showMap?: boolean;
  
  /**
   * URL del mapa embebido
   */
  embedMapUrl?: string;
  
  /**
   * Mostrar información de transporte
   */
  showTransport?: boolean;
  
  /**
   * Mostrar información de estacionamiento
   */
  showParking?: boolean;
  
  /**
   * Mostrar puntos de referencia
   */
  showLandmarks?: boolean;
  
  /**
   * Altura del mapa
   */
  mapHeight?: string;
  
  /**
   * Clases CSS adicionales
   */
  className?: string;
}

/**
 * Componente LocationMap - Muestra la ubicación del restaurante con mapa e información
 */
export const LocationMap: React.FC<LocationMapProps> = ({
  title = "Nuestra Ubicación",
  subtitle = "Visítanos en el corazón de la ciudad",
  location = {
    name: "Restaurante Delizioso",
    address: "Av. Reforma 123",
    city: "Ciudad de México",
    state: "CDMX",
    postalCode: "06500",
    country: "México",
    phone: "+52 (55) 1234-5678",
    email: "info@delizioso.com",
    coordinates: {
      lat: 19.4326,
      lng: -99.1332
    },
    mapUrl: "https://maps.google.com/?q=19.4326,-99.1332",
    directions: {
      bycar: "Toma Av. Reforma hasta llegar al número 123, entre calles Florencia y Niza",
      bypublic: "Metro Insurgentes (Línea 1), salida 4. Camina 3 cuadras hacia el norte",
      walking: "Desde el Ángel de la Independencia, camina 5 minutos hacia el oeste"
    },
    landmarks: [
      "A 2 cuadras del Ángel de la Independencia",
      "Frente al Hotel Marriott",
      "Cerca de la Torre Mayor",
      "Al lado de Starbucks Reforma"
    ],
    parking: {
      available: true,
      type: "valet",
      description: "Servicio de valet parking gratuito para clientes del restaurante"
    }
  },
  showMap = true,
  embedMapUrl,
  showTransport = true,
  showParking = true,
  showLandmarks = true,
  mapHeight = "400px",
  className,
}) => {
  const [activeTab, setActiveTab] = useState<'bycar' | 'bypublic' | 'walking'>('bycar');
  const [mapLoaded, setMapLoaded] = useState(false);

  const fullAddress = `${location.address}, ${location.city}, ${location.state} ${location.postalCode}, ${location.country}`;
  
  const defaultEmbedUrl = embedMapUrl || 
    `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(fullAddress)}`;

  const transportOptions = [
    {
      id: 'bycar' as const,
      icon: '🚗',
      title: 'En Auto',
      description: location.directions?.bycar || 'Información de acceso en auto no disponible'
    },
    {
      id: 'bypublic' as const,
      icon: '🚌',
      title: 'Transporte Público',
      description: location.directions?.bypublic || 'Información de transporte público no disponible'
    },
    {
      id: 'walking' as const,
      icon: '🚶',
      title: 'Caminando',
      description: location.directions?.walking || 'Información para caminar no disponible'
    }
  ];

  const handleMapLoad = () => {
    setMapLoaded(true);
  };

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates.lat},${location.coordinates.lng}`;
    window.open(url, '_blank');
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(fullAddress);
      // Aquí podrías mostrar un toast de confirmación
      console.log('Dirección copiada al portapapeles');
    } catch (err) {
      console.error('Error al copiar la dirección:', err);
    }
  };

  const handleCallPhone = () => {
    window.location.href = `tel:${location.phone}`;
  };

  const handleSendEmail = () => {
    if (location.email) {
      window.location.href = `mailto:${location.email}`;
    }
  };

  return (
    <section className={cn('py-16 bg-gray-50', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Información de contacto y ubicación */}
          <div className="space-y-6">
            {/* Información básica */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Información de Contacto
              </h3>
              
              <div className="space-y-4">
                {/* Dirección */}
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 text-orange-500 mt-1">
                    📍
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">Dirección</p>
                    <p className="text-gray-600 mt-1 leading-relaxed">
                      {fullAddress}
                    </p>
                    <button
                      onClick={handleCopyAddress}
                      className="text-sm text-orange-600 hover:text-orange-800 mt-1 focus:outline-none"
                    >
                      📋 Copiar dirección
                    </button>
                  </div>
                </div>

                {/* Teléfono */}
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 text-orange-500 mt-1">
                    📞
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">Teléfono</p>
                    <button
                      onClick={handleCallPhone}
                      className="text-gray-600 hover:text-orange-600 transition-colors mt-1"
                    >
                      {location.phone}
                    </button>
                  </div>
                </div>

                {/* Email */}
                {location.email && (
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 text-orange-500 mt-1">
                      ✉️
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">Email</p>
                      <button
                        onClick={handleSendEmail}
                        className="text-gray-600 hover:text-orange-600 transition-colors mt-1"
                      >
                        {location.email}
                      </button>
                    </div>
                  </div>
                )}

                {/* Coordenadas */}
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 text-orange-500 mt-1">
                    🌐
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">Coordenadas</p>
                    <p className="text-gray-600 mt-1">
                      {location.coordinates.lat}, {location.coordinates.lng}
                    </p>
                  </div>
                </div>
              </div>

              {/* Botón de direcciones */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleGetDirections}
                  className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  🗺️ Obtener Direcciones
                </button>
              </div>
            </div>

            {/* Información de estacionamiento */}
            {showParking && location.parking && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Estacionamiento
                </h3>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 text-green-500 mt-1">
                    {location.parking.available ? '✅' : '❌'}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">
                      {location.parking.available ? 'Disponible' : 'No Disponible'}
                    </p>
                    <p className="text-gray-600 mt-1">
                      {location.parking.description}
                    </p>
                    {location.parking.type && (
                      <span className={cn(
                        'inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium',
                        location.parking.type === 'free' && 'bg-green-100 text-green-800',
                        location.parking.type === 'paid' && 'bg-yellow-100 text-yellow-800',
                        location.parking.type === 'valet' && 'bg-blue-100 text-blue-800'
                      )}>
                        {location.parking.type === 'free' && '🆓 Gratuito'}
                        {location.parking.type === 'paid' && '💳 De Pago'}
                        {location.parking.type === 'valet' && '🚗 Valet'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Puntos de referencia */}
            {showLandmarks && location.landmarks && location.landmarks.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Puntos de Referencia
                </h3>
                
                <div className="space-y-2">
                  {location.landmarks.map((landmark, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-4 h-4 text-orange-500 mt-1">
                        •
                      </div>
                      <p className="text-gray-600">{landmark}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mapa y direcciones */}
          <div className="space-y-6">
            {/* Mapa embebido */}
            {showMap && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div 
                  className="relative bg-gray-200"
                  style={{ height: mapHeight }}
                >
                  {embedMapUrl ? (
                    <iframe
                      src={defaultEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      onLoad={handleMapLoad}
                      title="Ubicación del restaurante"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🗺️</div>
                        <p className="text-gray-600">Mapa no disponible</p>
                        <button
                          onClick={handleGetDirections}
                          className="mt-2 text-orange-600 hover:text-orange-800 font-medium"
                        >
                          Ver en Google Maps
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {!mapLoaded && embedMapUrl && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
                        <p className="text-gray-600">Cargando mapa...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Instrucciones de transporte */}
            {showTransport && location.directions && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Cómo Llegar
                </h3>
                
                {/* Tabs de transporte */}
                <div className="flex border-b border-gray-200 mb-4">
                  {transportOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setActiveTab(option.id)}
                      className={cn(
                        'flex-1 px-4 py-2 text-sm font-medium text-center border-b-2 transition-colors',
                        activeTab === option.id
                          ? 'border-orange-500 text-orange-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      )}
                    >
                      <span className="mr-1">{option.icon}</span>
                      {option.title}
                    </button>
                  ))}
                </div>

                {/* Contenido del tab activo */}
                <div>
                  {transportOptions.map((option) => (
                    <div
                      key={option.id}
                      className={cn(
                        'transition-opacity duration-200',
                        activeTab === option.id ? 'opacity-100' : 'opacity-0 hidden'
                      )}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 text-2xl">
                          {option.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-2">
                            {option.title}
                          </h4>
                          <p className="text-gray-600 leading-relaxed">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;