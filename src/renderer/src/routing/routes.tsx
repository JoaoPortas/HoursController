import App from "@renderer/App";
import { createHashRouter } from "react-router-dom";
import authRoutes from "./Auth/login";

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