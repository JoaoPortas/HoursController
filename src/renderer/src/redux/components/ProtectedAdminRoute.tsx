import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store';

const ProtectedAdminRoute: React.FC<{children: ReactNode}> = ({ children }) => {
    const userId = useSelector((state: RootState) => state.userSession.userId);
    return userId == 1 ? <>{ children }</> : <Navigate to="/signin" />;
};

export default ProtectedAdminRoute;