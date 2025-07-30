export interface Mesa {
  id: number;
  numero: number;
  estado: "LIBRE" | "OCUPADA" | "RESERVADA";
  capacidad?: number;
  ubicacion?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface MesaCreateRequest {
  numero: number;
  estado?: "LIBRE" | "OCUPADA" | "RESERVADA";
  capacidad?: number;
  ubicacion?: string;
}

export interface MesaUpdateRequest extends Partial<MesaCreateRequest> {}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// ============================================================================
// CONFIGURACIÓN DE LA API
// ============================================================================

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8080/api";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

// ============================================================================
// FUNCIONES HELPER PARA REQUESTS
// ============================================================================

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Obtener token del localStorage si existe
  const token = localStorage.getItem("token");

  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    console.log(`🔄 API Request: ${config.method || "GET"} ${url}`);
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(
        response.status,
        `HTTP ${response.status}: ${errorText || response.statusText}`
      );
    }

    // Verificar si la respuesta tiene contenido
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      console.log(`✅ API Response: ${config.method || "GET"} ${url}`, data);
      return data;
    } else {
      // Para respuestas sin contenido (como DELETE)
      console.log(
        `✅ API Response: ${config.method || "GET"} ${url} - No content`
      );
      return {} as T;
    }
  } catch (error) {
    console.error(`❌ API Error: ${config.method || "GET"} ${url}`, error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      0,
      `Error de red: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
  }
}

// ============================================================================
// SERVICIOS DE MESAS
// ============================================================================

/**
 * Obtiene todas las mesas de la base de datos
 */
export async function getMesas(): Promise<Mesa[]> {
  try {
    const response = await apiRequest<Mesa[]>("/mesas");

    if (!Array.isArray(response)) {
      throw new Error("La respuesta del servidor no es un array válido");
    }

    console.log(`✅ ${response.length} mesas cargadas desde el backend`);

    if (response.length === 0) {
      console.warn("⚠️ No hay mesas en la base de datos");
    }

    return response;
  } catch (error) {
    console.error("❌ Error al cargar mesas:", error);
    throw new Error(
      `No se pudieron cargar las mesas: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
  }
}

/**
 * Obtiene una mesa específica por ID
 */
export async function getMesaPorId(id: number): Promise<Mesa> {
  try {
    const response = await apiRequest<Mesa>(`/mesas/${id}`);
    return response;
  } catch (error) {
    console.error(`❌ Error al obtener mesa ${id}:`, error);
    throw new Error(`No se pudo cargar la mesa con ID ${id}`);
  }
}

/**
 * Crea una nueva mesa en la base de datos
 */
export async function agregarMesa(mesa: MesaCreateRequest): Promise<Mesa> {
  try {
    // Validaciones básicas
    if (!mesa.numero || mesa.numero <= 0) {
      throw new Error("El número de mesa debe ser mayor a 0");
    }

    const response = await apiRequest<Mesa>("/mesas", {
      method: "POST",
      body: JSON.stringify({
        numero: mesa.numero,
        estado: mesa.estado || "LIBRE",
        capacidad: mesa.capacidad || 4,
        ubicacion: mesa.ubicacion || "Salón principal",
      }),
    });

    return response;
  } catch (error) {
    console.error("❌ Error al agregar mesa:", error);
    throw new Error(
      `No se pudo agregar la mesa: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
  }
}

/**
 * Actualiza una mesa existente
 */
export async function editarMesa(
  id: number,
  mesa: MesaUpdateRequest
): Promise<Mesa> {
  try {
    if (!id || id <= 0) {
      throw new Error("ID de mesa inválido");
    }

    const response = await apiRequest<Mesa>(`/mesas/${id}`, {
      method: "PUT",
      body: JSON.stringify(mesa),
    });

    return response;
  } catch (error) {
    console.error("❌ Error al editar mesa:", error);
    throw new Error(
      `No se pudo editar la mesa: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
  }
}

/**
 * Elimina una mesa de la base de datos
 */
export async function eliminarMesa(id: number): Promise<void> {
  try {
    if (!id || id <= 0) {
      throw new Error("ID de mesa inválido");
    }

    await apiRequest<void>(`/mesas/${id}`, {
      method: "DELETE",
    });

    console.log(`✅ Mesa ${id} eliminada exitosamente`);
  } catch (error) {
    console.error(`❌ Error al eliminar mesa ${id}:`, error);
    throw new Error(
      `No se pudo eliminar la mesa: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
  }
}

/**
 * Obtiene estadísticas de mesas
 */
export async function getEstadisticasMesas(): Promise<{
  total: number;
  libres: number;
  ocupadas: number;
  reservadas: number;
}> {
  try {
    const mesas = await getMesas();

    const estadisticas = {
      total: mesas.length,
      libres: mesas.filter((m) => m.estado === "LIBRE").length,
      ocupadas: mesas.filter((m) => m.estado === "OCUPADA").length,
      reservadas: mesas.filter((m) => m.estado === "RESERVADA").length,
    };

    console.log("📊 Estadísticas de mesas:", estadisticas);
    return estadisticas;
  } catch (error) {
    console.error("❌ Error al obtener estadísticas de mesas:", error);
    throw new Error(
      `No se pudieron obtener las estadísticas: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
  }
}
