import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../store';

const ProtectedRoute: React.FC<{children: ReactNode}> = ({ children }) => {
  const userId = useSelector((state: RootState) => state.userSession.userId);

  return userId ? <Outlet /> : <Navigate to="/signin" />;
};

export default ProtectedRoute;
