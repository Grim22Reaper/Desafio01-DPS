"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login, register } = useAuth();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || (isRegistering && !name)) {
        toast.error("Por favor completa todos los campos");
        return;
    }

    if (isRegistering) {
        const success = register(name, email, password);
        if (success) {
        toast.success("¡Cuenta creada con éxito!");
        router.push("/");
        } else {
        toast.error("Este correo ya está registrado.");
        }
    } else {
        const success = login(email, password);
        if (success) {
        toast.success("¡Bienvenido de vuelta!");
        router.push("/");
        } else {
        toast.error("El correo o la contraseña son incorrectos.");
        }
    }
    };

    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
            {isRegistering ? "Crear Cuenta" : "Iniciar Sesión"}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
                {isRegistering
                ? "Regístrate para comenzar"
                : "Ingresa tus credenciales para continuar"}
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
            {isRegistering && (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
                </label>
                <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                placeholder="Tu nombre"
                />
            </div>
            )}

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
            </label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                placeholder="tu@correo.com"
            />
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
            </label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                placeholder="••••••••"
            />
            </div>

            <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md"
            >
            {isRegistering ? "Registrarse" : "Entrar"}
            </button>
        </form>

        <div className="text-center mt-6">
            <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-blue-600 hover:underline font-medium"
            >
            {isRegistering
                ? "¿Ya tienes una cuenta? Inicia sesión"
                : "¿No tienes cuenta? Regístrate"}
            </button>
        </div>
        </div>
    </div>
    );
}