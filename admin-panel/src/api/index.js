const API_URL = import.meta.env.VITE_APP_BACKEND_URL || "http://localhost:5000";

// Аутентификация администратора
export const loginAdmin = async (initData) => {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ initData }),
  });
  return await response.json();
};

// Получить все заказы
export const getOrders = async () => {
  const response = await fetch(`${API_URL}/api/orders`, {
    headers: {
      "X-Telegram-Auth": JSON.stringify(Telegram.WebApp.initData),
    },
  });
  return await response.json();
};

// Обновить статус заказа
export const updateOrderStatus = async (orderId, status) => {
  const response = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Telegram-Auth": JSON.stringify(Telegram.WebApp.initData),
    },
    body: JSON.stringify({ status }),
  });
  return await response.json();
};

// Получить все продукты
export const getProducts = async () => {
  const response = await fetch(`${API_URL}/api/products`, {
    headers: {
      "X-Telegram-Auth": JSON.stringify(Telegram.WebApp.initData),
    },
  });
  return await response.json();
};

// Получить продукт по ID
export const getProduct = async (id) => {
  const response = await fetch(`${API_URL}/api/products/${id}`, {
    headers: {
      "X-Telegram-Auth": JSON.stringify(Telegram.WebApp.initData),
    },
  });
  return await response.json();
};

// Добавить новый продукт
export const addProduct = async (productData) => {
  const response = await fetch(`${API_URL}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Telegram-Auth": JSON.stringify(Telegram.WebApp.initData),
    },
    body: JSON.stringify(productData),
  });
  return await response.json();
};

// Обновить продукт
export const updateProduct = async (id, productData) => {
  const response = await fetch(`${API_URL}/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Telegram-Auth": JSON.stringify(Telegram.WebApp.initData),
    },
    body: JSON.stringify(productData),
  });
  return await response.json();
};

// Удалить продукт
export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/api/products/${id}`, {
    method: "DELETE",
    headers: {
      "X-Telegram-Auth": JSON.stringify(Telegram.WebApp.initData),
    },
  });
  return await response.json();
};
