import App from "@renderer/App";
import { createHashRouter } from "react-router-dom";
import authRoutes from "./Auth/login";
import dashboardRoutes from "./Dashboard/dashboard";
import otherRoutes from "./otherRoutes";
import ProtectedRoute from "@renderer/redux/components/ProtectedRoute";
import Navbar from "@renderer/components/Navbar";
import hoursControlRoutes from "./HoursManagement/hoursControl";
import settingsRoutes from "./Settings/settings";
import ProtectedAdminRoute from "@renderer/redux/components/ProtectedAdminRoute";
import adminRoutes from "./Admin/admin";

// Wrap each element with ProtectedRoute and Navbar
const withProtectedRouteAndNavbar = (element: React.ReactNode) => (
    <ProtectedRoute>
        <Navbar />
        {element}
    </ProtectedRoute>
);

const withProtectedAdminRouteAndNavbar = (element: React.ReactNode) => (
  <ProtectedAdminRoute>
      <Navbar />
      {element}
  </ProtectedAdminRoute>
);

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
    ...dashboardRoutes.map(route => ({
        ...route,
        element: withProtectedRouteAndNavbar(route.element),
    })),
    ...hoursControlRoutes.map(route => ({
      ...route,
      element: withProtectedRouteAndNavbar(route.element),
    })),
    ...settingsRoutes.map(route => ({
      ...route,
      element: withProtectedRouteAndNavbar(route.element),
    })),
    ...adminRoutes.map(route => ({
      ...route,
      element: withProtectedAdminRouteAndNavbar(route.element),
    })),
    ...otherRoutes
];

const router = createHashRouter(routes);

export default router;
