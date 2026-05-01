import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <header className="topbar">
      <div className="container topbar-content">
        <Link to="/" className="brand">
          SellUrOldBook
        </Link>

        <nav className="nav-links">
          {!user && <Link to="/auth">Login / Signup</Link>}

          {user?.role === "user" && (
            <>
              <Link to="/user">Browse</Link>
              <Link to="/cart">Cart</Link>
              <Link to="/user/orders">Orders</Link>
            </>
          )}

          {user?.role === "bookseller" && <Link to="/seller">Seller Dashboard</Link>}
          {user?.role === "admin" && <Link to="/admin">Admin Dashboard</Link>}

          {user && (
            <button className="btn ghost" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
