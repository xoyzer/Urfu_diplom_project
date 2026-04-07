import { ShoppingCart, User, LogOut, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onNavigate: (page: string) => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <Package className="h-8 w-8 text-orange-600" />
            <h1 className="text-2xl font-bold text-gray-900">Фабрика Плитки</h1>
          </div>

          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => onNavigate('catalog')}
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Каталог
            </button>
            <button
              onClick={() => onNavigate('calculator')}
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Калькулятор
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              О компании
            </button>
            <button
              onClick={() => onNavigate('contacts')}
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Контакты
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button
                  onClick={() => onNavigate('admin')}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span>CRM</span>
                </button>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <User className="h-5 w-5" />
                <span>Вход</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
