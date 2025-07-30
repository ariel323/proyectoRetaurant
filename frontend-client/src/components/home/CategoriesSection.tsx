import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../utils/cn";
import { Category } from "../../types";
import { MenuService } from "../../services/menuService";

interface CategoriesSectionProps {
  /**
   * Título de la sección
   */
  title?: string;

  /**
   * Subtítulo de la sección
   */
  subtitle?: string;

  /**
   * Número máximo de categorías a mostrar
   */
  maxCategories?: number;

  /**
   * Layout de las categorías
   */
  layout?: "grid" | "carousel" | "list";

  /**
   * Tamaño de las tarjetas
   */
  cardSize?: "sm" | "md" | "lg";

  /**
   * Mostrar contador de items
   */
  showItemCount?: boolean;

  /**
   * Mostrar imágenes
   */
  showImages?: boolean;

  /**
   * Categorías a destacar
   */
  featuredCategories?: string[];

  /**
   * Función que se ejecuta al hacer clic en una categoría
   */
  onCategoryClick?: (category: Category) => void;

  /**
   * Clases CSS adicionales
   */
  className?: string;
}

interface CategoryCardProps {
  category: Category;
  size: "sm" | "md" | "lg";
  showItemCount: boolean;
  showImages: boolean;
  isFeatured?: boolean;
  onClick?: (category: Category) => void;
}

/**
 * Componente para mostrar una tarjeta de categoría
 */
const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  size,
  showItemCount,
  showImages,
  isFeatured = false,
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-32";
      case "md":
        return "h-40";
      case "lg":
        return "h-48";
      default:
        return "h-40";
    }
  };

  const getImageSize = () => {
    switch (size) {
      case "sm":
        return "w-16 h-16";
      case "md":
        return "w-20 h-20";
      case "lg":
        return "w-24 h-24";
      default:
        return "w-20 h-20";
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleClick = () => {
    onClick?.(category);
  };

  return (
    <Link
      to={`/menu?categoria=${encodeURIComponent(category.nombre)}`}
      onClick={handleClick}
      className={cn(
        "group relative bg-white rounded-lg shadow-md overflow-hidden",
        "hover:shadow-lg transform hover:scale-105 transition-all duration-300",
        "focus:outline-none focus:ring-4 focus:ring-orange-300",
        getSizeClasses(),
        isFeatured && "ring-2 ring-orange-400"
      )}
    >
      {showImages && (
        <div className="absolute inset-0">
          {!imageError && category.imagen ? (
            <img
              src={category.imagen}
              alt={category.nombre}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <span className="text-4xl text-white">
                {category.icono || "🍽️"}
              </span>
            </div>
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
        </div>
      )}

      {/* Contenido */}
      <div
        className={cn(
          "relative z-10 h-full flex flex-col justify-end p-4",
          !showImages &&
            "justify-center items-center bg-gradient-to-br from-orange-50 to-orange-100"
        )}
      >
        {!showImages && (
          <div
            className={cn(
              "mb-3 text-orange-500",
              getImageSize().replace("w-", "text-")
            )}
          >
            <span className="text-4xl">{category.icono || "🍽️"}</span>
          </div>
        )}

        <h3
          className={cn(
            "font-semibold mb-1",
            showImages ? "text-white text-lg" : "text-gray-900 text-center",
            size === "sm" ? "text-base" : "text-lg"
          )}
        >
          {category.nombre}
        </h3>

        {category.descripcion && (
          <p
            className={cn(
              "text-sm line-clamp-2",
              showImages ? "text-gray-200" : "text-gray-600 text-center"
            )}
          >
            {category.descripcion}
          </p>
        )}

        {showItemCount && (
          <div
            className={cn(
              "flex items-center mt-2",
              showImages ? "text-gray-200" : "text-gray-500 justify-center"
            )}
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" />
            </svg>
            <span className="text-xs font-medium">
              {category.cantidad_items}{" "}
              {category.cantidad_items === 1 ? "plato" : "platos"}
            </span>
          </div>
        )}

        {/* Indicador de categoría destacada */}
        {isFeatured && (
          <div className="absolute top-2 right-2">
            <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
              ⭐ Destacada
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

/**
 * Componente CategoriesSection - Muestra las categorías del menú
 */
export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  title = "Explora Nuestras Categorías",
  subtitle = "Descubre nuestra variada selección de platos organizados por categorías",
  maxCategories = 8,
  layout = "grid",
  cardSize = "md",
  showItemCount = true,
  showImages = true,
  featuredCategories = [],
  onCategoryClick,
  className,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const menuService = MenuService.getInstance();
        const menuItems = await menuService.getMenuItems();

        // Agrupar items por categoría y crear objetos Category
        const categoryMap = new Map<string, Category>();

        menuItems.forEach((item) => {
          const categoryName = item.categoria;
          if (categoryMap.has(categoryName)) {
            const category = categoryMap.get(categoryName)!;
            category.cantidad_items += 1;
          } else {
            categoryMap.set(categoryName, {
              id: categoryName.toLowerCase().replace(/\s+/g, "-"),
              nombre: categoryName,
              descripcion: getCategoryDescription(categoryName),
              cantidad_items: 1,
              imagen: getCategoryImage(categoryName),
              icono: getCategoryIcon(categoryName),
              activa: true,
            });
          }
        });

        let categoriesArray = Array.from(categoryMap.values());

        // Ordenar por cantidad de items (descendente) y tomar los primeros maxCategories
        categoriesArray.sort((a, b) => b.cantidad_items - a.cantidad_items);
        categoriesArray = categoriesArray.slice(0, maxCategories);

        setCategories(categoriesArray);
      } catch (error) {
        console.error("Error loading categories:", error);
        setError("No se pudieron cargar las categorías");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [maxCategories]);

  // Funciones auxiliares para obtener datos de categoría
  const getCategoryDescription = (categoryName: string): string => {
    const descriptions: Record<string, string> = {
      Entradas: "Deliciosos aperitivos para comenzar tu experiencia",
      "Platos Principales": "Nuestras especialidades más populares",
      Postres: "Dulces tentaciones para cerrar con broche de oro",
      Bebidas: "Refrescantes bebidas y cócteles especiales",
      Ensaladas: "Frescas y saludables opciones verdes",
      Pizzas: "Auténticas pizzas con masa artesanal",
      Pastas: "Deliciosas pastas caseras con salsas especiales",
      Carnes: "Cortes premium preparados a la perfección",
      Mariscos: "Frutos del mar frescos del día",
      Vegetariano: "Opciones saludables y deliciosas sin carne",
    };
    return (
      descriptions[categoryName] ||
      `Deliciosos platos de ${categoryName.toLowerCase()}`
    );
  };

  const getCategoryImage = (categoryName: string): string => {
    const images: Record<string, string> = {
      Entradas: "/assets/images/categories/entradas.jpg",
      "Platos Principales": "/assets/images/categories/platos-principales.jpg",
      Postres: "/assets/images/categories/postres.jpg",
      Bebidas: "/assets/images/categories/bebidas.jpg",
      Ensaladas: "/assets/images/categories/ensaladas.jpg",
      Pizzas: "/assets/images/categories/pizzas.jpg",
      Pastas: "/assets/images/categories/pastas.jpg",
      Carnes: "/assets/images/categories/carnes.jpg",
      Mariscos: "/assets/images/categories/mariscos.jpg",
      Vegetariano: "/assets/images/categories/vegetariano.jpg",
    };
    return images[categoryName] || "/assets/images/categories/default.jpg";
  };

  const getCategoryIcon = (categoryName: string): string => {
    const icons: Record<string, string> = {
      Entradas: "🥗",
      "Platos Principales": "🍽️",
      Postres: "🍰",
      Bebidas: "🥤",
      Ensaladas: "🥬",
      Pizzas: "🍕",
      Pastas: "🍝",
      Carnes: "🥩",
      Mariscos: "🦐",
      Vegetariano: "🌱",
    };
    return icons[categoryName] || "🍽️";
  };

  const getLayoutClasses = () => {
    switch (layout) {
      case "grid":
        return "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4";
      case "carousel":
        return "flex overflow-x-auto space-x-4 pb-4 scrollbar-hide";
      case "list":
        return "grid grid-cols-1 sm:grid-cols-2 gap-4";
      default:
        return "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4";
    }
  };

  const getSizeClass = () => {
    switch (cardSize) {
      case "sm":
        return "h-32";
      case "md":
        return "h-40";
      case "lg":
        return "h-48";
      default:
        return "h-40";
    }
  };

  if (loading) {
    return (
      <section className={cn("py-16 bg-white", className)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className={getLayoutClasses()}>
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className={cn(
                  "bg-gray-300 rounded-lg animate-pulse",
                  getSizeClass()
                )}
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={cn("py-16 bg-white", className)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="text-red-600 mb-2">⚠️</div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Error al cargar las categorías
            </h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("py-16 bg-white", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header de la sección */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* Grid de categorías */}
        {categories.length > 0 ? (
          <div className={getLayoutClasses()}>
            {categories.map((category) => (
              <div
                key={category.id}
                className={layout === "carousel" ? "flex-shrink-0 w-48" : ""}
              >
                <CategoryCard
                  category={category}
                  size={cardSize}
                  showItemCount={showItemCount}
                  showImages={showImages}
                  isFeatured={featuredCategories.includes(category.nombre)}
                  onClick={onCategoryClick}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay categorías disponibles
            </h3>
            <p className="text-gray-600">
              En este momento no tenemos categorías para mostrar.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
