import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Subscription() {
  const [plan, setPlan] = useState(null);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    api.get("/subscription/me").then((res) => {
      setPlan(res.data);
    });

    api.get("/invoices").then((res) => {
      setInvoices(res.data.invoices);
    });
  }, []);

  if (!plan) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Subscription</h1>

      {/* Current Plan */}
      <div className="border p-4 rounded mb-6">
        <p>
          <b>Plan:</b> {plan.name}
        </p>
        <p>
          <b>Price:</b> ₹{plan.price}
        </p>
        <p>
          <b>Order Limit:</b>{" "}
          {plan.order_limit ? plan.order_limit : "Unlimited"}
        </p>
      </div>

      {/* Invoices */}
      <h2 className="text-xl font-semibold mb-3">Invoices</h2>

      {invoices.length === 0 ? (
        <p className="text-gray-500">No invoices yet.</p>
      ) : (
        <div className="border rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Invoice #</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-t">
                  <td className="p-2">{inv.invoice_number}</td>
                  <td className="p-2">
                    {new Date(inv.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-2">₹{inv.amount}</td>
                  <td className="p-2">{inv.status}</td>
                  <td className="p-2">
                    <a
                      href={`${import.meta.env.VITE_API_BASE_URL}/invoices/${
                        inv.id
                      }/download`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Download PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
