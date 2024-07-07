import App from "@renderer/App";
import { createHashRouter } from "react-router-dom";
import authRoutes from "./Auth/login";
import dashboardRoutes from "./Dashboard/dashboard";
import otherRoutes from "./otherRoutes";

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
    ...otherRoutes
];

const router = createHashRouter(routes);

export default router;
