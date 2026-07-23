"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function CartPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const updateCart = (newItems: any[]) => {
    setCartItems(newItems);
    localStorage.setItem("cart", JSON.stringify(newItems));
    window.dispatchEvent(new Event("storage"));
  };

  const handleQuantityChange = (index: number, delta: number) => {
    const updated = [...cartItems];
    const newQty = (updated[index].quantity || 1) + delta;
    
    if (newQty <= 0) {
      removeItem(index);
      return;
    }

    updated[index].quantity = newQty;
    updateCart(updated);
  };

  const removeItem = (indexToRemove: number) => {
    const updated = cartItems.filter((_, index) => index !== indexToRemove);
    updateCart(updated);
    toast.info("Producto eliminado del carrito.");
  };

  const clearCart = () => {
    updateCart([]);
    toast.info("El carrito ha sido vaciado.");
  };

  const total = cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);

  const generatePDFInvoice = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235);
    doc.text("E-commerce - Factura de Compra", 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Cliente: ${user?.name || "Cliente"}`, 14, 36);
    doc.text(`Correo: ${user?.email || "No registrado"}`, 14, 42);

    const tableColumn = ["Producto", "Cantidad", "Precio Unitario", "Subtotal"];
    const tableRows = cartItems.map(item => [
      item.name || "Producto",
      item.quantity || 1,
      `$${(item.price || 0).toFixed(2)}`,
      `$${((item.price || 0) * (item.quantity || 1)).toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 50,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [37, 99, 235] },
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 60;
    doc.setFontSize(12);
    doc.setTextColor(17, 24, 39);
    doc.text(`Total Pagado: $${total.toFixed(2)}`, 14, finalY + 15);

    doc.save(`Factura_E-commerce_${Date.now()}.pdf`);
  };

  const handleProceedToPreview = () => {
    if (!user) {
      toast.error("Inicia sesión para completar tu compra.");
      router.push("/login");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Tu carrito está vacío.");
      return;
    }

    setShowPreview(true);
  };

  const handleConfirmAndDownload = () => {
    setLoading(true);
    try {
      generatePDFInvoice();
      clearCart();
      toast.success("¡Compra exitosa! Factura descargada y carrito vaciado.");
      setTimeout(() => router.push("/"), 2000);
    } catch (error) {
      console.error(error);
      toast.error("Error al procesar la compra o generar el PDF.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col justify-between">
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-black text-gray-900">E-commerce</h1>
        <button
          onClick={() => router.push("/")}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl transition"
        >
          ← Volver al Catálogo
        </button>
      </header>

      <main className="w-full flex-1 px-4 sm:px-8 py-8">
        {!showPreview ? (
          <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-black text-gray-900">Tu Carrito de Compras</h2>
              {cartItems.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-sm font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition"
                >
                  Vaciar Carrito 
                </button>
              )}
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4 text-base">Tu carrito está vacío.</p>
                <button
                  onClick={() => router.push("/")}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
                >
                  Explorar catálogo
                </button>
              </div>
            ) : (
              <>
                <div className="divide-y divide-gray-100 mb-6">
                  {cartItems.map((item, index) => (
                    <div key={item.id ? `${item.id}-${index}` : index} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl border border-gray-100 bg-gray-50 shrink-0" />
                        <div>
                          <h3 className="font-bold text-gray-800 text-base">{item.name}</h3>
                          <p className="text-xs text-gray-500 mb-1">Precio Unitario: ${Number(item.price || 0).toFixed(2)}</p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(index, -1)}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs font-bold transition"
                            >
                              -
                            </button>
                            <span className="text-xs font-semibold text-gray-700">Cant: {item.quantity || 1}</span>
                            <button
                              onClick={() => handleQuantityChange(index, 1)}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs font-bold transition"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                        <span className="font-extrabold text-gray-900 text-lg">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                        <button
                          onClick={() => removeItem(index)}
                          className="text-gray-400 hover:text-red-600 font-bold p-1 transition"
                          title="Eliminar producto"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-6 flex justify-between items-center mb-8">
                  <span className="text-xl font-bold text-gray-700">Total a pagar:</span>
                  <span className="text-3xl font-black text-blue-600">${total.toFixed(2)}</span>
                </div>

                <button
                  onClick={handleProceedToPreview}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition shadow-md text-base"
                >
                  Continuar a Vista Previa de Factura
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200 p-8">
            <div className="border-b border-gray-200 pb-6 mb-6 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-black text-blue-600">E-commerce</h2>
                <p className="text-xs text-gray-400 mt-1">Factura de Compra - Vista previa</p>
              </div>
              <div className="text-right text-sm text-gray-600">
                <p><b>Fecha:</b> {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-700 space-y-1">
              <p><b>Cliente:</b> {user?.name}</p>
              <p><b>Correo Electrónico:</b> {user?.email}</p>
            </div>

            <div className="overflow-x-auto mb-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-blue-600 text-white text-xs uppercase tracking-wider">
                    <th className="py-3 px-4 rounded-l-lg">Producto</th>
                    <th className="py-3 px-4 text-center">Cantidad</th>
                    <th className="py-3 px-4 text-right">Precio Unitario</th>
                    <th className="py-3 px-4 text-right rounded-r-lg">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {cartItems.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-3 px-4 font-medium text-gray-800">{item.name}</td>
                      <td className="py-3 px-4 text-center text-gray-600">{item.quantity}</td>
                      <td className="py-3 px-4 text-right text-gray-600">${(item.price || 0).toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-bold text-gray-900">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-200 pt-4 flex justify-between items-center mb-8">
              <span className="text-lg font-bold text-gray-700">Total a Pagar:</span>
              <span className="text-2xl font-black text-blue-600">${total.toFixed(2)}</span>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowPreview(false)}
                className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition text-sm"
              >
                Regresar al Carrito
              </button>
              <button
                onClick={handleConfirmAndDownload}
                disabled={loading}
                className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-md text-sm disabled:opacity-50"
              >
                {loading ? "Generando..." : "Confirmar y Descargar PDF"}
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center py-6 text-xs text-gray-400 border-t border-gray-200 bg-white w-full">
        &copy; 2026 E-commerce. Todos los derechos reservados.
      </footer>
    </div>
  );
}