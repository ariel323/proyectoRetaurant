import React, { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import { useMesas } from "../../hooks/useMesas";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import EmptyCart from "./EmptyCart";
import Button from "../ui/Button";
import Modal from "../common/Modal";
import LoadingSpinner from "../common/LoadingSpinner";
import { Cliente } from "../../types";
import { cn } from "../../utils/cn";

export interface CartSidebarProps {
  className?: string;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ className }) => {
  const { isOpen, closeCart, items, total, cantidad_total, clearCart } =
    useCart();

  const { data: mesas, isLoading: loadingMesas } = useMesas({
    estado: "LIBRE",
  });
  const [selectedMesa, setSelectedMesa] = useState<number | null>(null);
  const [customerInfo, setCustomerInfo] = useState<Cliente>({
    nombre: "",
    telefono: "",
    email: "",
    notas: "",
  });
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  const handleCheckout = () => {
    if (items.length === 0) return;
    setShowCheckout(true);
  };

  const handleConfirmOrder = async () => {
    if (!selectedMesa || !customerInfo.nombre.trim()) return;

    try {
      setIsProcessingOrder(true);

      // TODO: Integrar con API de pedidos
      const orderData = {
        mesa_id: selectedMesa,
        cliente: customerInfo,
        items,
        total,
      };

      console.log("Creando pedido:", orderData);

      // Simular creación de pedido
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Limpiar y cerrar
      clearCart();
      setShowCheckout(false);
      setSelectedMesa(null);
      setCustomerInfo({ nombre: "", telefono: "", email: "", notas: "" });
      closeCart();

      // TODO: Mostrar notificación de éxito
      alert("¡Pedido creado exitosamente!");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Error al crear el pedido. Intenta de nuevo.");
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const resetForm = () => {
    setSelectedMesa(null);
    setCustomerInfo({ nombre: "", telefono: "", email: "", notas: "" });
    setShowCheckout(false);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl",
          "transform transition-transform duration-300 z-50 flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full",
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <h2 id="cart-title" className="text-lg font-semibold text-gray-900">
            🛒 Carrito {cantidad_total > 0 && `(${cantidad_total})`}
          </h2>
          <Button
            onClick={closeCart}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
            aria-label="Cerrar carrito"
          >
            ✕
          </Button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-hidden flex flex-col">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <EmptyCart onContinueShopping={closeCart} />
            </div>
          ) : (
            <>
              {/* Items list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} showNotes={true} />
                ))}
              </div>

              {/* Summary and actions */}
              <footer className="border-t border-gray-200 bg-gray-50">
                <CartSummary
                  showCheckoutButton
                  onCheckout={handleCheckout}
                  showClearButton
                  onClear={() => {
                    if (
                      window.confirm("¿Seguro que deseas vaciar el carrito?")
                    ) {
                      clearCart();
                    }
                  }}
                />
              </footer>
            </>
          )}
        </main>
      </aside>

      {/* Checkout Modal */}
      <Modal
        isOpen={showCheckout}
        onClose={resetForm}
        title="Finalizar Pedido"
        size="lg"
      >
        <div className="space-y-6">
          {/* Customer Information */}
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Información del Cliente
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="customer-name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nombre completo *
                </label>
                <input
                  id="customer-name"
                  type="text"
                  value={customerInfo.nombre}
                  onChange={(e) =>
                    setCustomerInfo((prev) => ({
                      ...prev,
                      nombre: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tu nombre completo"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="customer-phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Teléfono
                </label>
                <input
                  id="customer-phone"
                  type="tel"
                  value={customerInfo.telefono}
                  onChange={(e) =>
                    setCustomerInfo((prev) => ({
                      ...prev,
                      telefono: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="(123) 456-7890"
                />
              </div>

              <div>
                <label
                  htmlFor="customer-email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="customer-email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) =>
                    setCustomerInfo((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="customer-notes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Notas especiales
                </label>
                <textarea
                  id="customer-notes"
                  value={customerInfo.notas}
                  onChange={(e) =>
                    setCustomerInfo((prev) => ({
                      ...prev,
                      notas: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Alergias, preferencias especiales, etc."
                />
              </div>
            </div>
          </section>

          {/* Table Selection */}
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Seleccionar Mesa
            </h3>

            {loadingMesas ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="md" />
              </div>
            ) : !mesas || mesas.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-red-600 text-sm">
                  No hay mesas disponibles en este momento.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {mesas.map((mesa) => (
                  <button
                    key={mesa.id}
                    onClick={() => setSelectedMesa(mesa.id)}
                    className={cn(
                      "p-3 rounded-lg border-2 text-center transition-all duration-200",
                      "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                      selectedMesa === mesa.id
                        ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    )}
                    aria-pressed={selectedMesa === mesa.id}
                  >
                    <div className="text-sm font-medium">
                      Mesa {mesa.numero}
                    </div>
                    <div className="text-xs text-gray-500">
                      {mesa.ubicacion}
                    </div>
                    {mesa.capacidad && (
                      <div className="text-xs text-gray-400">
                        👥 {mesa.capacidad}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Order Summary */}
          <section className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">
              Resumen del Pedido
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>{cantidad_total}</span>
              </div>
              <div className="flex justify-between font-medium text-gray-900 pt-1 border-t border-gray-200">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={resetForm}
              variant="outline"
              size="md"
              className="flex-1"
              disabled={isProcessingOrder}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmOrder}
              variant="primary"
              size="md"
              className="flex-1"
              disabled={
                !selectedMesa ||
                !customerInfo.nombre.trim() ||
                isProcessingOrder
              }
              isLoading={isProcessingOrder}
            >
              Confirmar Pedido
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CartSidebar;
