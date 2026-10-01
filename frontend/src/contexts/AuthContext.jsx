import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { validarLogin } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [logado, setLogado] = useState(null);
    useEffect(() => {
        const verificar = async () => {
            const resultado = await validarLogin();
            setLogado(resultado);
            console.log(resultado);
        };

        verificar();

    }, []);

    return (
        <AuthContext.Provider value={{ logado, setLogado }} >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}