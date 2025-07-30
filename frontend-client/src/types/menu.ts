import { MenuItem } from "./index";

export interface MenuItemFilters {
  categoria?: string;
  precio_min?: number;
  precio_max?: number;
  vegetariano?: boolean;
  disponible?: boolean;
  search?: string;
}

export interface MenuResponse {
  items: MenuItem[];
  total: number;
  categories: string[];
  filters: MenuItemFilters;
}

export interface MenuState {
  items: MenuItem[];
  loading: boolean;
  error: string | null;
  filters: MenuItemFilters;
  categories: string[];
}

// Export MenuItem for use in other files
export type { MenuItem };
