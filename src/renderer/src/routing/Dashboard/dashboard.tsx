import Dashboard from "@renderer/views/dashboard/Dashboard";
import Disclaimer from "@renderer/views/Disclaimer/Disclaimer";

const dashboardRoutes = [
  {
      path: '/dashboard',
      element: (<Dashboard />),
  },
  {
      path: "/disclaimer",
      element: (
        <>
          <Disclaimer />
        </>
      ),
  },
];

export default dashboardRoutes
