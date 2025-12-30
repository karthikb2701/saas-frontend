import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Upgrade() {
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);

  useEffect(() => {
    api.get("/subscription/plans").then((res) => {
      setPlans(res.data.plans);
    });

    api.get("/subscription/me").then((res) => {
      setCurrentPlan(res.data.name);
    });
  }, []);

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
                className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
              >
                Current Plan
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() =>
                  alert(`Upgrade to ${plan.name} (payment coming soon)`)
                }
              >
                Upgrade
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
