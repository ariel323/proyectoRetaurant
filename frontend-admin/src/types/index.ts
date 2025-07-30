export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
}

export interface Mesa {
  id: number;
  numero: number;
  estado: "LIBRE" | "OCUPADA" | "RESERVADA";
}

export interface Usuario {
  id: number;
  username: string;
  rol: string;
}

export interface Pedido {
  id: number;
  mesa: Mesa;
  items: Producto[];
  total: number;
  estado: string;
}


