// Import types for utility functions
import type { FilterState } from "./MenuContainer";

// Menu Components
export { default as MenuContainer } from "./MenuContainer";
export { default as MenuGrid } from "./MenuGrid";
export { default as MenuCard } from "./MenuCard";
export { default as MenuSearch } from "./MenuSearch";
export { default as MenuFilters } from "./MenuFilters";
export { default as CategoryTabs } from "./CategoryTabs";
export { default as CategoryGrid } from "./CategoryGrid";
export { default as FeaturedItems } from "./FeaturedItems";

// Menu Item Components
export { default as MenuItemDetails } from "./MenuItemDetails";
export {
  default as MenuItemModal,
  useMenuItemModal,
  MenuItemModalProvider,
} from "./MenuItemModal";

// Utility Components
export {
  default as MenuCardSkeleton,
  MenuGridSkeleton,
  MenuHorizontalSkeleton,
  CategorySkeleton,
} from "./MenuCardSkeleton";
export {
  default as PriceDisplay,
  PriceRange,
  PriceWithInfo,
  PriceComparison,
} from "./PriceDisplay";
export { default as IngredientsList } from "./IngredientsList";
export { default as NutritionalInfo } from "./NutritionalInfo";

// Types
export type { MenuContainerProps, FilterState } from "./MenuContainer";
export type { MenuSearchProps } from "./MenuSearch";
export type { CategoryTabsProps } from "./CategoryTabs";
export type { CategoryGridProps } from "./CategoryGrid";
export type { MenuFiltersProps } from "./MenuFilters";
export type { FeaturedItemsProps } from "./FeaturedItems";
export type { MenuItemDetailsProps } from "./MenuItemDetails";
export type { MenuItemModalProps } from "./MenuItemModal";
export type { MenuCardSkeletonProps } from "./MenuCardSkeleton";
export type { PriceDisplayProps } from "./PriceDisplay";
export type { IngredientsListProps } from "./IngredientsList";
export type { NutritionalInfoProps, NutritionalData } from "./NutritionalInfo";

/**
 * Menu utility functions
 */

// Función para filtrar items del menú
export const filterMenuItems = (items: any[], filters: FilterState) => {
  return items.filter((item) => {
    // Filtro por categoría
    if (filters.categoria && item.categoria !== filters.categoria) {
      return false;
    }

    // Filtro por búsqueda
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      if (
        !item.nombre.toLowerCase().includes(searchTerm) &&
        !item.descripcion?.toLowerCase().includes(searchTerm) &&
        !item.ingredientes?.some((ing: string) =>
          ing.toLowerCase().includes(searchTerm)
        )
      ) {
        return false;
      }
    }

    // Filtro por precio
    if (
      item.precio < filters.priceRange[0] ||
      item.precio > filters.priceRange[1]
    ) {
      return false;
    }

    // Filtro por vegetariano
    if (filters.vegetariano && !item.vegetariano) {
      return false;
    }

    // Filtro por picante
    if (filters.picante && !item.picante) {
      return false;
    }

    // Filtro por disponibilidad
    if (filters.disponible && !item.disponible) {
      return false;
    }

    return true;
  });
};

// Función para obtener categorías únicas del menú
export const getCategoriesFromItems = (items: any[]) => {
  const categoryMap = new Map();

  items.forEach((item) => {
    if (!categoryMap.has(item.categoria)) {
      categoryMap.set(item.categoria, {
        id: item.categoria,
        nombre: item.categoria,
        cantidad_items: 0,
        icono: getCategoryIcon(item.categoria),
        activa: true,
        descripcion: getCategoryDescription(item.categoria),
        imagen: getCategoryImage(item.categoria),
      });
    }
    categoryMap.get(item.categoria).cantidad_items++;
  });

  return Array.from(categoryMap.values());
};

// Función para obtener íconos de categorías
export const getCategoryIcon = (categoria: string): string => {
  const icons: Record<string, string> = {
    ENTRADAS: "🥗",
    PLATOS_PRINCIPALES: "🍽️",
    POSTRES: "🍰",
    BEBIDAS: "🥤",
    ENSALADAS: "🥬",
    SOPAS: "🍲",
    CARNES: "🥩",
    PESCADOS: "🐟",
    PASTAS: "🍝",
    PIZZAS: "🍕",
    HAMBURGUESAS: "🍔",
    SANDWICHES: "🥪",
    TACOS: "🌮",
    SUSHI: "🍣",
    DESAYUNOS: "🥞",
    SNACKS: "🍿",
    HELADOS: "🍦",
    CAFETERIA: "☕",
    JUGOS: "🧃",
    COCTELES: "🍹",
  };

  return icons[categoria.toUpperCase()] || "🍽️";
};

// Función para obtener descripciones de categorías
export const getCategoryDescription = (categoria: string): string => {
  const descriptions: Record<string, string> = {
    ENTRADAS: "Deliciosos aperitivos para comenzar tu comida",
    PLATOS_PRINCIPALES: "Nuestros platos estrella para satisfacer tu apetito",
    POSTRES: "Dulces tentaciones para terminar perfectamente",
    BEBIDAS: "Refrescantes bebidas para acompañar tu comida",
    ENSALADAS: "Frescas y nutritivas opciones saludables",
    SOPAS: "Reconfortantes sopas caseras",
    CARNES: "Carnes premium cocinadas a la perfección",
    PESCADOS: "Pescados frescos del día",
    PASTAS: "Pastas artesanales con salsas especiales",
    PIZZAS: "Pizzas horneadas en horno de leña",
    HAMBURGUESAS: "Jugosas hamburguesas gourmet",
    SANDWICHES: "Sandwiches frescos y sabrosos",
    TACOS: "Auténticos tacos mexicanos",
    SUSHI: "Sushi fresco preparado por expertos",
    DESAYUNOS: "Desayunos nutritivos para empezar el día",
    SNACKS: "Aperitivos perfectos para picar",
    HELADOS: "Cremosos helados artesanales",
    CAFETERIA: "Café premium y acompañamientos",
    JUGOS: "Jugos naturales recién exprimidos",
    COCTELES: "Cócteles creativos y refrescantes",
  };

  return (
    descriptions[categoria.toUpperCase()] || "Deliciosas opciones culinarias"
  );
};

// Función para obtener imágenes de categorías
export const getCategoryImage = (categoria: string): string => {
  const images: Record<string, string> = {
    ENTRADAS: "/assets/images/categories/entradas.jpg",
    PLATOS_PRINCIPALES: "/assets/images/categories/platos-principales.jpg",
    POSTRES: "/assets/images/categories/postres.jpg",
    BEBIDAS: "/assets/images/categories/bebidas.jpg",
    ENSALADAS: "/assets/images/categories/ensaladas.jpg",
    SOPAS: "/assets/images/categories/sopas.jpg",
    CARNES: "/assets/images/categories/carnes.jpg",
    PESCADOS: "/assets/images/categories/pescados.jpg",
    PASTAS: "/assets/images/categories/pastas.jpg",
    PIZZAS: "/assets/images/categories/pizzas.jpg",
    HAMBURGUESAS: "/assets/images/categories/hamburguesas.jpg",
    SANDWICHES: "/assets/images/categories/sandwiches.jpg",
    TACOS: "/assets/images/categories/tacos.jpg",
    SUSHI: "/assets/images/categories/sushi.jpg",
    DESAYUNOS: "/assets/images/categories/desayunos.jpg",
    SNACKS: "/assets/images/categories/snacks.jpg",
    HELADOS: "/assets/images/categories/helados.jpg",
    CAFETERIA: "/assets/images/categories/cafeteria.jpg",
    JUGOS: "/assets/images/categories/jugos.jpg",
    COCTELES: "/assets/images/categories/cocteles.jpg",
  };

  return (
    images[categoria.toUpperCase()] || "/assets/images/categories/default.jpg"
  );
};

// Función para ordenar items del menú
export const sortMenuItems = (
  items: any[],
  sortBy: "nombre" | "precio" | "rating" | "categoria" = "nombre"
) => {
  return [...items].sort((a, b) => {
    switch (sortBy) {
      case "precio":
        return a.precio - b.precio;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "categoria":
        return a.categoria.localeCompare(b.categoria);
      default:
        return a.nombre.localeCompare(b.nombre);
    }
  });
};

// Función para calcular estadísticas del menú
export const getMenuStats = (items: any[]) => {
  const stats = {
    total: items.length,
    disponibles: items.filter((item) => item.disponible).length,
    vegetarianos: items.filter((item) => item.vegetariano).length,
    picantes: items.filter((item) => item.picante).length,
    precioPromedio: 0,
    precioMin: 0,
    precioMax: 0,
    categorias: new Set(items.map((item) => item.categoria)).size,
  };

  if (items.length > 0) {
    const precios = items.map((item) => item.precio);
    stats.precioPromedio =
      precios.reduce((sum, precio) => sum + precio, 0) / precios.length;
    stats.precioMin = Math.min(...precios);
    stats.precioMax = Math.max(...precios);
  }

  return stats;
};
