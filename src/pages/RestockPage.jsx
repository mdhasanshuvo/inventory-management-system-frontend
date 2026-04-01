import { useEffect, useState } from "react";
import apiClient from "../api/client";

const RestockPage = () => {
  const [queue, setQueue] = useState([]);
  const [error, setError] = useState("");
  const [restockMap, setRestockMap] = useState({});

  const fetchQueue = async () => {
    const { data } = await apiClient.get("/restock");
    setQueue(data.data);
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const restock = async (item) => {
    try {
      const addedStock = Number(restockMap[item._id] || 0);
      if (addedStock <= 0) {
        setError("Restock quantity must be greater than 0.");
        return;
      }

      await apiClient.post("/restock/restock", {
        productId: item.product._id,
        addedStock
      });

      setError("");
      fetchQueue();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to restock");
    }
  };

  return (
    <div>
      <h1>Restock Queue</h1>
      {error ? <p className="error-text">{error}</p> : null}

      <section className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Priority</th>
              <th>Current Stock</th>
              <th>Threshold</th>
              <th>Restock</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((item) => (
              <tr key={item._id}>
                <td>{item.product?.productName}</td>
                <td>{item.priority}</td>
                <td>{item.stockQuantity}</td>
                <td>{item.minimumStockThreshold}</td>
                <td className="inline-form">
                  <input
                    type="number"
                    min="1"
                    value={restockMap[item._id] || ""}
                    onChange={(event) =>
                      setRestockMap((prev) => ({ ...prev, [item._id]: event.target.value }))
                    }
                  />
                  <button className="btn" onClick={() => restock(item)}>
                    Restock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default RestockPage;
