import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/categories", label: "Categories" },
  { to: "/products", label: "Products" },
  { to: "/orders", label: "Orders" },
  { to: "/restock", label: "Restock Queue" }
];

const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2>Smart Inventory</h2>
        <p className="muted">Admin Panel</p>

        <nav>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="content-area">
        <header className="topbar">
          <div>
            <strong>{user?.name}</strong>
            <p className="muted small">{user?.role}</p>
          </div>
          <button className="btn btn-outline" onClick={logout}>
            Logout
          </button>
        </header>

        <section className="page-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default Layout;
