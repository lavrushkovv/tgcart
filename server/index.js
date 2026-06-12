const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { sendMessage, sendAdminNotification, isAdmin } = require("./utils/bot-methods");
const { getWelcomeMessage } = require("./const/messages");

dotenv.config();

const { PORT, CLIENT_APP_URL, ADMIN_PANEL_URL } = process.env;
const app = express();

app.use(express.json());
app.use(cors({ origin: CLIENT_APP_URL, optionsSuccessStatus: 200 }));

// Middleware для проверки прав администратора
const checkAdminAuth = (req, res, next) => {
  const authHeader = req.headers["x-telegram-auth"];
  
  if (!authHeader) {
    return res.status(401).json({ success: false, error: "Не авторизован" });
  }

  try {
    const authData = JSON.parse(authHeader);
    const userId = authData.user?.id || authData.user?.id;
    
    if (!userId || !isAdmin(userId)) {
      return res.status(403).json({ success: false, error: "Доступ запрещен" });
    }
    
    req.adminUser = {
      id: userId,
      username: authData.user?.username,
      firstName: authData.user?.first_name,
      lastName: authData.user?.last_name
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: "Ошибка аутентификации" });
  }
};

// Обработчик webhook от Telegram
app.post("/", async (req, res) => {
  try {
    console.log("webhook event", req.body);
    const { message } = req.body;

    if (message) {
      const { chat } = message;
      const body = {
        chat_id: chat.id,
        text: getWelcomeMessage({ name: chat.first_name }),
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "BUY NOW",
                web_app: {
                  url: CLIENT_APP_URL,
                },
              },
            ],
            [
              {
                text: "Admin Panel",
                web_app: {
                  url: ADMIN_PANEL_URL || "https://admin.tgcart.com",
                },
              },
            ],
          ],
        },
        parse_mode: "Markdown",
      };

      const response = await sendMessage({ body });
      console.log({ response });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.json({ success: false });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Путь к файлам данных
const dataDir = path.join(__dirname, "data");

// Функции для работы с JSON файлами
const readOrders = () => {
  try {
    const data = fs.readFileSync(path.join(dataDir, "orders.json"), "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeOrders = (orders) => {
  fs.writeFileSync(path.join(dataDir, "orders.json"), JSON.stringify(orders, null, 2));
};

const readProducts = () => {
  try {
    const data = fs.readFileSync(path.join(dataDir, "products.json"), "utf8");
    return JSON.parse(data);
  } catch (error) {
    return { products: [], total: 0, skip: 0, limit: 10 };
  }
};

const writeProducts = (productsData) => {
  fs.writeFileSync(path.join(dataDir, "products.json"), JSON.stringify(productsData, null, 2));
};

// Эндпоинт для уведомления администратора о заказе
app.post("/order-notification", async (req, res) => {
  try {
    const { product, count, total, userId, username } = req.body;
    
    const data = await sendAdminNotification({
      product,
      count,
      total,
      userId,
      username,
    });
    
    console.log("Уведомление администратору:", data);
    return res.json({ success: !!data.result });
  } catch (err) {
    console.error("Ошибка отправки уведомления:", err);
    return res.json({ success: false, error: err.message });
  }
});

// === АДМИН-ПАНЕЛЬ ЭНДПОЙНТЫ ===

// Логин администратора (проверка прав)
app.post("/admin/login", async (req, res) => {
  try {
    const { initData } = req.body;
    
    if (!initData) {
      return res.status(400).json({ success: false, error: "Отсутствуют данные для авторизации" });
    }

    const authData = JSON.parse(initData);
    const userId = authData.user?.id;

    if (!userId) {
      return res.status(400).json({ success: false, error: "Отсутствует ID пользователя" });
    }

    if (!isAdmin(userId)) {
      return res.status(403).json({ success: false, error: "Доступ запрещен" });
    }

    return res.json({ 
      success: true, 
      message: "Авторизация успешна",
      user: {
        id: userId,
        ...authData.user
      }
    });
  } catch (error) {
    console.error("Ошибка логина администратора:", error);
    return res.status(500).json({ success: false, error: "Ошибка авторизации" });
  }
});

// Получить все заказы
app.get("/api/orders", checkAdminAuth, (req, res) => {
  try {
    const orders = readOrders();
    return res.json({ 
      success: true, 
      data: orders,
      total: orders.length
    });
  } catch (error) {
    console.error("Ошибка получения заказов:", error);
    return res.status(500).json({ success: false, error: "Ошибка сервера" });
  }
});

// Обновить статус заказа
app.put("/api/orders/:id/status", checkAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const orders = readOrders();
    const orderIndex = orders.findIndex(o => o.id === id);
    
    if (orderIndex === -1) {
      return res.status(404).json({ success: false, error: "Заказ не найден" });
    }
    
    const validStatuses = ["new", "confirmed", "shipped", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: "Неверный статус" });
    }
    
    orders[orderIndex] = {
      ...orders[orderIndex],
      status,
      updatedAt: new Date().toISOString()
    };
    
    writeOrders(orders);
    
    return res.json({ 
      success: true, 
      data: orders[orderIndex],
      message: `Статус заказа обновлен на: ${status}`
    });
  } catch (error) {
    console.error("Ошибка обновления статуса заказа:", error);
    return res.status(500).json({ success: false, error: "Ошибка сервера" });
  }
});

// Получить все продукты
app.get("/api/products", checkAdminAuth, (req, res) => {
  try {
    const productsData = readProducts();
    return res.json({ 
      success: true, 
      data: productsData,
      total: productsData.total || productsData.products?.length || 0
    });
  } catch (error) {
    console.error("Ошибка получения продуктов:", error);
    return res.status(500).json({ success: false, error: "Ошибка сервера" });
  }
});

// Получить продукт по ID
app.get("/api/products/:id", checkAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const productsData = readProducts();
    const product = productsData.products?.find(p => p.id === parseInt(id));
    
    if (!product) {
      return res.status(404).json({ success: false, error: "Продукт не найден" });
    }
    
    return res.json({ success: true, data: product });
  } catch (error) {
    console.error("Ошибка получения продукта:", error);
    return res.status(500).json({ success: false, error: "Ошибка сервера" });
  }
});

// Добавить новый продукт
app.post("/api/products", checkAdminAuth, (req, res) => {
  try {
    const productData = req.body;
    
    const productsData = readProducts();
    
    const newProduct = {
      ...productData,
      id: productsData.products.length > 0 
        ? Math.max(...productsData.products.map(p => p.id)) + 1 
        : 1
    };
    
    productsData.products.push(newProduct);
    productsData.total = productsData.products.length;
    
    writeProducts(productsData);
    
    return res.status(201).json({ 
      success: true, 
      data: newProduct,
      message: "Продукт успешно добавлен"
    });
  } catch (error) {
    console.error("Ошибка добавления продукта:", error);
    return res.status(500).json({ success: false, error: "Ошибка сервера" });
  }
});

// Обновить продукт
app.put("/api/products/:id", checkAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const productData = req.body;
    
    const productsData = readProducts();
    const productIndex = productsData.products.findIndex(p => p.id === parseInt(id));
    
    if (productIndex === -1) {
      return res.status(404).json({ success: false, error: "Продукт не найден" });
    }
    
    productsData.products[productIndex] = {
      ...productsData.products[productIndex],
      ...productData,
      updatedAt: new Date().toISOString()
    };
    
    writeProducts(productsData);
    
    return res.json({ 
      success: true, 
      data: productsData.products[productIndex],
      message: "Продукт успешно обновлен"
    });
  } catch (error) {
    console.error("Ошибка обновления продукта:", error);
    return res.status(500).json({ success: false, error: "Ошибка сервера" });
  }
});

// Удалить продукт
app.delete("/api/products/:id", checkAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    
    const productsData = readProducts();
    const productIndex = productsData.products.findIndex(p => p.id === parseInt(id));
    
    if (productIndex === -1) {
      return res.status(404).json({ success: false, error: "Продукт не найден" });
    }
    
    productsData.products.splice(productIndex, 1);
    productsData.total = productsData.products.length;
    
    writeProducts(productsData);
    
    return res.json({ 
      success: true, 
      message: "Продукт успешно удален"
    });
  } catch (error) {
    console.error("Ошибка удаления продукта:", error);
    return res.status(500).json({ success: false, error: "Ошибка сервера" });
  }
});

// Старт сервера
app.listen(PORT || 5000, () => {
  console.log(`Server listening on port ${PORT || 5000}`);
});

module.exports = app;
