export interface Mesa {
  id: number;
  numero: number;
}

export interface MenuItem {
  id: number;
  nombre: string;
  precio: number;
}

export interface Pedido {
  id: number;
  mesa: Mesa;
  items: MenuItem[];
  total: number;
  estado: string;
}

export type Producto = {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
};

const API_BASE_URL = "http://localhost:8080/api";

export async function getPedidos(): Promise<Pedido[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/pedidos`);

    if (!response.ok) {
      throw new Error(
        `Error HTTP: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("La respuesta del servidor no es un array válido");
    }

    console.log(`✅ ${data.length} pedidos cargados desde el backend`);
    return data;
  } catch (error) {
    console.error("❌ Error al cargar pedidos:", error);
    throw new Error(
      `No se pudieron cargar los pedidos: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
  }
}

export async function agregarPedido(pedido: Pedido): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/pedidos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(pedido),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
    }

    console.log("✅ Pedido agregado exitosamente");
  } catch (error) {
    console.error("❌ Error al agregar pedido:", error);
    throw new Error(
      `No se pudo agregar el pedido: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
  }
}

export async function eliminarPedido(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/pedidos/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    console.log("✅ Pedido eliminado exitosamente");
  } catch (error) {
    console.error("❌ Error al eliminar pedido:", error);
    throw new Error(
      `No se pudo eliminar el pedido: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
  }
}

// Re-exportar funciones del menú para mantener compatibilidad
export {
  getMenu,
  agregarProducto,
  eliminarProducto,
  editarProducto,
} from "./menuService";
