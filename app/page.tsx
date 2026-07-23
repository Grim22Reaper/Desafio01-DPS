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
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isReady, setIsReady] = useState(false);
  
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    setIsReady(true);
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const items = JSON.parse(savedCart);
      const totalCount = items.reduce((acc: number, item: any) => acc + item.quantity, 0);
      setCartCount(totalCount);
    }
  }, []);

  const categories = ["Todos", ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = selectedCategory === "Todos"
    ? products
    : products.filter((p) => p.category === selectedCategory);

  const handleQtyChange = (productId: number, delta: number) => {
    setQuantities(prev => {
      const current = prev[productId] || 1;
      const updated = current + delta;
      return { ...prev, [productId]: updated < 1 ? 1 : updated };
    });
  };

  const handleAddToCart = (product: any) => {
    if (!user) {
      toast.error("Debes iniciar sesión para agregar productos al carrito.");
      router.push("/login");
      return;
    }

    const qtyToAdd = quantities[product.id] || 1;
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const productIndex = existingCart.findIndex((item: any) => item.id === product.id);

    if (productIndex > -1) {
      existingCart[productIndex].quantity += qtyToAdd;
    } else {
      existingCart.push({ ...product, quantity: qtyToAdd });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    
    const totalCount = existingCart.reduce((acc: number, item: any) => acc + item.quantity, 0);
    setCartCount(totalCount);

    toast.success(`¡Agregado ${qtyToAdd}x ${product.name} al carrito!`);
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
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black text-black">E-commerce</span>
        </div>

        <div className="flex items-center gap-4">
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
                    Carrito 
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

      <main className="max-w-6xl w-full mx-auto p-6 flex-1">
        <div className="text-center my-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Catálogo de Productos</h1>
          <p className="text-gray-500 text-sm mt-2">
            Explora nuestros equipos y accesorios disponibles. Inicia sesión para realizar tus compras.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition shadow-sm ${
                selectedCategory === category
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const currentQty = quantities[product.id] || 1;
            return (
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

                <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                      <button
                        onClick={() => handleQtyChange(product.id, -1)}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 font-bold transition"
                      >
                        -
                      </button>
                      <span className="px-3 text-sm font-bold text-gray-800">{currentQty}</span>
                      <button
                        onClick={() => handleQtyChange(product.id, 1)}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 font-bold transition"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-gray-900 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl transition shadow-sm text-sm"
                    >
                      Añadir
                    </button>
                  </div>

                  <button
                    onClick={() => router.push("/cart")}
                    className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold py-2 rounded-xl transition text-xs flex items-center justify-center gap-1.5"
                  >
                    Ver Carrito 🛒 {cartCount > 0 && `(${cartCount})`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-gray-400 border-t border-gray-200 bg-white">
        &copy; 2026 E-commerce. Todos los derechos reservados.
      </footer>
    </div>
  );
}