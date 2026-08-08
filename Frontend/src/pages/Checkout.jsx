import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import useApp from "../hooks/useApp";

export default function Checkout() {
  const { cartItems, createOrder, orderLoading } = useApp();
  const firedRef = useRef(false);

  // Create the order once — React 18 StrictMode double-mounts effects in dev,
  // which would otherwise fire createOrder twice (duplicate orders/popups).
  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    createOrder(cartItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mb-6">
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          className="text-brand-600 dark:text-brand-400 text-2xl"
        />
      </div>
      <h1 className="font-display text-2xl font-bold mb-2">
        Preparing secure checkout&hellip;
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {orderLoading
          ? "Connecting to the payment gateway&hellip;"
          : "Finalizing your order&hellip;"}
      </p>
    </div>
  );
}
