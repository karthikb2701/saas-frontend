import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Cart() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/cart").then((res) => {
      setItems(res.data.cart);
    });
  }, []);

  const total = items.reduce((sum, item) => sum + Number(item.total), 0);

  const placeOrder = async () => {
    const res = await api.post("/orders");
    navigate(`/payment/${res.data.order_id}`);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {items.length === 0 && <p className="text-gray-500">Cart is empty</p>}

      {items.map((item) => (
        <div
          key={item.id}
          className="flex justify-between border p-3 mb-2 rounded"
        >
          <span>
            {item.label} × {item.quantity}
          </span>
          <span>₹{item.total}</span>
        </div>
      ))}

      {items.length > 0 && (
        <>
          <div className="flex justify-between font-semibold mt-4">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            onClick={placeOrder}
            className="mt-6 w-full bg-green-600 text-white py-2 rounded"
          >
            Place Order
          </button>
        </>
      )}
    </div>
  );
}
