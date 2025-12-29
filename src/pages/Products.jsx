import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState({});

  useEffect(() => {
    api.get("/products").then((res) => {
      setProducts(res.data.products);

      // fetch variants for each product
      res.data.products.forEach((p) => {
        api.get(`/products/${p.id}/variants`).then((vRes) => {
          setVariants((prev) => ({
            ...prev,
            [p.id]: vRes.data.variants,
          }));
        });
      });
    });
  }, []);

  const addToCart = async (variantId) => {
    await api.post("/cart", {
      variant_id: variantId,
      quantity: 1,
    });
    alert("Added to cart");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      {products.map((p) => (
        <div key={p.id} className="border p-4 mb-4 rounded">
          <h2 className="font-semibold text-lg">{p.name}</h2>

          <div className="mt-3 space-y-2">
            {variants[p.id]?.map((v) => (
              <div
                key={v.id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <span>
                  {v.label} – ₹{v.price}
                </span>
                <button
                  onClick={() => addToCart(v.id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
