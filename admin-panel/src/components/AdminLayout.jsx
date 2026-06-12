import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const [user, setUser] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Проверяем, авторизован ли пользователь
    if (!window.Telegram?.WebApp?.initData) {
      navigate('/login');
      return;
    }

    // Делаем приложение на весь экран
    Telegram.WebApp.expand();
    setIsExpanded(true);
  }, [navigate]);

  const handleLogout = () => {
    // Очищаем данные и возвращаемся к началу
    navigate('/login');
  };

  const menuItems = [
    { path: '/orders', label: '📦 Заказы', icon: 'shopping_cart' },
    { path: '/products', label: '🛍️ Продукты', icon: 'inventory' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="text-sm">
                  <p className="font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-blue-200">@{user.username}</p>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                title="Выйти"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-1">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="material-symbols-outlined mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2026 TGCart Admin Panel</p>
        </div>
      </footer>
    </div>
  );
}
