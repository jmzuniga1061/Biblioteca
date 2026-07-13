import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Loans from "./pages/Loans";
import Authors from "./pages/Authors";
import Categories from "./pages/Categories";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/books"
        element={
          <PrivateRoute>
            <Books />
          </PrivateRoute>
        }
      />

      <Route
        path="/loans"
        element={
          <PrivateRoute>
            <Loans />
          </PrivateRoute>
        }
      />

      <Route
        path="/authors"
        element={
          <PrivateRoute>
            <Authors />
          </PrivateRoute>
        }
      />

      <Route
        path="/categories"
        element={
          <PrivateRoute>
            <Categories />
          </PrivateRoute>
        }
      />

      <Route
        path="/users"
        element={
          <PrivateRoute allowedRoles={["admin", "administrador", "subadministrador"]}>
            <Users />
          </PrivateRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <PrivateRoute allowedRoles={["bibliotecario", "admin", "administrador", "subadministrador"]}>
            <Reports />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

