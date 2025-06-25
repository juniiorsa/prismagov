// src/App.tsx
import { useState, FC } from 'react';

// --- Tipos para nossos dados e props ---
interface User {
  name: string;
}

interface LoginPageProps {
  onLogin: () => void;
}

interface AppShellProps {
  user: User;
  onLogout: () => void;
}

// --- Componentes Placeholder ---
const HomePage: FC = () => (
  <div className="p-8"><h1 className="text-4xl font-bold">Página Principal (Home)</h1></div>
);

const LoginPage: FC<LoginPageProps> = ({ onLogin }) => (
  <div className="p-8">
    <h1 className="text-4xl font-bold">Página de Login</h1>
    <button onClick={onLogin} className="mt-4 px-4 py-2 bg-azul-eletrico text-white rounded-lg">Simular Login</button>
  </div>
);

const AppShell: FC<AppShellProps> = ({ user, onLogout }) => (
  <div className="p-8">
    <h1 className="text-4xl font-bold">Área Logada (Dashboard)</h1>
    <p className="mt-2">Bem-vindo(a), {user.name}!</p>
    <button onClick={onLogout} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg">Sair</button>
  </div>
);

// --- Componente Principal ---
function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('home');

  const handleLogin = () => setUser({ name: 'Gestor Público' });
  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  if (user) {
    return <AppShell user={user} onLogout={handleLogout} />;
  }

  const renderMarketingPage = () => {
    switch (currentPage) {
      case 'login': return <LoginPage onLogin={handleLogin} />;
      case 'home': default: return <HomePage />;
    }
  };

  return (
    <div className="font-sans antialiased bg-cinza-claro min-h-screen">
      <header className="p-4 bg-white shadow-md">
        <nav className="container mx-auto flex justify-between items-center">
          <span className="font-bold text-2xl cursor-pointer" onClick={() => setCurrentPage('home')}>
            Prisma<span className="text-azul-eletrico">Gov</span>
          </span>
          <div>
            <button onClick={() => setCurrentPage('home')} className="mr-6 font-semibold text-gray-600 hover:text-azul-eletrico">Home</button>
            <button onClick={() => setCurrentPage('login')} className="font-semibold text-gray-600 hover:text-azul-eletrico">Acessar</button>
          </div>
        </nav>
      </header>
      <main>
        {renderMarketingPage()}
      </main>
    </div>
  );
}

export default App;