import { apiClient } from "../api";
import { MenuItem, Category } from "../types";

export class MenuService {
  private static instance: MenuService;

  public static getInstance(): MenuService {
    if (!MenuService.instance) {
      MenuService.instance = new MenuService();
    }
    return MenuService.instance;
  }

  async getMenuItems(): Promise<MenuItem[]> {
    try {
      const data = await apiClient.get<MenuItem[]>("/menu");

      // Asegurar que todos los items tengan las propiedades necesarias
      return data.map((item) => ({
        ...item,
        disponible: item.disponible ?? true,
        imagen: item.imagen || "/assets/images/default-dish.jpg",
        rating: item.rating || 4.5,
        vegetariano: item.vegetariano || false,
        picante: item.picante || false,
      }));
    } catch (error) {
      console.error("Error loading menu items:", error);
      throw new Error("No se pudo cargar el menú. Verifique su conexión.");
    }
  }

  async getMenuItemsByCategory(categoria: string): Promise<MenuItem[]> {
    try {
      const allItems = await this.getMenuItems();
      return allItems.filter(
        (item) =>
          item.categoria.toLowerCase() === categoria.toLowerCase() &&
          item.disponible
      );
    } catch (error) {
      console.error(
        `Error loading menu items for category ${categoria}:`,
        error
      );
      throw error;
    }
  }

  async searchMenuItems(query: string): Promise<MenuItem[]> {
    try {
      const allItems = await this.getMenuItems();
      const searchTerm = query.toLowerCase().trim();

      if (!searchTerm) return allItems;

      return allItems.filter(
        (item) =>
          item.disponible &&
          (item.nombre.toLowerCase().includes(searchTerm) ||
            item.descripcion?.toLowerCase().includes(searchTerm) ||
            item.categoria.toLowerCase().includes(searchTerm))
      );
    } catch (error) {
      console.error("Error searching menu items:", error);
      throw error;
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      const items = await this.getMenuItems();
      const categoriesMap = new Map<string, Category>();

      items.forEach((item) => {
        if (item.disponible && !categoriesMap.has(item.categoria)) {
          categoriesMap.set(item.categoria, {
            id: item.categoria.toLowerCase().replace(/\s+/g, "-"),
            nombre: item.categoria,
            descripcion: this.getCategoryDescription(item.categoria),
            cantidad_items: 0,
            imagen: this.getCategoryImage(item.categoria),
            icono: this.getCategoryIcon(item.categoria),
            activa: true,
          });
        }
      });

      // Contar items por categoría
      const categories = Array.from(categoriesMap.values());
      categories.forEach((category) => {
        category.cantidad_items = items.filter(
          (item) => item.categoria === category.nombre && item.disponible
        ).length;
      });

      return categories.filter((cat) => cat.cantidad_items > 0);
    } catch (error) {
      console.error("Error loading categories:", error);
      throw error;
    }
  }

  private getCategoryDescription(categoria: string): string {
    const descriptions: Record<string, string> = {
      ENTRADAS: "Deliciosos aperitivos para comenzar",
      PLATOS_PRINCIPALES: "Platos principales llenos de sabor",
      POSTRES: "Dulces tentaciones",
      BEBIDAS: "Refrescantes bebidas",
    };
    return descriptions[categoria] || "Deliciosos platos";
  }

  private getCategoryImage(categoria: string): string {
    const images: Record<string, string> = {
      ENTRADAS: "/assets/images/categories/entradas.jpg",
      PLATOS_PRINCIPALES: "/assets/images/categories/platos-principales.jpg",
      POSTRES: "/assets/images/categories/postres.jpg",
      BEBIDAS: "/assets/images/categories/bebidas.jpg",
    };
    return images[categoria] || "/assets/images/default-category.jpg";
  }

  private getCategoryIcon(categoria: string): string {
    const icons: Record<string, string> = {
      ENTRADAS: "",
      PLATOS_PRINCIPALES: "",
      POSTRES: "",
      BEBIDAS: "",
    };
    return icons[categoria] || "";
  }
}

export const menuService = MenuService.getInstance();
