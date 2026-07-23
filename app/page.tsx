"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { products } from "@/data/products";
import { toast } from "sonner";

export default function StoreHomePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  
  // Estado para controlar la renderización del cliente de forma fluida
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const handleAddToCart = (productName: string) => {
    if (!user) {
      toast.error("Debes iniciar sesión para agregar productos al carrito.");
      router.push("/login");
      return;
    }
    setCartCount((prev) => prev + 1);
    toast.success(`¡Agregado al carrito: ${productName}!`);
  };

  const handleAuthAction = () => {
    if (user) {
      logout();
      toast.info("Sesión cerrada correctamente.");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* Barra de navegación de la tienda */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black text-blue-600">TiendaOnline</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Si aún no está listo el cliente, mostramos un espacio estático neutral para evitar el choque de HTML */}
          {!isReady ? (
            <div className="h-9 w-28 bg-gray-100 animate-pulse rounded-lg" />
          ) : (
            <>
              {user && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 hidden sm:inline">
                    Hola, <b>{user.name}</b>
                  </span>
                  <button
                    onClick={() => router.push("/cart")}
                    className="relative bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Carrito 🛒
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </div>
              )}

              <button
                onClick={handleAuthAction}
                className={`text-sm font-semibold px-4 py-2 rounded-lg transition ${
                  user
                    ? "bg-red-50 hover:bg-red-100 text-red-600"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                }`}
              >
                {user ? "Cerrar Sesión" : "Iniciar Sesión"}
              </button>
            </>
          )}
        </div>
      </header>

      {/* Catálogo de la tienda */}
      <main className="max-w-6xl w-full mx-auto p-6 flex-1">
        <div className="text-center my-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Catálogo de Productos</h1>
          <p className="text-gray-500 text-sm mt-2">
            Explora nuestros equipos y accesorios disponibles. Inicia sesión para realizar tus compras.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="flex gap-4 items-start mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-xl border border-gray-100 bg-gray-50 shrink-0"
                  />
                  <div>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">
                      {product.category}
                    </span>
                    <h3 className="text-base font-bold text-gray-800 mt-1 leading-snug">{product.name}</h3>
                  </div>
                </div>

                <p className="text-xs text-gray-500 line-clamp-2 mb-4">{product.description}</p>
                <p className="text-xl font-extrabold text-gray-900">${product.price.toFixed(2)}</p>
              </div>

              <button
                onClick={() => handleAddToCart(product.name)}
                className="mt-6 w-full bg-gray-900 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-xl transition shadow-sm"
              >
                Agregar al Carrito
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Pie de página */}
      <footer className="text-center py-6 text-xs text-gray-400 border-t border-gray-200 bg-white">
        &copy; 2026 Tienda Online. Todos los derechos reservados.
      </footer>
    </div>
  );
}