import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<
    "checking" | "online" | "offline"
  >("checking");

  const { login } = useAuth();

  // Función helper para fetch con timeout
  const fetchWithTimeout = async (
    url: string,
    options: RequestInit = {},
    timeout = 3000
  ) => {
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
  };

  // Verificar estado del backend al cargar
  useEffect(() => {
    const checkBackend = async () => {
      console.log("🔍 Verificando estado del backend...");

      try {
        // Primero intentar con el endpoint de auth/test
        const response = await fetchWithTimeout(
          "http://localhost:8080/api/auth/test",
          {
            method: "GET",
          },
          3000
        );

        console.log("📡 Respuesta de auth/test:", response.status);
        setBackendStatus(response.ok ? "online" : "offline");
        console.log("✅ Backend está:", response.ok ? "online" : "offline");
      } catch (error) {
        console.warn("❌ Backend no disponible:", error);
        setBackendStatus("offline");
      }
    };

    checkBackend();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("🔐 Intentando login con:", { username, password: "***" });

    try {
      await login(username, password);
      console.log("✅ Login exitoso");
    } catch (err) {
      console.error("❌ Error en login:", err);
      setError(err instanceof Error ? err.message : "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  // Solo llenar credenciales de admin
  const fillAdminCredentials = () => {
    setUsername("admin");
    setPassword("admin123");
  };

  const getStatusBadge = () => {
    if (backendStatus === "checking") {
      return (
        <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
          🔄 Verificando conexión...
        </div>
      );
    }

    if (backendStatus === "online") {
      return (
        <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
          ✅ Backend conectado
        </div>
      );
    }

    return (
      <div className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
        ⚠️ Modo desarrollo (sin backend)
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center text-4xl">
            🍽️
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Panel de Administración
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Acceso exclusivo para administradores
          </p>

          {/* Estado del backend */}
          <div className="mt-4 flex justify-center">{getStatusBadge()}</div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Usuario Administrador"
              />
            </div>
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                {error}
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verificando...
                </div>
              ) : (
                "Acceder al Panel"
              )}
            </button>
          </div>
        </form>

        {/* Solo credenciales de admin */}
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600 font-medium">
            Credenciales de prueba:
          </p>
          <button
            type="button"
            onClick={fillAdminCredentials}
            className="inline-flex items-center px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 text-sm font-medium rounded-lg transition-colors"
          >
            <span className="mr-2">🔑</span>
            Usar credenciales de admin
          </button>
          <p className="text-xs text-gray-500">
            Usuario: admin | Contraseña: admin123
          </p>
        </div>

        {/* Botón de debug */}
        <div className="text-center">
          <button
            type="button"
            onClick={async () => {
              console.log("🧪 Prueba directa de login...");
              try {
                const response = await fetch(
                  "http://localhost:8080/api/auth/login",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      username: "admin",
                      password: "admin123",
                    }),
                  }
                );
                const result = await response.json();
                console.log("🧪 Resultado de prueba:", result);
                alert(
                  `Status: ${response.status}, Resultado: ${JSON.stringify(
                    result
                  )}`
                );
              } catch (error) {
                console.error("🧪 Error en prueba:", error);
                alert(`Error: ${error}`);
              }
            }}
            className="text-xs text-gray-500 underline hover:text-gray-700"
          >
            🧪 Probar login directo
          </button>
        </div>

        {/* Mensaje de seguridad */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-blue-400">🔒</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Acceso Restringido
              </h3>
              <p className="mt-1 text-xs text-blue-700">
                Este panel está diseñado exclusivamente para administradores del
                restaurante. Solo usuarios con permisos administrativos pueden
                acceder.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
