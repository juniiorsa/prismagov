
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

