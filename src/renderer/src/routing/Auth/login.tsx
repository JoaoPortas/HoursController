import Login from "@renderer/views/auth/Login";
import Signup from '../../views/auth/Signup';

const authRoutes = [
    {
        path: '/signin',
        element: <Login />,
    },
    {
        path: '/signup',
        element: <Signup />,
    },
];

export default authRoutes
