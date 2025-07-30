import { useQuery, useQueryClient } from "react-query";
import { menuEndpoints } from "../api/endpoints/menu";
import { MenuFilter } from "../api/types";

/**
 * Hook para obtener todos los items del menú
 */
export const useMenu = (filters?: Partial<MenuFilter>) => {
  return useQuery(["menu", filters], () => menuEndpoints.getAll(filters), {
    staleTime: 300000, // 5 minutos (el menú no cambia frecuentemente)
    cacheTime: 600000, // 10 minutos
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 3,
    retryDelay: 1000,
  });
};

/**
 * Hook para obtener items del menú por categoría
 */
export const useMenuByCategory = (categoria: string) => {
  return useQuery(
    ["menu", "category", categoria],
    () => menuEndpoints.getByCategory(categoria),
    {
      enabled: !!categoria,
      staleTime: 300000,
      cacheTime: 600000,
      retry: 3,
      retryDelay: 1000,
    }
  );
};

/**
 * Hook para obtener un item específico del menú
 */
export const useMenuItem = (id: number) => {
  return useQuery(["menuItem", id], () => menuEndpoints.getById(id), {
    enabled: !!id,
    staleTime: 300000,
    cacheTime: 600000,
    retry: 3,
    retryDelay: 1000,
  });
};

/**
 * Hook para buscar items del menú
 */
export const useMenuSearch = (searchTerm: string) => {
  return useQuery(
    ["menu", "search", searchTerm],
    () => menuEndpoints.search(searchTerm),
    {
      enabled: !!searchTerm && searchTerm.length >= 2,
      staleTime: 60000, // 1 minuto
      cacheTime: 300000, // 5 minutos
      retry: 2,
      retryDelay: 500,
    }
  );
};

/**
 * Hook para obtener items destacados del menú
 */
export const useFeaturedMenuItems = () => {
  return useQuery(
    ["menu", "featured"],
    () => menuEndpoints.getFeatured?.() || Promise.resolve([]),
    {
      staleTime: 600000, // 10 minutos
      cacheTime: 1200000, // 20 minutos
      retry: 3,
      retryDelay: 1000,
    }
  );
};

/**
 * Hook para obtener categorías del menú
 */
export const useMenuCategories = () => {
  return useQuery(
    ["menu", "categories"],
    () => menuEndpoints.getCategories?.() || Promise.resolve([]),
    {
      staleTime: 600000, // 10 minutos
      cacheTime: 1200000, // 20 minutos
      retry: 3,
      retryDelay: 1000,
    }
  );
};

/**
 * Hook para obtener items disponibles del menú
 */
export const useAvailableMenuItems = () => {
  return useQuery(
    ["menu", "available"],
    () => menuEndpoints.getAll({ disponible: true }),
    {
      staleTime: 180000, // 3 minutos
      cacheTime: 600000, // 10 minutos
      refetchOnWindowFocus: true,
      retry: 3,
      retryDelay: 1000,
    }
  );
};

/**
 * Hook para gestionar favoritos del menú (local storage)
 */
export const useMenuFavorites = () => {
  const queryClient = useQueryClient();

  const getFavorites = (): number[] => {
    try {
      const saved = localStorage.getItem("menuFavorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const addToFavorites = (itemId: number) => {
    const favorites = getFavorites();
    if (!favorites.includes(itemId)) {
      const newFavorites = [...favorites, itemId];
      localStorage.setItem("menuFavorites", JSON.stringify(newFavorites));
      queryClient.invalidateQueries(["menuFavorites"]);
    }
  };

  const removeFromFavorites = (itemId: number) => {
    const favorites = getFavorites();
    const newFavorites = favorites.filter((id) => id !== itemId);
    localStorage.setItem("menuFavorites", JSON.stringify(newFavorites));
    queryClient.invalidateQueries(["menuFavorites"]);
  };

  const isFavorite = (itemId: number): boolean => {
    return getFavorites().includes(itemId);
  };

  const clearFavorites = () => {
    localStorage.removeItem("menuFavorites");
    queryClient.invalidateQueries(["menuFavorites"]);
  };

  return {
    favorites: getFavorites(),
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearFavorites,
  };
};

/**
 * Hook para obtener items favoritos completos
 */
export const useFavoriteMenuItems = () => {
  const { favorites } = useMenuFavorites();

  return useQuery(
    ["menu", "favorites", favorites],
    async () => {
      if (favorites.length === 0) return [];

      const items = await Promise.all(
        favorites.map((id) => menuEndpoints.getById(id))
      );

      return items.filter(Boolean); // Filtrar items que no existen
    },
    {
      enabled: favorites.length > 0,
      staleTime: 300000,
      cacheTime: 600000,
      retry: 2,
    }
  );
};
