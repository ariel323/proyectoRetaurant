import { authService } from "./authService";

export type Usuario = {
  id: number;
  username: string; // <-- Cambiar 'nombre' por 'username'
  password?: string; // <-- Agregar password (opcional para mostrar)
  rol: string;
};

export async function getUsuarios(): Promise<Usuario[]> {
  return authService.authenticatedRequest<Usuario[]>("/usuarios");
}

export async function agregarUsuario(
  usuario: Omit<Usuario, "id">
): Promise<Usuario> {
  return authService.authenticatedRequest<Usuario>("/usuarios", {
    method: "POST",
    body: JSON.stringify(usuario),
  });
}

export async function eliminarUsuario(id: number) {
  const res = await fetch(`/api/usuarios/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar el usuario");
}
