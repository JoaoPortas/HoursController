import Navbar from "@renderer/components/Navbar";
import ProtectedRoute from "@renderer/redux/components/ProtectedRoute";
import Dashboard from "@renderer/views/dashboard/Dashboard";

const dashboardRoutes = [
  {
      path: '/dashboard',
      element: (<Dashboard />),
  },
];

export default dashboardRoutes
