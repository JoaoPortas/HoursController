import App from "@renderer/App";
import { createHashRouter } from "react-router-dom";
import authRoutes from "./Auth/login";
import Vite from "@renderer/views/Vite";
import dashboardRoutes from "./Dashboard/dashboard";
import ProtectedRoute from "@renderer/redux/components/ProtectedRoute";

const routes = [
    {
        path: "/",
        element: (
          <>
            <App />
          </>
        ),
    },
    ...authRoutes,
    ...dashboardRoutes,
    {
      path: "/vite",
      element: (
        <>
          <ProtectedRoute>
              <Vite />
          </ProtectedRoute>
        </>
      ),
  },
    {
        path: "view/:id",
        element: (
          <>
            <h1>View</h1>
          </>
        ),
      },
      {
        path: "edit/:id",
        element: (
          <>
            <h1>Edit</h1>
          </>
        ),
    },
];

const router = createHashRouter(routes);

export default router;
