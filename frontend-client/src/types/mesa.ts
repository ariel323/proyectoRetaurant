export interface Mesa {
  id: number;
  numero: number;
  estado: "LIBRE" | "OCUPADA" | "RESERVADA" | "MANTENIMIENTO";
  capacidad?: number;
  ubicacion?: string;
  fechaCreacion: string;
  fechaActualizacion?: string;
}

export interface CreateMesaRequest {
  numero: number;
  capacidad?: number;
  ubicacion?: string;
}

export interface UpdateMesaRequest {
  numero?: number;
  estado?: "LIBRE" | "OCUPADA" | "RESERVADA" | "MANTENIMIENTO";
  capacidad?: number;
  ubicacion?: string;
}

export interface MesaFilter {
  estado?: string;
  capacidadMin?: number;
  capacidadMax?: number;
  ubicacion?: string;
}
