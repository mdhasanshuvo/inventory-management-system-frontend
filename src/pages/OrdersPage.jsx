import { useEffect, useMemo, useState } from "react";
import apiClient from "../api/client";

const emptyOrder = {
  customerName: "",
  products: [{ productId: "", quantity: 1 }]
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyOrder);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const loadData = async () => {
    const [ordersResponse, productsResponse] = await Promise.all([
      apiClient.get(filterStatus ? `/orders?status=${filterStatus}` : "/orders"),
      apiClient.get("/products?limit=100")
    ]);

    setOrders(ordersResponse.data.data);
    setProducts(productsResponse.data.data);
  };

  useEffect(() => {
    loadData();
  }, [filterStatus]);

  const productOptions = useMemo(
    () => products.filter((product) => product.status === "Active" && product.stockQuantity > 0),
    [products]
  );

  const updateItem = (index, field, value) => {
    setForm((prev) => {
      const nextProducts = [...prev.products];
      nextProducts[index] = {
        ...nextProducts[index],
        [field]: field === "quantity" ? Number(value) : value
      };

      return { ...prev, products: nextProducts };
    });
  };

  const addItem = () => {
    setForm((prev) => ({ ...prev, products: [...prev.products, { productId: "", quantity: 1 }] }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const ids = form.products.map((item) => item.productId);
    if (ids.some((id) => !id)) {
      setError("Every order item requires a product.");
      return;
    }

    if (new Set(ids).size !== ids.length) {
      setError("This product is already added to the order.");
      return;
    }

    try {
      await apiClient.post("/orders", form);
      setForm(emptyOrder);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create order");
    }
  };

  const updateStatus = async (id, orderStatus) => {
    try {
      await apiClient.patch(`/orders/${id}/status`, { orderStatus });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update order status");
    }
  };

  return (
    <div>
      <h1>Orders</h1>

      <form className="panel" onSubmit={onSubmit}>
        <input
          placeholder="Customer name"
          value={form.customerName}
          onChange={(event) => setForm((prev) => ({ ...prev, customerName: event.target.value }))}
        />

        {form.products.map((item, index) => (
          <div className="inline-form" key={`item-${index}`}>
            <select value={item.productId} onChange={(event) => updateItem(index, "productId", event.target.value)}>
              <option value="">Select product</option>
              {productOptions.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.productName} (Stock: {product.stockQuantity})
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(event) => updateItem(index, "quantity", event.target.value)}
            />
          </div>
        ))}

        <div className="inline-form">
          <button className="btn btn-outline" type="button" onClick={addItem}>
            Add Item
          </button>
          <button className="btn" type="submit">
            Create Order
          </button>
        </div>
      </form>

      <div className="inline-form">
        <label>Status Filter:</label>
        <select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}>
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      <section className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Items</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.customerName}</td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td>{order.orderStatus}</td>
                <td>{order.products.length}</td>
                <td>
                  <select
                    value={order.orderStatus}
                    onChange={(event) => updateStatus(order._id, event.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default OrdersPage;
