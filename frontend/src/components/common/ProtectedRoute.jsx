// src/components/common/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { Spinner, Center } from '@chakra-ui/react';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  // ✅ MUST match AuthContext exactly
  const { user, isLoading } = useContext(AuthContext);

  // ✅ Correct loading guard
  if (isLoading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" thickness="4px" />
      </Center>
    );
  }

  // ✅ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Role protection
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Access granted
  return <Outlet />;
};

export default ProtectedRoute;

