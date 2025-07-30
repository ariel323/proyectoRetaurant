import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  MenuSearch,
  MenuItemModal
} from '../../components/menu';
import { useApiClient } from '../../hooks/useApiClient';
import { MenuItem } from '../../types';

const MenuPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('categoria') || 'all'
  );
  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.get('buscar') || ''
  );
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Construir query string para la API
  const buildApiUrl = () => {
    const params = new URLSearchParams();
    
    if (selectedCategory !== 'all') {
      params.append('categoria', selectedCategory);
    }
    
    if (searchTerm) {
      params.append('buscar', searchTerm);
    }
    
    return `/menu/items?${params.toString()}`;
  };

  const { data: menuItems, loading, error } = useApiClient<MenuItem[]>(
    buildApiUrl()
  );

  const { data: categories } = useApiClient<string[]>('/menu/categorias');

  // Actualizar URL cuando cambien los filtros
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (selectedCategory !== 'all') {
      params.set('categoria', selectedCategory);
    }
    
    if (searchTerm) {
      params.set('buscar', searchTerm);
    }
    
    setSearchParams(params);
  }, [selectedCategory, searchTerm, setSearchParams]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Nuestro Menú
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubre nuestra selección de platos preparados con ingredientes frescos y sabores auténticos
            </p>
          </div>
          
          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <MenuSearch 
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Buscar platos, ingredientes..."
            />
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex space-x-4 py-4">
            {['all', ...(categories || [])].map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'Todos' : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Menu Grid */}
          <div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg h-64"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Error al cargar el menú
                </h3>
                <p className="text-gray-600 mb-4">
                  No pudimos cargar los elementos del menú. Por favor, intenta nuevamente.
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            ) : !menuItems || menuItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No se encontraron platos
                </h3>
                <p className="text-gray-600 mb-4">
                  No hay platos que coincidan con tus criterios de búsqueda.
                </p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600">
                    Mostrando {menuItems.length} plato{menuItems.length !== 1 ? 's' : ''}
                    {selectedCategory !== 'all' && ` en ${selectedCategory}`}
                    {searchTerm && ` para "${searchTerm}"`}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    >
                      {item.imagen && (
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.nombre}
                        </h3>
                        {item.descripcion && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {item.descripcion}
                          </p>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-blue-600">
                            ${item.precio}
                          </span>
                          <div className="flex items-center space-x-2">
                            {item.vegetariano && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                Vegetariano
                              </span>
                            )}
                            {item.picante && (
                              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                                Picante
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <MenuItemModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default MenuPage;
