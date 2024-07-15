import HoursRegist from "@renderer/views/hoursManagement/HoursRegist";
import RegisteredHours from "@renderer/views/hoursManagement/RegisteredHours";

const hoursControlRoutes = [
  {
        path: '/hoursControl/hoursRegist',
        element: (<HoursRegist />),
  },
  {
        path: '/hoursManagement/registeredHours',
        element: (<RegisteredHours />),
  }
];

export default hoursControlRoutes
