import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './index.css';

// Компоненты
import Login from './components/Login';
import AdminLayout from './components/AdminLayout';
import OrdersList from './components/OrdersList';
import ProductsList from './components/ProductsList';

function App() {
  const [isTelegramReady, setIsTelegramReady] = useState(false);

  useEffect(() => {
    // Проверяем, запущено ли приложение внутри Telegram
    if (window.Telegram?.WebApp) {
      // Инициализируем Telegram WebApp
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      setIsTelegramReady(true);
    }
  }, []);

  // Если не внутри Telegram, показываем сообщение
  if (!isTelegramReady && !window.Telegram?.WebApp?.initData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Telegram Admin Panel</h1>
          <p className="text-gray-600 mb-6">
            Это приложение доступно только внутри Telegram. Пожалуйста, откройте его через меню бота.
          </p>
          <a
            href={window.location.href.replace('admin', 'bot')}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Открыть в Telegram
          </a>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<OrdersList />} />
          <Route path="orders" element={<OrdersList />} />
          <Route path="products" element={<ProductsList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
