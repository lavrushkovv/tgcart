const fetch = require("node-fetch");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

const { BOT_TOKEN, ADMIN_CHAT_ID } = process.env;

const BOT_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

const postFetch = async ({ url, body }) => {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};

const sendMessage = async ({ body }) => {
  const data = await postFetch({
    url: `${BOT_API_URL}/sendMessage`,
    body,
  });
  return data;
};

const sendAdminNotification = async ({ product, count, total, userId, username }) => {
  if (!ADMIN_CHAT_ID) {
    console.warn("ADMIN_CHAT_ID не настроен, уведомление не отправлено");
    return { success: false };
  }

  const message = `🛒 Новый заказ!\n\n` +
    `👤 Пользователь: ${username || `@username_${userId}`}\n` +
    `🆔 ID: ${userId}\n\n` +
    `📦 Товар: ${product.title}\n` +
    `💰 Цена: $${product.price} (${Math.ceil(product.discountPercentage)}% скидка)\n` +
    `🔢 Количество: ${count}\n` +
    `📊 Итого: $${total}\n\n` +
    `⏳ Статус: Новый заказ (нужно связаться с покупателем)`;

  const body = {
    chat_id: ADMIN_CHAT_ID,
    text: message,
    parse_mode: "Markdown",
  };

  const data = await postFetch({
    url: `${BOT_API_URL}/sendMessage`,
    body,
  });
  return data;
};

const checkAdminAccess = async (initData) => {
  if (!ADMIN_CHAT_ID) {
    return { allowed: false, error: "ADMIN_CHAT_ID не настроен" };
  }

  try {
    const response = await fetch(`${BOT_API_URL}/getChatMember?chat_id=${ADMIN_CHAT_ID}&user_id=${ADMIN_CHAT_ID}`);
    const data = await response.json();
    
    if (!data.ok) {
      return { allowed: false, error: "Не удалось проверить доступ администратора" };
    }

    return { allowed: true };
  } catch (error) {
    return { allowed: false, error: error.message };
  }
};

const isAdmin = (userId) => {
  return userId.toString() === ADMIN_CHAT_ID.toString();
};

module.exports = {
  sendMessage,
  sendAdminNotification,
  checkAdminAccess,
  isAdmin,
};
