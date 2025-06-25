
import React, { useState } from 'react';

import { useAuth } from './context/AuthContext';

import LoginPage from './pages/LoginPage';

import RegisterPage from './pages/RegisterPage';

import AppShell from './components/layout/AppShell';



// Placeholder para o conteúdo que irá dentro do AppShell

const MainContent = () => {

    return (

        <div>

            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

            <p className="mt-2 text-gray-600">Conteúdo principal da aplicação aqui.</p>

        </div>

    )

}



const App = () => {

    const { isAuthenticated } = useAuth();

    const [showLogin, setShowLogin] = useState(true);

    

    // Se o usuário estiver autenticado, renderiza o layout principal da aplicação

    if (isAuthenticated) {

        return (

            <AppShell>

                <MainContent />

            </AppShell>

        );

    }

    

    // Se não estiver autenticado, alterna entre as páginas de Login e Registro

    return showLogin 

        ? <LoginPage onSwitchToRegister={() => setShowLogin(false)} /> 

        : <RegisterPage onSwitchToLogin={() => setShowLogin(true)} />;

};



export default App;

