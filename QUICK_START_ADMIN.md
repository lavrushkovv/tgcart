# 🚀 Быстрый старт Admin Panel

## Установка и запуск

### 1. Установите зависимости для сервера

```bash
cd server
npm install
```

### 2. Создайте .env файл в папке server

```bash
cd server
nano .env  # или используйте любой другой редактор
```

Добавьте следующие строки (замените значения на свои):

```
BOT_TOKEN=1341437044:AAEnJflnTJCaUWCkLv0oxip4pFNISMVpneX
CLIENT_APP_URL=https://tgcart.vercel.app
ADMIN_CHAT_ID=123456789
ADMIN_PANEL_URL=http://localhost:5173
PORT=5000
```

**Где взять значения:**
- `BOT_TOKEN` - токен вашего Telegram бота (получите у @BotFather)
- `ADMIN_CHAT_ID` - ваш Telegram ID (получите у @userinfobot)
- `CLIENT_APP_URL` - URL вашего клиентского приложения
- `ADMIN_PANEL_URL` - URL админ-панели (для разработки: http://localhost:5173)

### 3. Запустите сервер

```bash
cd server
npm run start
```

Сервер должен запуститься на порту 5000.

### 4. Установите зависимости для админ-панели

```bash
cd admin-panel
npm install
```

### 5. Запустите админ-панель (development mode)

```bash
cd admin-panel
npm run dev
```

Панель будет доступна на http://localhost:5173

### 6. Откройте бота и нажмите кнопку "Admin Panel"

1. Откройте Telegram
2. Найдите вашего бота
3. Нажмите на кнопку меню (или отправьте любое сообщение)
4. Нажмите кнопку "Admin Panel"
5. Вы автоматически авторизуетесь как администратор

---

## Возможные проблемы и решения

### Проблема: "ADMIN_CHAT_ID не настроен"

**Решение:** Убедитесь, что переменная `ADMIN_CHAT_ID` установлена в `.env` файле server.

### Проблема: "Доступ запрещен"

**Решение:** 
1. Проверьте, что ваш Telegram ID совпадает с `ADMIN_CHAT_ID`
2. Получите свой ID у @userinfobot
3. Убедитесь, что вы начали диалог с ботом

### Проблема: "Сервер не запускается"

**Решение:**
1. Проверьте, что все зависимости установлены: `npm install`
2. Проверьте логи на ошибки
3. Убедитесь, что порт 5000 не занят другим процессом

### Проблема: "Cannot find module"

**Решение:**
```bash
cd admin-panel
npm install react-router-dom
npm install -D @tailwindcss/postcss
```

---

## Дополнительные команды

### Запуск сервера в режиме разработки с автоматической перезагрузкой

```bash
cd server
npx nodemon index.js
```

### Запуск админ-панели с HTTPS (для Telegram WebApp)

```bash
cd admin-panel
npm run dev -- --https
```

### Сборка для продакшена

```bash
cd admin-panel
npm run build
```

---

## Тестирование API

### Проверка сервера

```bash
curl http://localhost:5000/health
```

Ожидаемый ответ:
```json
{"status":"ok"}
```

### Получение заказов (с заголовком авторизации)

```bash
curl -H "X-Telegram-Auth: {\"user\":{\"id\":123456789}}" http://localhost:5000/api/orders
```

---

## Файлы проекта

```
tgcart/
├── server/                 # Серверная часть
│   ├── index.js           # Основной файл сервера
│   ├── .env              # Переменные окружения
│   ├── data/             # Данные заказов и продуктов
│   │   ├── orders.json
│   │   └── products.json
│   └── utils/
│       └── bot-methods.js
│
├── admin-panel/          # Админ-панель
│   ├── src/
│   │   ├── components/   # React компоненты
│   │   ├── api/         # API запросы
│   │   ├── App.jsx      # Главный компонент
│   │   └── main.jsx
│   └── dist/            # Собранные файлы ( после npm run build )
│
└── client/               # Клиентское приложение
    └── src/
        └── components/   # Компоненты магазина
```

---

**Готово! Админ-панель успешно установлена и готова к работе.** 🎉
