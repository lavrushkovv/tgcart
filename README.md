# TGCart Mini App

Telegram Mini App for e-commerce without Telegram Payments integration.

## [🥉 3rd prize winner of Telegram's mini app contest](https://contest.com/mini-apps/entry4446)

---

## Features

- 🛍️ Product catalog with categories
- 🔍 Product details with image carousel
- 📊 Quantity selector
- 💰 Discount calculation
- 📤 Share products to friends
- 📱 Native Telegram theme support
- ✨ Haptic feedback
- 📨 **New!** Order notifications to admin (no payment integration)

**Payment system removed** - Orders are sent to admin via Telegram message

---

## Installation


### Server

/server folder of this repo contains code for listening to webhook events (which you need to set using [setWebhooks](https://core.telegram.org/bots/webapps#launching-mini-apps-from-the-menu-button))


#### 1. go inside /server folder and create .env file

```
BOT_TOKEN=1341437044:AAEnJflnTJCaUWCkLv0oxip4pFNISMVpneX

CLIENT_APP_URL=https://tgcart-server.vercel.app
```

BOT_TOKEN - the unique token that is given [when your bot is created](https://core.telegram.org/bots/features#botfather), you can also get it from [botfather](https://t.me/botfather)

ADMIN_CHAT_ID - the chat ID where order notifications will be sent (get it from @userinfobot)

CLIENT_APP_URL - a url value where you going to deploy the client side of this repo (/client folder)


#### 2. Installing dependencies

run `npm install` inside the /server folder, this will install all the necessary packages


#### 3. Starting the application

run `npm run start` inside the /server folder, this will start the server in port 5000 ( you can also configure this by adding PORT variable in .env file)


### Client

/client folder of this repo contains a [react app](https://react.dev/) which will render the e-commerce mini app, it also uses the [Telegram web app API](https://core.telegram.org/bots/webapps#initializing-mini-apps) library (which brings the core APIs to interact with the Telegram bot and app) in client/index.html which will load the Telegram.WebApp module in window object 
```
 <script src="https://telegram.org/js/telegram-web-app.js"></script>
```

#### 1. go inside /client folder and create .env file

```
VITE_APP_BACKEND_URL=https://tgcart.vercel.app

VITE_APP_NAME=TGCart
```

VITE_APP_BACKEND_URL - url where your server is running (/server folder of this same repo) 

VITE_APP_NAME - name of your telegram mini app


#### 2. Installing dependencies

run `npm install` inside the /client folder, this will install all the necessary packages like react, tailwind, vite, etc


#### 3. Starting the application (dev mode)

run `npm run dev` inside the /client folder, this will start the dev server which is configured using vite js


## Live demo

live demo of this app can be found at https://t.me/tgcart_miniapp_bot, you can launch the mini app either by clicking the [Menu button](https://core.telegram.org/bots/webapps#launching-mini-apps-from-the-menu-button) or by sending any message to this bot like in this video



https://github.com/user-attachments/assets/1701c187-7865-4e70-a479-c225837c798e




client side is served from - https://tgcart.vercel.app

server side is server from - https://tgcart-server.vercel.app

---

## Admin Panel

Full-featured admin panel for managing products and orders.

### Features

- 📦 **Order Management** - View all orders, update status (new, confirmed, shipped, completed, cancelled)
- 🛍️ **Product Management** - Add, edit, delete products
- 🔐 **Telegram Authentication** - Secure login using Telegram Mini App
- 📱 **Native Telegram UI** - Consistent with Telegram design guidelines
- 🔄 **Real-time updates** - Changes are immediately reflected

### Setup

#### Server (for admin panel)

1. Add `ADMIN_PANEL_URL` to your `.env` file in the `server` folder:
```
ADMIN_PANEL_URL=https://your-admin-panel-url.com
```

2. The admin panel is served from `/admin-panel` folder

#### Admin Panel Client

1. Go to `/admin-panel` folder and create `.env.development` file:
```
VITE_APP_BACKEND_URL=http://localhost:5000
```

2. Install dependencies:
```
cd admin-panel
npm install
```

3. Start the admin panel (development mode):
```
npm run dev
```

4. Build for production:
```
npm run build
```

5. Deploy to your hosting (Vercel, Netlify, etc.)

### Usage

1. Open your Telegram bot
2. Click the menu button (or send any message)
3. Click "Admin Panel" button
4. Authenticate using your Telegram account (must match ADMIN_CHAT_ID)
5. Manage orders and products from the dashboard

### API Endpoints

All admin endpoints require `X-Telegram-Auth` header with Telegram Mini App init data.

- `POST /admin/login` - Authenticate admin
- `GET /api/orders` - Get all orders
- `PUT /api/orders/:id/status` - Update order status
- `GET /api/products` - Get all products
- `POST /api/products` - Add new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

---

## How to add custom order handling

Order notifications are automatically sent to admin via Telegram message when user confirms order.

The admin receives a formatted message with:
- Product title
- Quantity
- Price and discount
- User ID and username
- Total amount

If you want to customize this, modify:
1. `server/utils/bot-methods.js` - `sendAdminNotification` function
2. `client/src/components/Checkout.jsx` - order confirmation handler
3. `server/index.js` - `/order-notification` endpoint
