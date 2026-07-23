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
    doc.text("TiendaOnline - Factura de Compra", 14, 22);

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

    // Generación de tabla segura usando la función importada autoTable
    autoTable(doc, {
      startY: 50,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [37, 99, 235] },
    });

    // Obtenemos la última posición Y de la tabla de forma segura
    const finalY = (doc as any).lastAutoTable?.finalY || 60;
    doc.setFontSize(12);
    doc.setTextColor(17, 24, 39);
    doc.text(`Total Pagado: $${total.toFixed(2)}`, 14, finalY + 15);

    doc.save(`Factura_TiendaOnline_${Date.now()}.pdf`);
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error("Inicia sesión para completar tu compra.");
      router.push("/login");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Tu carrito está vacío.");
      return;
    }

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
    <main className="max-w-4xl mx-auto p-6 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-gray-900">Tu Carrito de Compras</h1>
        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            className="text-sm font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition"
          >
            Vaciar Carrito 🗑️
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-gray-100">
          <p className="text-gray-500 mb-4">Tu carrito está vacío.</p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
          >
            Volver al catálogo
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="divide-y divide-gray-100 mb-6">
            {cartItems.map((item, index) => (
              <div key={item.id ? `${item.id}-${index}` : index} className="py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg border border-gray-100 bg-gray-50" />
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm md:text-base">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
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
                <div className="flex items-center gap-4">
                  <span className="font-extrabold text-gray-900">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
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

          <div className="border-t border-gray-100 pt-4 flex justify-between items-center mb-6">
            <span className="text-lg font-bold text-gray-700">Total a pagar:</span>
            <span className="text-2xl font-black text-blue-600">${total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-sm disabled:opacity-50"
          >
            {loading ? "Generando factura y procesando..." : "Finalizar Compra y Descargar Factura"}
          </button>
        </div>
      )}
    </main>
  );
}