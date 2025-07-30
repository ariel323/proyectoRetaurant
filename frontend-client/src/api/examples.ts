import { apiClient } from "./index";
import { interceptors } from "./interceptors";
import axios from "axios";

/**
 * Ejemplos de uso de los interceptores
 */

// 1. Uso básico - el cliente ya tiene interceptores configurados
export async function basicUsageExample() {
  try {
    // Estos requests automáticamente usan los interceptores configurados
    const menuItems = await apiClient.get("/menu");
    const mesas = await apiClient.get("/mesas");

    console.log("Menu items:", menuItems);
    console.log("Mesas:", mesas);
  } catch (error) {
    console.error("Error:", error);
  }
}

// 2. Configuración personalizada de interceptores
export function customInterceptorExample() {
  // Crear una nueva instancia de Axios
  const customClient = axios.create({
    baseURL: "http://localhost:8080/api",
    timeout: 5000,
  });

  // Configurar interceptores solo para logging básico
  interceptors.setupBasicLogging(customClient);

  return customClient;
}

// 3. Interceptores para un cliente específico de autenticación
export function authClientExample() {
  const authClient = axios.create({
    baseURL: "http://localhost:8080/api/auth",
    timeout: 10000,
  });

  // Configurar interceptores con autenticación habilitada
  interceptors.setupProduction(authClient);

  return authClient;
}

// 4. Ejemplo con manejo de errores específicos
export async function errorHandlingExample() {
  try {
    // Este request fallará y será manejado por los interceptores
    await apiClient.get("/non-existent-endpoint");
  } catch (error) {
    // El error ya estará tipado como ApiError gracias a los interceptores
    if (error instanceof Error) {
      console.error("Tipo de error:", (error as any).code);
      console.error("Mensaje:", error.message);
      console.error("Status:", (error as any).status);
    }
  }
}

// 5. Ejemplo con retry automático
export async function retryExample() {
  try {
    // Si este endpoint devuelve un error 500, se reintentará automáticamente
    const result = await apiClient.get("/endpoint-that-might-fail");
    return result;
  } catch (error) {
    console.error("Falló después de todos los reintentos:", error);
    throw error;
  }
}

// 6. Ejemplo de subida de archivos (si se necesita en el futuro)
export async function fileUploadExample(file: File) {
  try {
    const result = await apiClient.uploadFile("/upload/image", file, "image", {
      category: "menu",
      description: "Imagen del menú",
    });
    return result;
  } catch (error) {
    console.error("Error subiendo archivo:", error);
    throw error;
  }
}

// 7. Ejemplo de búsqueda con parámetros
export async function searchExample() {
  try {
    const results = await apiClient.search("/menu/search", {
      query: "pizza",
      category: "principal",
      vegetariano: true,
      precio_max: 25.0,
    });
    return results;
  } catch (error) {
    console.error("Error en búsqueda:", error);
    throw error;
  }
}

// 8. Ejemplo de paginación
export async function paginationExample() {
  try {
    const page1 = await apiClient.paginate("/menu", 1, 10, {
      categoria: "principal",
      disponible: true,
    });

    console.log("Página 1:", page1.data);
    console.log("Total items:", page1.meta?.total);
    console.log("Página actual:", page1.meta?.page);

    return page1;
  } catch (error) {
    console.error("Error en paginación:", error);
    throw error;
  }
}

// 9. Configuración dinámica de headers
export function dynamicHeadersExample() {
  // Configurar header global
  apiClient.setGlobalHeader("X-Custom-Header", "custom-value");

  // Hacer requests que incluirán el header
  apiClient.get("/menu").then((data) => {
    console.log("Request con header personalizado:", data);
  });

  // Remover header cuando ya no se necesite
  setTimeout(() => {
    apiClient.removeGlobalHeader("X-Custom-Header");
  }, 5000);
}

// 10. Monitoreo de performance
export async function performanceMonitoringExample() {
  console.time("API Request Time");

  try {
    const result = await apiClient.get("/menu");
    console.timeEnd("API Request Time");
    return result;
  } catch (error) {
    console.timeEnd("API Request Time");
    throw error;
  }
}
