import { useEffect, useState } from "react";
import apiClient from "../api/client";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    const { data } = await apiClient.get("/categories");
    setCategories(data.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!categoryName.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      setLoading(true);
      await apiClient.post("/categories", { categoryName });
      setCategoryName("");
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Categories</h1>
      <form className="panel inline-form" onSubmit={onSubmit}>
        <input
          placeholder="Category name"
          value={categoryName}
          onChange={(event) => setCategoryName(event.target.value)}
        />
        <button className="btn" disabled={loading} type="submit">
          {loading ? "Saving..." : "Add Category"}
        </button>
      </form>
      {error ? <p className="error-text">{error}</p> : null}

      <section className="panel">
        <ul>
          {categories.map((category) => (
            <li key={category._id}>{category.categoryName}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default CategoriesPage;
