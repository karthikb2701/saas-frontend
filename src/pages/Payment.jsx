import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

export default function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const payNow = async () => {
    await api.post("/payments", {
      order_id: orderId,
      transaction_id: "TXN_" + Date.now(),
    });

    navigate(`/orders/${orderId}/success`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="border p-6 rounded shadow w-96">
        <h1 className="text-xl font-bold mb-4">Payment</h1>
        <p className="mb-4">Order ID: {orderId}</p>

        <button
          onClick={payNow}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}
