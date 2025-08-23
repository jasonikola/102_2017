import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { CircularProgress } from "@mui/material"; // Import CircularProgress
import api from "../services/api";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await api.get("/auth/check");
      setIsAuth(true);
    } catch {
      setIsAuth(false);
    }
  };

  if (isAuth === null) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/fact" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
