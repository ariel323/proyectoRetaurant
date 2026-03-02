import React, { useEffect, useState, useCallback } from "react";
import {
  getMenu,
  agregarProducto,
  eliminarProducto,
  editarProducto,
  Producto,
  uploadImagen,
} from "../../services/menuService";
import { EmptyState } from "../common";
import { useToast } from "../../hooks/useToast";

const MenuAdmin: React.FC = () => {
  const [menu, setMenu] = useState<Producto[]>([]);
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const cargarMenu = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const productos = await getMenu();
      setMenu(productos);
      console.log(`✅ ${productos.length} productos cargados en MenuAdmin`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      setError(errorMessage);
      console.error("❌ Error en MenuAdmin:", errorMessage);
      addToast({
        type: "error",
        message: `Error al cargar el menú: ${errorMessage}`,
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    cargarMenu();
  }, [cargarMenu]);

  const handleAgregar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !categoria.trim() || !precio) {
      addToast({
        type: "error",
        message: "Todos los campos son obligatorios",
      });
      return;
    }

    try {
      const precioNumerico = parseFloat(precio);
      if (isNaN(precioNumerico) || precioNumerico <= 0) {
        addToast({
          type: "error",
          message: "El precio debe ser un número válido mayor que 0",
        });
        return;
      }

      const nuevo = await agregarProducto({
        nombre: nombre.trim(),
        categoria: categoria.trim(),
        precio: precioNumerico,
        descripcion: descripcion.trim() || undefined,
      });

      // si hay imagen seleccionada, subirla
      if (imageFile && nuevo && nuevo.id) {
        try {
          await uploadImagen(nuevo.id, imageFile);
        } catch (imgErr) {
          console.error("Error subiendo imagen:", imgErr);
          addToast({
            type: "warning",
            message: "Producto creado pero falló la subida de imagen",
          });
        }
      }

      addToast({
        type: "success",
        message: "¡Producto agregado exitosamente!",
      });

      setNombre("");
      setCategoria("");
      setPrecio("");
      setDescripcion("");
      setImageFile(null);
      setPreview(null);
      await cargarMenu();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      addToast({
        type: "error",
        message: `Error al agregar producto: ${errorMessage}`,
      });
    }
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;

    try {
      await eliminarProducto(id);
      addToast({
        type: "success",
        message: "Producto eliminado exitosamente",
      });
      await cargarMenu();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      addToast({
        type: "error",
        message: `Error al eliminar producto: ${errorMessage}`,
      });
    }
  };

  const handleEditar = async (producto: Producto) => {
    const nuevoNombre = prompt("Nuevo nombre:", producto.nombre);
    if (nuevoNombre === null) return;

    const nuevaCategoria = prompt("Nueva categoría:", producto.categoria);
    if (nuevaCategoria === null) return;

    const nuevoPrecio = prompt("Nuevo precio:", producto.precio.toString());
    if (nuevoPrecio === null) return;

    const nuevaDescripcion = prompt(
      "Nueva descripción:",
      producto.descripcion || "",
    );
    if (nuevaDescripcion === null) return;

    try {
      const precioNumerico = parseFloat(nuevoPrecio);
      if (isNaN(precioNumerico) || precioNumerico <= 0) {
        addToast({
          type: "error",
          message: "El precio debe ser un número válido mayor que 0",
        });
        return;
      }

      await editarProducto(producto.id, {
        nombre: nuevoNombre.trim(),
        categoria: nuevaCategoria.trim(),
        precio: precioNumerico,
        descripcion: nuevaDescripcion.trim() || undefined,
      });

      addToast({
        type: "success",
        message: "Producto actualizado exitosamente",
      });
      await cargarMenu();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      addToast({
        type: "error",
        message: `Error al actualizar producto: ${errorMessage}`,
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Cargando menú...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <EmptyState
            title="Error al cargar el menú"
            description={`No se pudo conectar con el servidor: ${error}`}
            icon="❌"
            actionButton={{
              text: "Reintentar",
              onClick: cargarMenu,
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          🍽️ Gestión de Menú
        </h2>

        <form
          onSubmit={handleAgregar}
          className="bg-gray-50 rounded-lg p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Agregar Nuevo Producto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del plato"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              placeholder="Categoría (ej: ENTRADAS, PLATOS_PRINCIPALES)"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="Precio"
              type="number"
              step="0.01"
              min="0.01"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción (opcional)"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagen (opcional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files && e.target.files[0];
                  if (f) {
                    setImageFile(f);
                    const url = URL.createObjectURL(f);
                    setPreview(url);
                  } else {
                    setImageFile(null);
                    setPreview(null);
                  }
                }}
                className="w-full"
              />
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="mt-2 h-24 w-24 object-cover rounded"
                />
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Agregar Producto
          </button>
        </form>

        {menu.length === 0 ? (
          <EmptyState
            title="No hay productos en el menú"
            description="Agrega el primer producto para comenzar a gestionar tu menú del restaurante."
            icon="🍽️"
          />
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Productos del Menú ({menu.length})
            </h3>
            {menu.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex items-center gap-4">
                    {item.imagen && (
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        className="h-20 w-20 object-cover rounded mr-4"
                        loading="lazy"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {item.nombre}
                      </h3>
                      <p className="text-sm text-gray-600 uppercase font-medium">
                        {item.categoria}
                      </p>
                      {item.descripcion && (
                        <p className="text-sm text-gray-600 mt-1">
                          {item.descripcion}
                        </p>
                      )}
                      <p className="text-xl font-bold text-green-600 mt-2">
                        ${item.precio.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditar(item)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuAdmin;
