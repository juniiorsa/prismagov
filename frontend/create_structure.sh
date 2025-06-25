#!/bin/bash



# ==============================================================================

# SCRIPT DE CRIAÇÃO E ATUALIZAÇÃO DO FRONTEND - PRISMAGOV (v2)

# ==============================================================================

#

#   O que há de novo na v2:

#   - Adiciona o "App Shell", o layout principal para usuários logados.

#   - Substitui a página de dashboard temporária pela estrutura real da aplicação.

#   - Organiza o layout em componentes (Sidebar, Header).

#   - Prepara o terreno para o roteamento e a exibição das páginas internas.

#

# ==============================================================================



# --- Configuração ---

BASE_DIR="app-web/src"



echo "🚀 Iniciando a atualização da estrutura do frontend para a v2 em '$BASE_DIR'..."

echo "    Esta versão irá implementar o layout principal da aplicação (App Shell)."



# --- 1. Criar Estrutura de Diretórios ---

echo "   - Garantindo a existência dos diretórios..."

mkdir -p "$BASE_DIR/api"

mkdir -p "$BASE_DIR/components/ui"

mkdir -p "$BASE_DIR/components/layout" # Diretório para o layout principal

mkdir -p "$BASE_DIR/context"

mkdir -p "$BASE_DIR/pages"





# --- 2. Criar/Atualizar Arquivos com Conteúdo ---



# API Client (sem alterações)

echo "   - Verificando api/client.js..."

cat <<'EOF' > "$BASE_DIR/api/client.js"

import axios from 'axios';



const api = axios.create({

    baseURL: 'http://localhost:3001/api/v1', // URL do seu backend NestJS

});



// Interceptor que adiciona o token de autenticação em cada requisição

api.interceptors.request.use(config => {

    const token = localStorage.getItem('authToken');

    if (token) {

        config.headers.Authorization = `Bearer ${token}`;

    }

    return config;

}, error => {

    return Promise.reject(error);

});



export default api;

EOF



# AuthContext (sem alterações)

echo "   - Verificando context/AuthContext.jsx..."

cat <<'EOF' > "$BASE_DIR/context/AuthContext.jsx"

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

EOF



# Página de Login (sem alterações)

echo "   - Verificando pages/LoginPage.jsx..."

cat <<'EOF' > "$BASE_DIR/pages/LoginPage.jsx"

import React, { useState } from 'react';

import api from '../api/client';

import { useAuth } from '../context/AuthContext';

import Notification from '../components/Notification';

import SpinnerIcon from '../components/ui/SpinnerIcon';

import Logo from '../components/ui/Logo';



const LoginPage = ({ onSwitchToRegister }) => {

    const { login } = useAuth();

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');

    const [error, setError] = useState(null);

    const [loading, setLoading] = useState(false);



    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        setError(null);

        try {

            const response = await api.post('/auth/login', { email, password });

            login(response.data.access_token);

        } catch (err) {

            setError(err.response?.data?.message || 'Erro ao tentar fazer login. Verifique suas credenciais.');

        }

        setLoading(false);

    };



    return (

        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">

            <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-xl w-full max-w-md">

                <div className="text-center mb-8"><Logo className="h-12 w-auto mx-auto" /><h1 className="text-3xl font-bold text-gray-800 mt-4">Acesse sua Conta</h1><p className="text-gray-500">Bem-vindo(a) de volta!</p></div>

                <Notification message={error} type="error" />

                <form onSubmit={handleSubmit}>

                    <div className="space-y-6">

                        <div><label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="seu.email@orgao.gov.br" required /></div>

                        <div><label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">Senha</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" required /></div>

                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg flex items-center justify-center transition hover:bg-blue-700 disabled:bg-blue-400">{loading ? <SpinnerIcon /> : 'Entrar'}</button>

                    </div>

                </form>

                <p className="text-center text-sm text-gray-600 mt-8">Não tem uma conta?{' '}<button onClick={onSwitchToRegister} className="font-semibold text-blue-600 hover:underline">Cadastre-se</button></p>

            </div>

        </div>

    );

};

export default LoginPage;

EOF



# Página de Registro (sem alterações)

echo "   - Verificando pages/RegisterPage.jsx..."

cat <<'EOF' > "$BASE_DIR/pages/RegisterPage.jsx"

import React, { useState } from 'react';

import api from '../api/client';

import Notification from '../components/Notification';

import SpinnerIcon from '../components/ui/SpinnerIcon';

import Logo from '../components/ui/Logo';



const RegisterPage = ({ onSwitchToLogin }) => {

    const [nome, setNome] = useState('');

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');

    const [error, setError] = useState(null);

    const [success, setSuccess] = useState(null);

    const [loading, setLoading] = useState(false);



    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        setError(null);

        setSuccess(null);

        try {

            await api.post('/auth/register', { nome, email, password });

            setSuccess('Cadastro realizado com sucesso! Você já pode fazer o login.');

            setNome(''); setEmail(''); setPassword('');

        } catch (err) {

            setError(err.response?.data?.message || 'Ocorreu um erro ao tentar se cadastrar.');

        }

        setLoading(false);

    };



    return (

        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">

            <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-xl w-full max-w-md">

                <div className="text-center mb-8"><Logo className="h-12 w-auto mx-auto" /><h1 className="text-3xl font-bold text-gray-800 mt-4">Crie sua Conta</h1><p className="text-gray-500">Comece a transformar a gestão pública.</p></div>

                <Notification message={error} type="error" />

                <Notification message={success} type="success" />

                <form onSubmit={handleSubmit}>

                    <div className="space-y-6">

                        <div><label className="block text-sm font-bold text-gray-700 mb-2">Nome Completo</label><input type="text" value={nome} onChange={e => setNome(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>

                        <div><label className="block text-sm font-bold text-gray-700 mb-2">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>

                        <div><label className="block text-sm font-bold text-gray-700 mb-2">Senha</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>

                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg flex items-center justify-center transition hover:bg-blue-700 disabled:bg-blue-400">{loading ? <SpinnerIcon /> : 'Cadastrar'}</button>

                    </div>

                </form>

                 <p className="text-center text-sm text-gray-600 mt-8">Já tem uma conta?{' '}<button onClick={onSwitchToLogin} className="font-semibold text-blue-600 hover:underline">Faça o login</button></p>

            </div>

        </div>

    );

};



export default RegisterPage;

EOF



# --- NOVOS ARQUIVOS DA V2 ---



# Componente Sidebar

echo "   - Criando components/layout/Sidebar.jsx..."

cat <<'EOF' > "$BASE_DIR/components/layout/Sidebar.jsx"

import React from 'react';

import Logo from '../ui/Logo';



const NavLink = ({ label, active = false, disabled = false }) => {

    const baseClasses = "flex items-center px-4 py-2.5 rounded-lg text-sm";

    const activeClasses = "bg-gray-200 text-gray-900 font-semibold";

    const inactiveClasses = "text-gray-600 hover:bg-gray-100";

    const disabledClasses = "text-gray-400 cursor-not-allowed";

    

    return (

        <a href="#" className={`${baseClasses} ${disabled ? disabledClasses : (active ? activeClasses : inactiveClasses)}`}>

            {/* Ícones podem ser adicionados aqui mais tarde */}

            <span>{label}</span>

            {disabled && <span className="text-xs ml-auto bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">Em Breve</span>}

        </a>

    )

}



const Sidebar = () => {

    return (

        <aside className="w-64 bg-white shadow-md flex flex-col flex-shrink-0">

            <div className="flex items-center justify-center p-6 border-b">

                 <Logo className="h-8" />

            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">

                <NavLink label="Início" active={true} />

                <NavLink label="Meus Documentos" />

                <NavLink label="Novo TR" />

                <NavLink label="ETP" disabled={true} />

                <NavLink label="DFD" disabled={true} />

            </nav>

            <div className="p-4 border-t">

                 <NavLink label="Configurações" />

                 <NavLink label="Suporte" />

            </div>

        </aside>

    );

};



export default Sidebar;

EOF



# Componente Header

echo "   - Criando components/layout/Header.jsx..."

cat <<'EOF' > "$BASE_DIR/components/layout/Header.jsx"

import React from 'react';

import { useAuth } from '../../context/AuthContext';



const Header = () => {

    const { user, logout } = useAuth();



    return (

        <header className="flex justify-between items-center p-4 bg-white border-b">

            <div className="font-semibold">

                Logado como: <span className="text-blue-600">{user?.name || 'Usuário'}</span>

            </div>

            <button 

                onClick={logout} 

                className="text-gray-500 hover:text-red-600 font-semibold flex items-center text-sm"

            >

                {/* Ícone de logout aqui */}

                <span className="ml-2">Sair</span>

            </button>

        </header>

    );

};



export default Header;

EOF



# Componente AppShell (Layout Principal)

echo "   - Criando components/layout/AppShell.jsx..."

cat <<'EOF' > "$BASE_DIR/components/layout/AppShell.jsx"

import React from 'react';

import Sidebar from './Sidebar';

import Header from './Header';



const AppShell = ({ children }) => {

    return (

        <div className="flex h-screen bg-gray-100 font-sans">

            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">

                <Header />

                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">

                    {/* O conteúdo da página ativa será renderizado aqui */}

                    {children}

                </main>

            </div>

        </div>

    );

};



export default AppShell;

EOF





# --- ARQUIVOS ATUALIZADOS ---



# App.jsx (Atualizado para usar o AppShell)

echo "   - ATUALIZANDO App.jsx..."

cat <<'EOF' > "$BASE_DIR/App.jsx"

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

EOF



# main.jsx (sem alterações, mas garantindo que esteja correto)

echo "   - Verificando main.jsx..."

cat <<'EOF' > "$BASE_DIR/main.jsx"

import React from 'react';

import ReactDOM from 'react-dom/client';

import App from './App';

import { AuthProvider } from './context/AuthContext';

import './index.css';



ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>

    <AuthProvider>

      <App />

    </AuthProvider>

  </React.StrictMode>,

);

EOF



# Removendo arquivos antigos se existirem para evitar confusão

rm -f "$BASE_DIR/pages/DashboardPage.jsx"

rm -f "$BASE_DIR/components/ui/SpinnerIcon.jsx"

rm -f "$BASE_DIR/components/ui/Logo.jsx"

rm -f "$BASE_DIR/components/Notification.jsx"

# Os componentes de UI serão recriados pelo script para garantir consistência.



echo "✅ Estrutura do frontend atualizada para a v2 com sucesso!"

echo "➡️  Próximo passo: rode 'npm install && npm run dev' dentro da pasta 'app-web'."

echo "    Você deverá ver a nova tela de login e, após logar, o layout principal com a barra lateral."

