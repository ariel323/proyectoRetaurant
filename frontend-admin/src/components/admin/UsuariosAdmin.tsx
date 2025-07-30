import React, { useEffect, useState } from "react";
import {
  getUsuarios,
  agregarUsuario,
  eliminarUsuario,
  Usuario,
} from "../../services/UsuarioService";

const UsuariosAdmin: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("CLIENTE");
  const [mensaje, setMensaje] = useState<string | null>(null);

  const cargarUsuarios = async () => {
    try {
      setUsuarios(await getUsuarios());
    } catch (e: any) {
      setMensaje(e.message);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleAgregar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await agregarUsuario({ username, password, rol });
      setMensaje("¡Usuario agregado!");
      setUsername("");
      setPassword("");
      setRol("CLIENTE");
      cargarUsuarios();
    } catch (e: any) {
      setMensaje("Error: " + e.message);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await eliminarUsuario(id);
      setMensaje("Usuario eliminado.");
      cargarUsuarios();
    } catch (e: any) {
      setMensaje("Error: " + e.message);
    }
  };

  const getRolColor = (rol: string) => {
    switch (rol) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "MESERO":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          👥 Gestión de Usuarios
        </h2>

        {mensaje && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md mb-6">
            {mensaje}
          </div>
        )}

        <form
          onSubmit={handleAgregar}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="CLIENTE">Cliente</option>
            <option value="MESERO">Mesero</option>
            <option value="ADMIN">Administrador</option>
          </select>
          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Agregar Usuario
          </button>
        </form>

        <div className="space-y-4">
          {usuarios.map((usuario) => (
            <div
              key={usuario.id}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {usuario.username}
                  </h3>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRolColor(
                      usuario.rol
                    )}`}
                  >
                    {usuario.rol}
                  </span>
                </div>
                <button
                  onClick={() => handleEliminar(usuario.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {usuarios.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No hay usuarios registrados
            </h3>
            <p className="text-gray-600">
              Agrega el primer usuario para empezar
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsuariosAdmin;
