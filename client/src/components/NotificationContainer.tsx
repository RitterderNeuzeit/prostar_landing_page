import React from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import {
  useNotification,
  NotificationType,
} from "@/contexts/NotificationContext";

const getNotificationStyles = (type: NotificationType) => {
  const baseStyles = "px-4 py-3 rounded-lg border backdrop-blur-sm";

  switch (type) {
    case "success":
      return `${baseStyles} bg-green-900/20 border-green-500/50 text-green-100`;
    case "error":
      return `${baseStyles} bg-red-900/20 border-red-500/50 text-red-100`;
    case "warning":
      return `${baseStyles} bg-yellow-900/20 border-yellow-500/50 text-yellow-100`;
    case "info":
      return `${baseStyles} bg-cyan-900/20 border-cyan-500/50 text-cyan-100`;
    default:
      return baseStyles;
  }
};

const getIcon = (type: NotificationType) => {
  const iconProps = { size: 20, className: "flex-shrink-0" };

  switch (type) {
    case "success":
      return <CheckCircle {...iconProps} className="text-green-400" />;
    case "error":
      return <AlertCircle {...iconProps} className="text-red-400" />;
    case "warning":
      return <AlertTriangle {...iconProps} className="text-yellow-400" />;
    case "info":
      return <Info {...iconProps} className="text-cyan-400" />;
    default:
      return null;
  }
};

const getButtonStyles = (variant?: string) => {
  const baseStyles = "text-xs font-semibold px-3 py-1.5 rounded transition-all";
  switch (variant) {
    case "primary":
      return `${baseStyles} bg-cyan-500/30 hover:bg-cyan-500/50 text-cyan-200`;
    case "danger":
      return `${baseStyles} bg-red-500/30 hover:bg-red-500/50 text-red-200`;
    default:
      return `${baseStyles} bg-white/10 hover:bg-white/20 text-white/90`;
  }
};

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-6 right-6 z-50 space-y-3 pointer-events-none">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`${getNotificationStyles(notification.type)} animate-slide-in-right pointer-events-auto max-w-md shadow-lg`}
          role="alert"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="flex items-start gap-3">
            {getIcon(notification.type)}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-1">
                {notification.title}
              </h3>
              <p className="text-sm opacity-90">{notification.message}</p>
              {(notification.actions ||
                (notification.action && [notification.action])) && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {(notification.actions || [notification.action]).map(
                    (btn, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          btn?.onClick();
                          removeNotification(notification.id);
                        }}
                        className={getButtonStyles(btn?.variant)}
                      >
                        {btn?.label}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Close notification"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;
