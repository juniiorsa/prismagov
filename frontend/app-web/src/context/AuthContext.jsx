
import React, { useState, useEffect, createContext, useContext } from 'react';



const AuthContext = createContext(null);



export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [token, setToken] = useState(() => localStorage.getItem('authToken'));

    const [loading, setLoading] = useState(true);



    useEffect(() => {

        const fetchUser = () => {

            if (token) {

                try {

                    const payload = JSON.parse(atob(token.split('.')[1]));

                    setUser({ id: payload.sub, name: payload.name, email: payload.email });

                } catch (error) {

                    console.error("Token inválido ou expirado:", error);

                    logout();

                }

            }

            setLoading(false);

        };

        fetchUser();

    }, [token]);



    const login = (newToken) => {

        localStorage.setItem('authToken', newToken);

        setToken(newToken);

    };



    const logout = () => {

        localStorage.removeItem('authToken');

        setToken(null);

        setUser(null);

    };



    const value = { user, token, login, logout, isAuthenticated: !!token };



    return (

        <AuthContext.Provider value={value}>

            {!loading && children}

        </AuthContext.Provider>

    );

};



export const useAuth = () => {

    return useContext(AuthContext);

};

