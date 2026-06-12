# TGCart - Инструкция по проекту (обновленная)

## 📋 Общая информация

**TGCart** — это полноценное мини-приложение для Telegram (Telegram Mini App) с функционалом электронной коммерции.

**Проект-победитель:** 🥉 3-е место на конкурсе Telegram mini apps

**Важное изменение:** 🚫 Удалена интеграция с Telegram Payments. Приложение теперь работает как демонстрационный магазин с обработкой заказов "под ключ". Заказы автоматически отправляются администратору через Telegram сообщения.

---

## 📂 Дополнительные документы

- `ADMIN_SETUP.md` — Инструкция по настройке уведомлений администратору

## 🏗 Архитектура проекта

Проект состоит из двух основных частей:

```
tgcart/
├── server/          # Backend сервер (Express.js)
└── client/          # Frontend приложение (React + Vite)
```

### Стек технологий

#### Backend (Server)
- **Framework:** Express.js
- **Язык:** JavaScript (Node.js)
- **API:** Telegram Bot API
- **Деплой:** Vercel
- **Основные функции:**
  - Обработка webhook-событий от Telegram
  - Отправка сообщений через `sendMessage`
  - health check endpoint для мониторинга

#### Frontend (Client)
- **Framework:** React 18
- **Сборщик:** Vite
- **Роутинг:** React Router DOM v6
- **Стили:** Tailwind CSS
- **Язык:** JavaScript (JSX)
- **Основные функции:**
  - Отображение каталога товаров
  - Просмотр деталей товара
  - Корзина и оформление заказа
  - Интеграция с Telegram WebApp API

---

## 🔌 Основные компоненты системы

### 1. Backend (server/)

#### Основные файлы:
- `index.js` —主 серверный файл с Express
- `utils/bot-methods.js` — Вспомогательные функции для Telegram API
- `const/messages.js` — Шаблоны сообщений бота
- `vercel.json` — Конфигурация деплоя

#### API Endpoints:

**POST `/`** (webhook)
- Обрабатывает входящие сообщения от бота
- При получении сообщения отправляет приветственное сообщение с кнопкой "BUY NOW"
- Кнопка открывает клиентское приложение

**GET `/health`**
- Endpoint для проверки работоспособности сервера
- Возвращает статус `ok`

#### Переменные окружения (.env):
```env
PORT=5000                    # Порт сервера
BOT_TOKEN=...               # Токен вашего Telegram бота
ADMIN_CHAT_ID=...           # ID чата администратора (получить через @userinfobot)
CLIENT_APP_URL=...          # URL развертывания клиентского приложения
```

---

### 2. Frontend (client/)

#### Основные компоненты:

**Структура компонентов:**
```
src/
├── API/
│   ├── app-events.js      # Обработчики событий Telegram WebApp
│   └── products.js        # API для работы с товарами (DummyJSON)
├── components/
│   ├── Categories.jsx     # Фильтрация категорий
│   ├── Checkout.jsx       # Экран оформления заказа
│   ├── Products.jsx       # Главный экран с товарами
│   └── ProductView.jsx    # Детальный просмотр товара
├── hooks/
│   └── useProducts.js     # Хук для управления товарами
├── utils/
│   └── getFinalPrice.js   # Расчет итоговой цены со скидкой
└── App.jsx                # Основной компонент приложения
```

#### Основной функционал:

**Products.jsx (Главная страница)**
- Список товаров с фильтрацией по категориям
- Отображение цены, скидки, обложки товара
- Действия: "Купить", "Поделиться"
- Навигация к детальному просмотру

**ProductView.jsx (Детальный просмотр)**
- Карусель изображений товара
- Описание, цена, скидка
- Выбор количества
- Кнопка "Купить Now"
- Обработка BackButton Telegram

**Checkout.jsx (Оформление заказа)**
- Подтверждение заказа
- Итоговая сумма
- Сумма сэкономленных средств
- Главная кнопка для подтверждения заказа
- Показывает уведомление с данными заказа
- Закрывает приложение после подтверждения

#### Переменные окружения (.env):
```env
VITE_APP_BACKEND_URL=...    # URL вашего backend сервера
VITE_APP_NAME=TGCart        # Название приложения
```

---

## 🔁 Поток работы приложения (обновленный)

### Сценарий 1: Покупка товара

1. Пользователь открывает мини-приложение через кнопку Menu или сообщение бота
2. Отображается список товаров с категориями
3. Пользователь выбирает товар → переходит к детальному просмотру
4. Просматривает изображения, описание, выбирает количество
5. Нажимает "Buy Now" → открывается экран Checkout
6. Нажимает MainButton ("ОФОРМИТЬ ЗАКАЗ")
7. Уведомление администратору:
   - Отправляется сообщение в чат администратора с ID из `ADMIN_CHAT_ID`
   - Сообщение содержит: товар, количество, сумму, ID пользователя, username
8. Пользователь видит уведомление с данными заказа
9. Приложение закрывается после подтверждения

**Приходящее сообщение администратору:**
```
🛒 Новый заказ!

👤 Пользователь: @username
🆔 ID: 123456789

📦 Товар: iPhone 15
💰 Цена: $999 (15% скидка)
🔢 Количество: 2
📊 Итого: $1698.30

⏳ Статус: Новый заказ (нужно связаться с покупателем)
```

### Сценарий 2: Дележка товара

1. На главной странице нажимается "Share" (three dots → Share)
2. Открывается Telegram Share dialog с ссылкой на товар
3. Пользователь отправляет товар другу

---

## 🚀 Установка и запуск

### Backend

```bash
cd server
cp .env.sample .env  # Создайте .env файл и заполните данные
npm install
npm start             # Запуск на порту 5000
```

### Client

```bash
cd client
cp .env.sample .env  # Создайте .env файл и заполните данные
npm install
npm run dev          # Запуск dev-сервера на порту 5173
```

---

## 📱 Telegram Integration

### Инициализация Mini App

Приложение проверяет наличие `Telegram.WebApp.initData` и работает только внутри Telegram.

### Используемые API Telegram WebApp:

- `Telegram.WebApp.initData` — данные инициализации
- `Telegram.WebApp.HapticFeedback.impactOccurred()` — вибрация (light/medium/heavy)
- `Telegram.WebApp.BackButton` — кнопка "Назад"
- `Telegram.WebApp.MainButton` — главная кнопка снизу
- `Telegram.WebApp.openTelegramLink()` — открытие share dialog
- `Telegram.WebApp.onEvent()` — обработка событий
- `Telegram.WebApp.close()` — закрытие мини-приложения

### Удаленные API:

- ❌ `Telegram.WebApp.openInvoice()` — открытие платежной формы (удалено)

---

## 🛠 Ключевые особенности

### 1. Динамические стили через темы Telegram
```css
--tg-theme-button-color           # Цвет кнопок
--tg-theme-button-text-color      # Цвет текста кнопок
--tg-theme-secondary-bg-color     # Фон вторичных элементов
--tg-theme-hint-color             # Цвет подсказок
--tg-theme-link-color             # Цвет ссылок
--tg-theme-text-color             # Основной цвет текста
```

### 2. Управление состоянием
- Используется React useState для локального состояния
- Хук useProducts для управления товарами и категориями

### 3. Навигация
- React Router DOM для маршрутизации между страницами
- BackButton Telegram для нативной навигации

### 4. Оптимизация
- Хуки с условными эффектами
- Кэширование данных
- Использование DummyJSON API для товаров

---

## 🧪 Тестирование

Текущая версия проекта не содержит автоматических тестов.

**Ручное тестирование:**
1. Запустить backend и client
2. Открыть бота в Telegram
3. Проверить работу кнопок Menu и сообщений
4. Пройтись по всем этапам покупки товара
5. Проверить разные категории товаров
6. Проверить функцию шаринга
7. Проверить экран Checkout (теперь показывает уведомление)

---

## 📦 Управление зависимостями

### Backend (`server/package.json`)
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "node-fetch": "^2.7.0"
}
```

### Frontend (`client/package.json`)
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.16.0",
  "vite": "^4.4.5",
  "tailwindcss": "^3.3.3",
  "autoprefixer": "^10.4.16"
}
```

---

## 🌐 Развертывание

### Backend (Vercel)
- Деплоится из папки `server/`
- Настроен `vercel.json`
- Обрабатывает webhook от Telegram
- Endpoint `/health` для мониторинга

### Frontend (Vercel/Netlify/GitHub Pages)
- Деплоится из папки `client/`
- Build команда: `npm run build`
- Статические файлы размещаются на CDN

---

## 🔐 Безопасность

- Токены хранятся в `.env` файлах (не коммитятся в git)
- CORS настроен строго на CLIENT_APP_URL
- Все API вызовы идут напрямую в Telegram API
- Удалена зависимость от `PAYMENT_TOKEN` (не нужен платежный шлюз)

---

## 📝 Планы развития

- [ ] Добавление корзины (сохранение между сессиями)
- [ ] История заказов
- [ ] Редактирование профиля пользователя
- [ ] Интеграция с собственной CRM/базой товаров
- [ ] Поддержка нескольких валют
- [ ] Система скидок и промокодов
- [ ] Уведомления через Telegram
- [ ] Панель администратора
- [ ] **Обработка заказов через ваш собственный API** (вместо Telegram Payments)

---

## 🔧 Как добавить свою систему обработки заказов

Теперь, когда платежная интеграция Telegram Payments удалена, вы можете добавить свою собственную логику обработки заказов:

### Вариант 1: Отправка на ваш API
```javascript
// В Checkout.jsx
useEffect(() => {
  onMainButtonClick(async () => {
    Telegram.WebApp.HapticFeedback.impactOccurred("heavy");
    const body = {
      product: product.title,
      count: count,
      total: price,
      user_id: Telegram.WebApp.initDataUnsafe?.user?.id,
    };
    
    // Отправка на ваш API
    const response = await fetch('https://your-api.com/orders', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (response.ok) {
      alert("Заказ успешно оформлен!");
    }
    Telegram.WebApp.close();
  });
}, []);
```

### Вариант 2: Отправка в Telegram администратору
```javascript
useEffect(() => {
  onMainButtonClick(async () => {
    Telegram.WebApp.HapticFeedback.impactOccurred("heavy");
    const message = `Новый заказ!\n\nТовар: ${product.title}\nКоличество: ${count}\nСумма: $${price}`;
    
    // Отправка администратору
    await sendMessageToAdmin(message);
    Telegram.WebApp.close();
  });
}, []);
```

---

**Версия документа:** 2.0  
**Дата обновления:** 11 июня 2026  
**Проект:** TGCart Mini App  
**Изменения:** Удалена интеграция с Telegram Payments
