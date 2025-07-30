export interface Usuario {
  id: number;
  username: string;
  rol: "ADMIN" | "MESERO" | "CLIENTE";
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
  message: string;
}

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8080/api";

// Mock de usuarios para desarrollo
const MOCK_USUARIOS = [
  { id: 1, username: "admin", password: "admin123", rol: "ADMIN" as const },
  { id: 2, username: "test", password: "test123", rol: "ADMIN" as const },
];

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private usuario: Usuario | null = null;

  constructor() {
    this.token = localStorage.getItem("auth_token");
    const usuarioData = localStorage.getItem("auth_usuario");
    if (usuarioData) {
      this.usuario = JSON.parse(usuarioData);
    }
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Función helper para fetch con timeout usando AbortController
  private async fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeout = 3000
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // Verificar si el backend está disponible - SIMPLIFICADO
  private async isBackendAvailable(): Promise<boolean> {
    try {
      console.log("🔍 Verificando disponibilidad del backend...");
      const response = await this.fetchWithTimeout(
        `${API_BASE_URL}/auth/test`,
        { method: "GET" },
        2000
      );
      console.log("📡 Backend response status:", response.status);
      return response.ok;
    } catch (error) {
      console.warn("❌ Backend no disponible:", error);
      return false;
    }
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    console.log("🔐 === INICIO PROCESO LOGIN ===");
    console.log("👤 Usuario:", credentials.username);

    // SIMPLIFICAR: Siempre intentar backend primero
    try {
      console.log("🚀 Intentando login con backend...");
      return await this.loginWithBackend(credentials);
    } catch (backendError) {
      console.warn("❌ Backend falló, usando mock:", backendError);
      return await this.loginWithMock(credentials);
    }
  }

  private async loginWithBackend(
    credentials: LoginRequest
  ): Promise<LoginResponse> {
    console.log("🔐 Enviando credenciales al backend...");

    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      },
      5000
    );

    console.log(
      "📡 Status del servidor:",
      response.status,
      response.statusText
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error del servidor:", errorText);

      let errorMessage = "Error en el login";
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch (parseError) {
        errorMessage = `HTTP ${response.status}: ${errorText}`;
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("✅ Respuesta del backend:", data);

    // Adaptar la respuesta del backend al formato esperado
    const loginResponse: LoginResponse = {
      token: data.token || "no-token",
      usuario: {
        id: data.user?.id || 1,
        username: data.user?.username || credentials.username,
        rol: data.user?.rol || "ADMIN",
      },
      message: data.message || "Login exitoso",
    };

    // Guardar en localStorage
    this.token = loginResponse.token;
    this.usuario = loginResponse.usuario;
    localStorage.setItem("auth_token", loginResponse.token);
    localStorage.setItem("auth_usuario", JSON.stringify(loginResponse.usuario));

    console.log("✅ Login con backend exitoso");
    return loginResponse;
  }

  private async loginWithMock(
    credentials: LoginRequest
  ): Promise<LoginResponse> {
    console.log("🎭 Usando login mock...");

    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Buscar usuario en mock data
    const usuario = MOCK_USUARIOS.find(
      (u) =>
        u.username === credentials.username &&
        u.password === credentials.password
    );

    if (!usuario) {
      console.error("❌ Credenciales inválidas en mock");
      throw new Error("Credenciales inválidas");
    }

    // Generar token mock
    const token = `mock_token_${Date.now()}_${usuario.id}`;

    const usuarioSinPassword = {
      id: usuario.id,
      username: usuario.username,
      rol: usuario.rol,
    };

    // Guardar en memoria y localStorage
    this.token = token;
    this.usuario = usuarioSinPassword;

    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_usuario", JSON.stringify(usuarioSinPassword));

    console.log("✅ Login mock exitoso");

    return {
      token,
      usuario: usuarioSinPassword,
      message: "Login exitoso (modo desarrollo)",
    };
  }

  logout(): void {
    this.token = null;
    this.usuario = null;
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_usuario");
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.usuario;
  }

  isAdmin(): boolean {
    return this.usuario?.rol === "ADMIN";
  }

  getUsuario(): Usuario | null {
    return this.usuario;
  }

  getToken(): string | null {
    return this.token;
  }

  // Helper para hacer requests autenticados
  async authenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    console.log("🔐 Haciendo request autenticado a:", endpoint);

    if (!this.token) {
      throw new Error("No hay token de autenticación");
    }

    // Si es un token mock, usar datos mock
    if (this.token.startsWith("mock_token_")) {
      console.log("🎭 Usando mock request para:", endpoint);
      return this.mockRequest<T>(endpoint, options);
    }

    // Request real al backend
    console.log("🚀 Request real al backend:", `${API_BASE_URL}${endpoint}`);

    const response = await this.fetchWithTimeout(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
          ...options.headers,
        },
      },
      10000
    );

    if (response.status === 401) {
      console.warn("🔒 Sesión expirada, haciendo logout");
      this.logout();
      throw new Error("Sesión expirada");
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Mock para requests cuando no hay backend
  private async mockRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log(
      "🎭 Mock request para endpoint:",
      endpoint,
      "método:",
      options.method || "GET"
    );

    // Mock data para diferentes endpoints
    if (
      endpoint === "/usuarios" &&
      (!options.method || options.method === "GET")
    ) {
      const mockUsuarios = [
        { id: 1, username: "admin", rol: "ADMIN" },
        { id: 2, username: "mesero1", rol: "MESERO" },
        { id: 3, username: "test", rol: "ADMIN" },
      ];
      console.log("🎭 Devolviendo usuarios mock:", mockUsuarios);
      return mockUsuarios as unknown as T;
    }

    if (endpoint === "/usuarios" && options.method === "POST") {
      const body = JSON.parse(options.body as string);
      const newUser = {
        id: Date.now(),
        username: body.username,
        rol: body.rol,
      };
      console.log("🎭 Usuario creado (mock):", newUser);
      return newUser as T;
    }

    if (endpoint.startsWith("/usuarios/") && options.method === "DELETE") {
      console.log("🎭 Usuario eliminado (mock)");
      return {} as T;
    }

    if (endpoint === "/menu" && (!options.method || options.method === "GET")) {
      const mockMenu = [
        {
          id: 1,
          nombre: "Pizza Margherita",
          categoria: "PLATOS_PRINCIPALES",
          precio: 15.99,
        },
        { id: 2, nombre: "Ensalada César", categoria: "ENTRADAS", precio: 8.5 },
        { id: 3, nombre: "Tiramisu", categoria: "POSTRES", precio: 6.99 },
      ];
      console.log("🎭 Devolviendo menú mock:", mockMenu);
      return mockMenu as unknown as T;
    }

    if (
      endpoint === "/mesas" &&
      (!options.method || options.method === "GET")
    ) {
      const mockMesas = [
        { id: 1, numero: 1, estado: "LIBRE" },
        { id: 2, numero: 2, estado: "OCUPADA" },
        { id: 3, numero: 3, estado: "RESERVADA" },
      ];
      console.log("🎭 Devolviendo mesas mock:", mockMesas);
      return mockMesas as unknown as T;
    }

    // Para otros endpoints, retornar mock genérico
    console.log("🎭 Devolviendo respuesta mock genérica para:", endpoint);
    return {} as T;
  }
}

export const authService = AuthService.getInstance();
