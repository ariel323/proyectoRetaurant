import { useQuery, useMutation, useQueryClient } from "react-query";
import { pedidosEndpoints } from "../api/endpoints/pedidos";
import {
  PedidoFilter,
  CreatePedidoRequest,
  UpdatePedidoRequest,
} from "../api/types";

/**
 * Hook para obtener todos los pedidos
 */
export const usePedidos = (filters?: Partial<PedidoFilter>) => {
  return useQuery(
    ["pedidos", filters],
    () => pedidosEndpoints.getAll(filters),
    {
      staleTime: 30000, // 30 segundos (los pedidos cambian frecuentemente)
      cacheTime: 300000, // 5 minutos
      refetchOnWindowFocus: true,
      refetchInterval: 60000, // Refrescar cada minuto para estado en tiempo real
      retry: 3,
      retryDelay: 1000,
    }
  );
};

/**
 * Hook para obtener un pedido específico
 */
export const usePedido = (id: number) => {
  return useQuery(["pedido", id], () => pedidosEndpoints.getById(id), {
    enabled: !!id,
    staleTime: 30000,
    cacheTime: 300000,
    retry: 3,
    retryDelay: 1000,
  });
};

/**
 * Hook para obtener pedidos por mesa
 */
export const usePedidosByMesa = (mesaId: number) => {
  return useQuery(
    ["pedidos", "mesa", mesaId],
    () => pedidosEndpoints.getByMesa(mesaId),
    {
      enabled: !!mesaId,
      staleTime: 30000,
      cacheTime: 300000,
      refetchOnWindowFocus: true,
      refetchInterval: 60000,
      retry: 3,
      retryDelay: 1000,
    }
  );
};

/**
 * Hook para obtener pedidos por estado
 */
export const usePedidosByEstado = (estado: string) => {
  return useQuery(
    ["pedidos", "estado", estado],
    () => pedidosEndpoints.getByStatus(estado as any),
    {
      enabled: !!estado,
      staleTime: 30000,
      cacheTime: 300000,
      refetchOnWindowFocus: true,
      refetchInterval: 60000,
      retry: 3,
      retryDelay: 1000,
    }
  );
};

/**
 * Hook para crear un nuevo pedido
 */
export const useCreatePedido = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (pedidoData: CreatePedidoRequest) => pedidosEndpoints.create(pedidoData),
    {
      onSuccess: (data) => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries(["pedidos"]);
        queryClient.invalidateQueries(["pedidos", "mesa", data.mesa_id]);
        queryClient.invalidateQueries(["pedidos", "estado", data.estado]);

        // Actualizar cache del pedido específico
        queryClient.setQueryData(["pedido", data.id], data);
      },
      onError: (error) => {
        console.error("Error al crear pedido:", error);
      },
    }
  );
};

/**
 * Hook para actualizar un pedido
 */
export const useUpdatePedido = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, data }: { id: number; data: UpdatePedidoRequest }) =>
      pedidosEndpoints.update(id, data),
    {
      onSuccess: (data) => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries(["pedidos"]);
        queryClient.invalidateQueries(["pedidos", "mesa", data.mesa_id]);
        queryClient.invalidateQueries(["pedidos", "estado", data.estado]);

        // Actualizar cache del pedido específico
        queryClient.setQueryData(["pedido", data.id], data);
      },
      onError: (error) => {
        console.error("Error al actualizar pedido:", error);
      },
    }
  );
};

/**
 * Hook para cambiar el estado de un pedido
 */
export const useUpdatePedidoEstado = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, estado }: { id: number; estado: string }) =>
      pedidosEndpoints.update(id, { estado } as UpdatePedidoRequest),
    {
      onSuccess: (data) => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries(["pedidos"]);
        queryClient.invalidateQueries(["pedidos", "mesa", data.mesa_id]);
        queryClient.invalidateQueries(["pedidos", "estado"]);

        // Actualizar cache del pedido específico
        queryClient.setQueryData(["pedido", data.id], data);
      },
      onError: (error) => {
        console.error("Error al actualizar estado del pedido:", error);
      },
    }
  );
};

/**
 * Hook para cancelar un pedido
 */
export const useCancelPedido = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, motivo }: { id: number; motivo?: string }) =>
      pedidosEndpoints.cancel(id, motivo),
    {
      onSuccess: (response, variables) => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries(["pedidos"]);
        queryClient.invalidateQueries(["pedidos", "mesa"]);
        queryClient.invalidateQueries(["pedidos", "estado"]);
        queryClient.invalidateQueries(["pedido", variables.id]);
      },
      onError: (error) => {
        console.error("Error al cancelar pedido:", error);
      },
    }
  );
};

/**
 * Hook para obtener el historial de pedidos del usuario actual
 */
export const useUserPedidoHistory = () => {
  return useQuery(
    ["pedidos", "user", "history"],
    () =>
      pedidosEndpoints.getAll({ sortBy: "fecha_creacion", sortOrder: "desc" }),
    {
      staleTime: 300000, // 5 minutos
      cacheTime: 600000, // 10 minutos
      retry: 3,
      retryDelay: 1000,
    }
  );
};

/**
 * Hook para tracking de pedido en tiempo real
 */
export const usePedidoTracking = (pedidoId: number) => {
  return useQuery(
    ["pedido", "tracking", pedidoId],
    () => pedidosEndpoints.getById(pedidoId),
    {
      enabled: !!pedidoId,
      staleTime: 15000, // 15 segundos
      refetchInterval: 30000, // Refrescar cada 30 segundos
      refetchOnWindowFocus: true,
      retry: 3,
      retryDelay: 1000,
    }
  );
};

/**
 * Hook para gestionar el pedido activo en localStorage
 */
export const useActivePedido = () => {
  const queryClient = useQueryClient();

  const getActivePedido = (): number | null => {
    try {
      const saved = localStorage.getItem("activePedidoId");
      return saved ? parseInt(saved, 10) : null;
    } catch {
      return null;
    }
  };

  const setActivePedido = (pedidoId: number | null) => {
    if (pedidoId === null) {
      localStorage.removeItem("activePedidoId");
    } else {
      localStorage.setItem("activePedidoId", pedidoId.toString());
    }
    queryClient.invalidateQueries(["pedido", "active"]);
  };

  const clearActivePedido = () => {
    localStorage.removeItem("activePedidoId");
    queryClient.invalidateQueries(["pedido", "active"]);
  };

  const activePedidoId = getActivePedido();

  // Query para obtener los datos completos del pedido activo
  const activePedidoQuery = useQuery(
    ["pedido", "active", activePedidoId],
    () => (activePedidoId ? pedidosEndpoints.getById(activePedidoId) : null),
    {
      enabled: !!activePedidoId,
      staleTime: 30000,
      refetchInterval: 60000,
      retry: 3,
    }
  );

  return {
    activePedidoId,
    activePedido: activePedidoQuery.data,
    isLoadingActivePedido: activePedidoQuery.isLoading,
    activePedidoError: activePedidoQuery.error,
    setActivePedido,
    clearActivePedido,
    refetchActivePedido: activePedidoQuery.refetch,
  };
};
