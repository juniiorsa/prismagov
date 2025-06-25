
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

