import { useEffect, useState } from "react";
import api from "../api/axios";

/* 🔹 Load Razorpay script */
const loadRazorpay = () =>
  new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function Upgrade() {
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  /* 🔹 Fetch plans + current subscription */
  useEffect(() => {
    api.get("/subscription/plans").then((res) => {
      setPlans(res.data.plans);
    });

    api.get("/subscription/me").then((res) => {
      setCurrentPlan(res.data.name);
    });
  }, []);

  /* 🔹 Upgrade handler */
  const upgradePlan = async (planId) => {
    try {
      setLoading(true);

      const loaded = await loadRazorpay();
      if (!loaded) {
        alert("Razorpay SDK failed to load. Check internet.");
        return;
      }

      // 1️⃣ Create payment order from backend
      const { data: order } = await api.post("/payments/create", { planId });

      // 2️⃣ Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        order_id: order.id,
        name: "Bakery SaaS",
        description: "Subscription Upgrade",
        handler: async function (response) {
          try {
            // 3️⃣ Verify payment
            console.log("Payment response:", response);
            const verifyRes = await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId,
            });

            console.log("Verification response:", verifyRes.data);
            alert("🎉 Subscription upgraded successfully!");
            window.location.reload();
          } catch (verifyErr) {
            console.error("Payment verification error:", verifyErr);
            alert(
              verifyErr.response?.data?.message ||
                "Payment verification failed. Please contact support."
            );
          }
        },
        theme: {
          color: "#2563eb",
        },
      };

      // 4️⃣ Open Razorpay popup
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Upgrade Your Plan</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`border rounded p-6 text-center ${
              plan.name === currentPlan ? "border-green-500 bg-green-50" : ""
            }`}
          >
            <h2 className="text-xl font-bold mb-2">{plan.name}</h2>

            <p className="text-2xl font-semibold mb-4">
              {plan.price === 0 ? "Free" : `₹${plan.price}/month`}
            </p>

            <p className="mb-4">
              {plan.order_limit
                ? `${plan.order_limit} orders / month`
                : "Unlimited orders"}
            </p>

            {plan.name === currentPlan ? (
              <button
                disabled
                className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed w-full"
              >
                Current Plan
              </button>
            ) : (
              <button
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full disabled:opacity-60"
                onClick={() => upgradePlan(plan.id)}
              >
                {loading ? "Processing..." : "Upgrade"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
