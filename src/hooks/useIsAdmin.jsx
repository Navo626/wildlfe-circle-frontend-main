import { useContext, useEffect, useState } from "react";
import { ToastContext } from "./ToastProvider.jsx";
import useAxios from "./useAxios.jsx";
import { useNavigate } from "react-router-dom";

const useIsAdmin = () => {
  const { showToast } = useContext(ToastContext);
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkIsAdmin = () => {
      axiosInstance
        .get("/api/auth/check-token")
        .then((response) => {
          if (response.data.data.role === "admin") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
            showToast("You are not authorized to access this page.", "warning");
            navigate("/");
          }
        })
        .catch((error) => {
          console.error(error);
          setIsAdmin(false);
          showToast("Session has expired. Please log in again.", "warning");
          navigate("/login");
        });
    };

    checkIsAdmin();
  }, []);

  return isAdmin;
};

export default useIsAdmin;
