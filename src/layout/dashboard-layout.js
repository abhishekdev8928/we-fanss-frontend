import React, { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../components/dashboard-component/Sidebar";
import Header from "../components/dashboard-component/Header";
import Footer from "../components/dashboard-component/Footer";
import { useIsAuthenticated } from "../config/store/authStore";
import { usePrivilegeStore } from "../config/store/privilegeStore";
import { getUserPrivileges } from "../api/privilegeApi";

const DashboardLayout = () => {
  const isAuthenticated = useIsAuthenticated();

  const setPrivileges = usePrivilegeStore((state) => state.setPrivileges);
  const role = usePrivilegeStore((state) => state.role); 

  
  useEffect(() => {
    const fetchPrivileges = async () => {
      try {
        const res = await getUserPrivileges();

        if (res.success) {
          setPrivileges(res.data);
        }
      } catch (error) {
        console.error("Error loading privileges:", error);
      }
    };

    // Only fetch if logged in AND privileges not already loaded
    if (isAuthenticated && !role) {
      fetchPrivileges();
    }
  }, [isAuthenticated, role, setPrivileges]);

  // Redirect unauthenticated users
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div id="layout-wrapper">
      <Header />
      <Sidebar />

      <div className="main-content">
        <Outlet />
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
