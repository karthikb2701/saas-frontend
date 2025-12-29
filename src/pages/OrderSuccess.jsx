import { useParams } from "react-router-dom";

export default function OrderSuccess() {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-2">
          Order Successful 🎉
        </h1>
        <p>Your order #{orderId.slice(0, 6)} has been placed.</p>
      </div>
    </div>
  );
}
