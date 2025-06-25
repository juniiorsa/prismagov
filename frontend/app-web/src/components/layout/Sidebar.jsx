
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

