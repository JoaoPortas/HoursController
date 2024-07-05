import App from "@renderer/App";
import { createHashRouter } from "react-router-dom";
import authRoutes from "./Auth/login";
import Vite from "@renderer/views/Vite";

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
      path: "/vite",
      element: (
        <>
          <Vite />
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