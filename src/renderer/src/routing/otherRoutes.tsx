import ProtectedRoute from "@renderer/redux/components/ProtectedRoute";
import Vite from "@renderer/views/Vite";

const otherRoutes = [
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

export default otherRoutes
