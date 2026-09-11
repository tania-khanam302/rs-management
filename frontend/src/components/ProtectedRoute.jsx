import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await axios.get(
          "https://rs-management-vgcw.onrender.com/api/students/profile",
          {
            withCredentials: true,
          }
        );

        if (response.data?.student) {
          setAuthenticated(true);

          localStorage.setItem(
            "student",
            JSON.stringify(response.data.student)
          );
        } else {
          setAuthenticated(false);
          localStorage.removeItem("student");
        }
      } catch (error) {
        console.log(
          "Authentication Check Error:",
          error.response?.data
        );

        setAuthenticated(false);
        localStorage.removeItem("student");
      } finally {
        setChecking(false);
      }
    };

    checkLogin();
  }, []);

  if (checking) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "18px",
        }}
      >
        Checking login...
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;