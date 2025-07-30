import { useQuery, useQueryClient } from "react-query";
import { mesasEndpoints } from "../api/endpoints/mesas";
import { Mesa } from "../types";
import { MesaFilter } from "../api/types";

/**
 * Hook para obtener todas las mesas
 */
export const useMesas = (filters?: Partial<MesaFilter>) => {
  return useQuery(["mesas", filters], () => mesasEndpoints.getAll(filters), {
    staleTime: 30000, // 30 segundos
    cacheTime: 300000, // 5 minutos
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3,
    retryDelay: 1000,
  });
};

/**
 * Hook para obtener mesas disponibles únicamente
 */
export const useMesasDisponibles = () => {
  return useQuery(
    ["mesas", "disponibles"],
    () => mesasEndpoints.getAll({ estado: "LIBRE" }),
    {
      staleTime: 30000,
      cacheTime: 300000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 3,
      retryDelay: 1000,
    }
  );
};

/**
 * Hook legacy mantenido para compatibilidad
 */
export const useMesasLibres = () => {
  return useMesasDisponibles();
};

/**
 * Hook para obtener una mesa específica por ID
 */
export const useMesa = (id: number) => {
  return useQuery(["mesa", id], () => mesasEndpoints.getById(id), {
    enabled: !!id,
    staleTime: 60000, // 1 minuto
    cacheTime: 300000, // 5 minutos
    retry: 3,
    retryDelay: 1000,
  });
};

/**
 * Hook para verificar disponibilidad de una mesa
 */
export const useCheckMesaAvailability = (id: number) => {
  return useQuery(
    ["mesa", id, "availability"],
    () => mesasEndpoints.checkAvailability?.(id) || Promise.resolve(true),
    {
      enabled: !!id,
      staleTime: 15000, // 15 segundos
      cacheTime: 60000, // 1 minuto
      refetchInterval: 30000, // Refetch cada 30 segundos
      retry: 2,
    }
  );
};

/**
 * Hook para seleccionar mesa con persistencia local
 */
export const useSelectedMesa = () => {
  const queryClient = useQueryClient();

  const selectMesa = (mesa: Mesa) => {
    // Guardar en localStorage
    localStorage.setItem("selectedMesa", JSON.stringify(mesa));

    // Actualizar cache de React Query
    queryClient.setQueryData(["selectedMesa"], mesa);

    // Opcional: Trigger evento customizado para otros componentes
    window.dispatchEvent(new CustomEvent("mesaSelected", { detail: mesa }));
  };

  const getSelectedMesa = (): Mesa | null => {
    try {
      const saved = localStorage.getItem("selectedMesa");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const clearSelectedMesa = () => {
    localStorage.removeItem("selectedMesa");
    queryClient.removeQueries(["selectedMesa"]);
    window.dispatchEvent(new CustomEvent("mesaCleared"));
  };

  return {
    selectMesa,
    getSelectedMesa,
    clearSelectedMesa,
    selectedMesa: getSelectedMesa(),
  };
};
