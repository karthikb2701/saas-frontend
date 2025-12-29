import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders").then((res) => setOrders(res.data.orders));
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>

      {orders.map((o) => (
        <div key={o.id} className="border p-4 mb-3 rounded">
          <p className="font-semibold">Order #{o.id.slice(0, 6)}</p>
          <p>Total: ₹{o.total_amount}</p>
          <p>Status: {o.order_status}</p>
        </div>
      ))}
    </div>
  );
}
