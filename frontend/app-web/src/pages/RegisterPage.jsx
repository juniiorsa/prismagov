
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

