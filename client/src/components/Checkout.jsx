import { useEffect } from "react";
import getFinalPrice from "../utils/getFinalPrice";
import { onMainButtonClick } from "../API/app-events";

export default function Checkout({ product, count }) {
  const price = (getFinalPrice(product) * count).toFixed(2);
  const savedAmount = (product.price * count - price).toFixed(2);

  useEffect(() => {
    onMainButtonClick(async () => {
      Telegram.WebApp.HapticFeedback.impactOccurred("heavy");
      
      // Отправка уведомления администратору
      try {
        const userData = Telegram.WebApp.initDataUnsafe?.user;
        const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/order-notification`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product: {
              title: product.title,
              price: product.price,
              discountPercentage: product.discountPercentage,
            },
            count,
            total: price,
            userId: userData?.id,
            username: userData?.username,
          }),
        });
        
        if (response.ok) {
          console.log("Уведомление администратору отправлено");
        }
      } catch (error) {
        console.error("Ошибка отправки уведомления:", error);
      }
      
      alert(`Заказ на сумму $${price} оформлен!\n\nТовар: ${product.title}\nКоличество: ${count}\n\nАдминистратор получит уведомление и свяжется с вами.`);
      Telegram.WebApp.close();
    });
  }, [product, count]);

  return (
    <section className="p-4 gap-4 text-center">
      <div className="text-base font-medium">Оформление заказа</div>
      <img
        className=" w-40 h-40 block rounded object-cover m-auto my-4"
        src={product.thumbnail}
      />
      <div>{product.title}</div>
      <span className="text-sm text-[var(--tg-theme-hint-color)]">
        {count} шт.
      </span>

      <div className="my-2">
        <span className="font-medium">
          $ {price}
        </span>
        {savedAmount && (
          <div className="text-[var(--tg-theme-button-color)] text-xs p-1">
            Вы экономите ${savedAmount} на этом заказе!
          </div>
        )}
      </div>
      <p className="text-xs text-[var(--tg-theme-hint-color)] mt-2">
        Нажмите главную кнопку, чтобы подтвердить заказ
      </p>
    </section>
  );
}
