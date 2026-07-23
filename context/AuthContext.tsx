"use client";

import React, { createContext, useContext, useState} from "react";
import { User } from "@/types";

interface AuthContextType {
    user: User | null;
    register: (name: string, email: string, password: string) => boolean;
    login: (email: string, password: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicializamos el estado leyendo localStorage de forma perezosa (lazy initial state)
    const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
        try {
        return JSON.parse(storedUser);
        } catch (e) {
        console.error(e);
        return null;
        }
    }
    return null;
    });

    const register = (name: string, email: string, password: string): boolean => {
    const existingUsers = JSON.parse(localStorage.getItem("registered_users") || "[]");
    
    const userExists = existingUsers.some((u: User) => u.email === email);
    if (userExists) {
        return false;
    }

    const newUser = { name, email, password };
    existingUsers.push(newUser);
    localStorage.setItem("registered_users", JSON.stringify(existingUsers));
    
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    return true;
    };

const login = (email: string, password: string): boolean => {
    try {
        const storedUsers = localStorage.getItem("registered_users");
        console.log("Usuarios en localStorage:", storedUsers);
    
        if (!storedUsers) return false;

        const existingUsers = JSON.parse(storedUsers);
        console.log("Intentando loguear con - Correo:", email, "Password:", password);

        const foundUser = existingUsers.find(
        (u: { email: string; password: string }) => 
            u.email.trim().toLowerCase() === email.trim().toLowerCase() && 
            u.password === password
        );

        console.log("Usuario encontrado:", foundUser);

        if (foundUser) {
        setUser(foundUser);
        localStorage.setItem("user", JSON.stringify(foundUser));
        return true;
        }
    } catch (e) {
        console.error("Error en login:", e);
    }

    return false;
    };

    const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    };

    return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
        {children}
    </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
    return context;
};