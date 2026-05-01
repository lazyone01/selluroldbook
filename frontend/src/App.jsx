import { Navigate, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import RoleGuard from "./components/RoleGuard";
import AuthPage from "./pages/AuthPage";
import UserDashboard from "./pages/UserDashboard";
import CartPage from "./pages/CartPage";
import SellerDashboard from "./pages/SellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserOrdersPage from "./pages/UserOrdersPage";
import { useAuth } from "./context/AuthContext";

const HomeRedirect = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/auth" replace />;
  if (user.role === "user") return <Navigate to="/user" replace />;
  if (user.role === "bookseller") return <Navigate to="/seller" replace />;
  return <Navigate to="/admin" replace />;
};

const App = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route
          path="/user"
          element={
            <RoleGuard allow={["user"]}>
              <UserDashboard />
            </RoleGuard>
          }
        />
        <Route
          path="/cart"
          element={
            <RoleGuard allow={["user"]}>
              <CartPage />
            </RoleGuard>
          }
        />
        <Route
          path="/user/orders"
          element={
            <RoleGuard allow={["user"]}>
              <UserOrdersPage />
            </RoleGuard>
          }
        />

        <Route
          path="/seller"
          element={
            <RoleGuard allow={["bookseller"]}>
              <SellerDashboard />
            </RoleGuard>
          }
        />

        <Route
          path="/admin"
          element={
            <RoleGuard allow={["admin"]}>
              <AdminDashboard />
            </RoleGuard>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
