import { useContext } from "react";
import axios from "axios";
import { ToastContext } from "./ToastProvider.jsx";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const useAxios = () => {
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();
  const token = Cookies.get("token");

  const instance = axios.create({
    baseURL: import.meta.env.VITE_APP_BACKEND_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    withCredentials: true,
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        showToast("Session expired. Please log in again!", "danger");
        localStorage.clear();
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default useAxios;
