import { createContext, useCallback, useState } from "react";
import PropTypes from "prop-types";
import Toast from "../components/Miscellaneous/Toast.jsx";

// Create a new context
export const ToastContext = createContext({
  toast: { isVisible: false, message: "", type: "" },
  showToast: () => {},
});

// Create a ToastProvider component
const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "",
  });

  // Function to show toast
  const showToast = useCallback((message, type) => {
    setToast({ isVisible: true, message, type });
    setTimeout(
      () => setToast({ isVisible: false, message: "", type: "" }),
      5000
    );
  }, []);

  return (
    <ToastContext.Provider value={{ toast, showToast }}>
      {children}
      {toast.isVisible && <Toast type={toast.type} message={toast.message} />}
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ToastProvider;
