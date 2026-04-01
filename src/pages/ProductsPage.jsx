import { useEffect, useState } from "react";
import apiClient from "../api/client";

const initialForm = {
  productName: "",
  category: "",
  price: 0,
  stockQuantity: 0,
  minimumStockThreshold: 5
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");

  const fetchData = async () => {
    const [productResponse, categoryResponse] = await Promise.all([
      apiClient.get("/products?limit=100"),
      apiClient.get("/categories")
    ]);

    setProducts(productResponse.data.data);
    setCategories(categoryResponse.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onChange = (event) => {
    const value = ["price", "stockQuantity", "minimumStockThreshold"].includes(event.target.name)
      ? Number(event.target.value)
      : event.target.value;

    setForm((prev) => ({ ...prev, [event.target.name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId("");
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.stockQuantity < 0) {
      setError("Stock cannot be negative");
      return;
    }

    try {
      if (editingId) {
        await apiClient.put(`/products/${editingId}`, form);
      } else {
        await apiClient.post("/products", form);
      }
      resetForm();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product");
    }
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setForm({
      productName: product.productName,
      category: product.category?._id || product.category,
      price: product.price,
      stockQuantity: product.stockQuantity,
      minimumStockThreshold: product.minimumStockThreshold
    });
  };

  return (
    <div>
      <h1>Products</h1>
      <form className="panel grid-form" onSubmit={onSubmit}>
        <input name="productName" placeholder="Product name" value={form.productName} onChange={onChange} />
        <select name="category" value={form.category} onChange={onChange}>
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.categoryName}
            </option>
          ))}
        </select>
        <input name="price" type="number" min="0" value={form.price} onChange={onChange} />
        <input
          name="stockQuantity"
          type="number"
          min="0"
          value={form.stockQuantity}
          onChange={onChange}
        />
        <input
          name="minimumStockThreshold"
          type="number"
          min="0"
          value={form.minimumStockThreshold}
          onChange={onChange}
        />
        <button className="btn" type="submit">{editingId ? "Update" : "Add Product"}</button>
        {editingId ? (
          <button className="btn btn-outline" type="button" onClick={resetForm}>
            Cancel Edit
          </button>
        ) : null}
      </form>

      {error ? <p className="error-text">{error}</p> : null}

      <section className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.productName}</td>
                <td>{product.category?.categoryName || "-"}</td>
                <td>${product.price}</td>
                <td>{product.stockQuantity}</td>
                <td>{product.status}</td>
                <td>
                  <button className="btn btn-outline" onClick={() => startEdit(product)}>
                    Edit
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

export default ProductsPage;
