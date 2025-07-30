export const API_BASE_URL = "http://localhost:8080";

export const ENDPOINTS = {
  MENU: "/api/menu",
  MESAS: "/api/mesas",
  PEDIDOS: "/api/pedidos",
  USUARIOS: "/api/usuarios",
} as const;

export const ESTADOS_MESA = {
  LIBRE: "LIBRE",
  OCUPADA: "OCUPADA",
  RESERVADA: "RESERVADA",
} as const;

export const ESTADOS_PEDIDO = {
  PENDIENTE: "PENDIENTE",
  EN_PREPARACION: "EN_PREPARACION",
  LISTO: "LISTO",
  ENTREGADO: "ENTREGADO",
  CANCELADO: "CANCELADO",
} as const;

export const CATEGORIAS_MENU = {
  ENTRADA: "ENTRADA",
  PLATO_PRINCIPAL: "PLATO_PRINCIPAL",
  POSTRE: "POSTRE",
  BEBIDA: "BEBIDA",
} as const;
