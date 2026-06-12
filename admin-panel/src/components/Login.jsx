import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Проверяем, запущено ли приложение внутри Telegram
    if (!window.Telegram?.WebApp?.initData) {
      // Если initData отсутствует, показываем сообщение
      return;
    }

    // Если initData есть, сразу пробуем авторизоваться
    handleLogin();
  }, []);

  const handleLogin = async () => {
    if (!window.Telegram?.WebApp?.initData) {
      setError("Telegram initData отсутствует. Запустите это приложение внутри Telegram.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ initData: window.Telegram.WebApp.initData }),
      });

      const data = await response.json();

      if (data.success) {
        // Успешная авторизация
        Telegram.WebApp.expand();
        navigate('/orders');
      } else {
        setError(data.error || "Ошибка авторизации");
        // Показываем пользователю
        Telegram.WebApp.showAlert(data.error || "Доступ запрещен");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Панель управления заказами и продуктами</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Проверка...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Войти как администратор
            </div>
          )}
        </button>

        <div className="mt-6 text-sm text-gray-500">
          <p>Доступ только для администратора</p>
        </div>
      </div>
    </div>
  );
}
