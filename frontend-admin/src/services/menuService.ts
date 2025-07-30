export type Producto = {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  descripcion?: string;
};

const API_BASE_URL = "http://localhost:8080/api";

export async function getMenu(): Promise<Producto[]> {
  console.log("🔄 Cargando menú desde:", `${API_BASE_URL}/menu`);

  try {
    const res = await fetch(`${API_BASE_URL}/menu`);
    console.log("📡 Respuesta del servidor:", res.status, res.statusText);

    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status} - ${res.statusText}`);
    }

    const data = await res.json();
    console.log("✅ Productos cargados desde backend:", data.length);
    console.log("📋 Productos:", data);

    if (!Array.isArray(data)) {
      throw new Error("La respuesta del servidor no es un array válido");
    }

    if (data.length === 0) {
      console.warn("⚠️ No hay productos en la base de datos");
      throw new Error("No hay productos disponibles en el menú");
    }

    return data;
  } catch (error) {
    console.error("❌ Error al cargar menú desde backend:", error);
    throw new Error(
      `No se pudo cargar el menú: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
  }
}

export async function agregarProducto(
  producto: Omit<Producto, "id">
): Promise<Producto> {
  console.log("➕ Agregando producto:", producto);

  try {
    const res = await fetch(`${API_BASE_URL}/menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(producto),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error HTTP: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    console.log("✅ Producto agregado:", data);
    return data;
  } catch (error) {
    console.error("❌ Error al agregar producto:", error);
    throw new Error(
      `No se pudo agregar el producto: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
  }
}

export async function eliminarProducto(id: number): Promise<void> {
  console.log("🗑️ Eliminando producto ID:", id);

  try {
    const res = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status}`);
    }

    console.log("✅ Producto eliminado exitosamente");
  } catch (error) {
    console.error("❌ Error al eliminar producto:", error);
    throw new Error(
      `No se pudo eliminar el producto: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
  }
}

export async function editarProducto(
  id: number,
  producto: Partial<Omit<Producto, "id">>
): Promise<Producto> {
  console.log("✏️ Editando producto ID:", id, producto);

  try {
    const res = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(producto),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error HTTP: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    console.log("✅ Producto editado:", data);
    return data;
  } catch (error) {
    console.error("❌ Error al editar producto:", error);
    throw new Error(
      `No se pudo editar el producto: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
  }
}
