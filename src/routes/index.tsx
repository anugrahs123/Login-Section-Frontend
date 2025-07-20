import { useRoutes } from "react-router-dom";
import LoginPage from "../pages/Login";
import DashboardPage from "../pages/Dashboard";
import PrivateRoute from "../components/PrivateRoute";

export default function AppRoutes() {
  return useRoutes([
    { path: "/login", element: <LoginPage /> },
    {
      path: "/dashboard",
      element: (
        <PrivateRoute>
          <DashboardPage />
        </PrivateRoute>
      ),
    },
    { path: "*", element: <LoginPage /> },
  ]);
}
