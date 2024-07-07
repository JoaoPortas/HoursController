import ProtectedRoute from "@renderer/redux/components/ProtectedRoute";
import Dashboard from "@renderer/views/dashboard/Dashboard";

const dashboardRoutes = [
  {
      path: '/dashboard',
      element: (
          <ProtectedRoute>
              <Dashboard />
          </ProtectedRoute>
      ),
  }
];

export default dashboardRoutes
