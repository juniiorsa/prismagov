
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

