import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, updateOrderStatus } from '../api';

const statusColors = {
  new: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels = {
  new: 'Новый',
  confirmed: 'Подтвержден',
  shipped: 'Отправлен',
  completed: 'Завершен',
  cancelled: 'Отменен',
};

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      if (data.success) {
        setOrders(data.data || []);
      } else {
        setError(data.error || 'Ошибка загрузки заказов');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const data = await updateOrderStatus(orderId, newStatus);
      if (data.success) {
        // Обновляем список заказов
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId ? data.data : order
          )
        );
        // Сворачиваем детали заказа
        setExpandedOrder(null);
        Telegram.WebApp.showAlert(`Статус заказа обновлен: ${statusLabels[newStatus]}`);
      } else {
        setError(data.error || 'Ошибка обновления статуса');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusOptions = (currentStatus) => {
    const options = {
      new: ['confirmed', 'cancelled'],
      confirmed: ['shipped', 'cancelled'],
      shipped: ['completed', 'cancelled'],
      completed: [],
      cancelled: [],
    };
    return options[currentStatus] || [];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
        <button onClick={fetchOrders} className="ml-4 underline">
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Заказы
          <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {orders.length}
          </span>
        </h2>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-600">Нет заказов</h3>
          <p className="text-gray-500">Заказы будут отображаться здесь</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header с информацией о заказе */}
              <div
                className="p-4 cursor-pointer"
                onClick={() =>
                  setExpandedOrder(expandedOrder === order.id ? null : order.id)
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-gray-700">
                          {order.id}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${statusColors[order.status] || statusColors.new}`}
                        >
                          {statusLabels[order.status] || order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Покупатель: {order.username || `@user_${order.userId}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString('ru-RU', {
                          date: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-800">
                      ${order.total}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.count} шт.
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center space-x-2 text-sm text-gray-600">
                  <span className="material-symbols-outlined text-sm">shopping_cart</span>
                  <span>{order.product?.title || 'Товар'}</span>
                </div>
              </div>

              {/* Детальная информация */}
              {expandedOrder === order.id && (
                <div className="border-t bg-gray-50 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Детали заказа</h4>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Товар:</span> {order.product?.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Цена:</span> ${order.product?.price}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Скидка:</span> {Math.ceil(order.product?.discountPercentage)}%
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Количество:</span> {order.count}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Итого:</span> ${order.total}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">ID пользователя:</span> {order.userId}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Изменить статус</h4>
                      <div className="space-y-2">
                        {getStatusOptions(order.status).map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(order.id, status)}
                            className="w-full py-2 px-3 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm"
                          >
                            {statusLabels[status] || status}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setExpandedOrder(null)}
                        className="mt-3 w-full py-2 px-3 bg-gray-200 rounded hover:bg-gray-300 transition-colors text-sm"
                      >
                        Свернуть
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
