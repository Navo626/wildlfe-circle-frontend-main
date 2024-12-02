import { useContext, useEffect, useState } from "react";
import { ToastContext } from "./ToastProvider.jsx";
import useAxios from "./useAxios.jsx";
import { useNavigate } from "react-router-dom";

const useCheckSession = () => {
  const { showToast } = useContext(ToastContext);
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [isSessionActive, setSessionActive] = useState(false);

  useEffect(() => {
    const checkSession = () => {
      const sessionActive = localStorage.getItem("sessionActive");
      if (sessionActive === "true") {
        axiosInstance
          .get("/api/auth/check-token")
          .then(() => {
            setSessionActive(true);
          })
          .catch(() => {
            localStorage.clear();
            setSessionActive(false);
            showToast("Session has expired. Please log in again.", "warning");
            navigate("/login");
          });
      } else {
        setSessionActive(false);
      }
    };

    checkSession();
  }, []);

  return isSessionActive;
};

export default useCheckSession;
