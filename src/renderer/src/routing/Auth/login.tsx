import Login from "@renderer/views/auth/Login";

const authRoutes = [
    {
        path: '/signin',
        element: <Login />,
    },
    {
        path: '/signup',
        element: <>Regist User</>,
    },
];

export default authRoutes
