import { useState } from "react";
import ToastNotification from "../components/ToastNotification";

const useNotification = (position = "top-right") => {
  const [notification, setNotification] = useState(null);

  const triggerNotification = (notificationProps) => {
    setNotification(notificationProps);
    setTimeout(() => {
      setNotification(null);
    }, notificationProps.duration || 3000);
  };

  const closeNotification = () => setNotification(null);

  const NotificationComponent = notification ? (
    <ToastNotification
      {...notification}
      position={position}
      onClose={closeNotification}
    />
  ) : null;

  return { triggerNotification, NotificationComponent };
};

export default useNotification;