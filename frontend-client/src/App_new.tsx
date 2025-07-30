import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { CartProvider } from "./contexts/CartContext";
import Layout from "./components/layout/Layout";
import LoadingSpinner from "./components/common/LoadingSpinner";
import ErrorBoundary from "./components/common/ErrorBoundary";

// Importar páginas desde el índice centralizado
import {
  HomePage,
  MenuPage,
  MesasPage,
  CartPage,
  CheckoutPage,
  TrackingPage,
  ProfilePage,
  OrderHistoryPage,
  NotFoundPage,
} from "./pages";

// Configuración optimizada de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-gray-50" data-testid="app">
              <Layout>
                <main role="main" className="flex-1">
                  <React.Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                      {/* Ruta principal */}
                      <Route path="/" element={<HomePage />} />

                      {/* Selección de mesa */}
                      <Route path="/mesas" element={<MesasPage />} />

                      {/* Menú del restaurante */}
                      <Route path="/menu" element={<MenuPage />} />
                      <Route path="/menu/:categoria" element={<MenuPage />} />

                      {/* Carrito de compras */}
                      <Route path="/cart" element={<CartPage />} />

                      {/* Proceso de checkout */}
                      <Route path="/checkout" element={<CheckoutPage />} />

                      {/* Seguimiento de pedidos */}
                      <Route path="/orders" element={<OrderHistoryPage />} />
                      <Route
                        path="/orders/:orderId"
                        element={<TrackingPage />}
                      />
                      <Route
                        path="/tracking/:orderId"
                        element={<TrackingPage />}
                      />

                      {/* Perfil del cliente */}
                      <Route path="/profile" element={<ProfilePage />} />

                      {/* Redirecciones para compatibilidad */}
                      <Route
                        path="/home"
                        element={<Navigate to="/" replace />}
                      />
                      <Route
                        path="/inicio"
                        element={<Navigate to="/" replace />}
                      />
                      <Route
                        path="/pedidos"
                        element={<Navigate to="/orders" replace />}
                      />

                      {/* Página 404 */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </React.Suspense>
                </main>
              </Layout>
            </div>
          </Router>
        </CartProvider>

        {/* React Query Devtools solo en desarrollo */}
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
