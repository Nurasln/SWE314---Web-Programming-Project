import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

// SVG Icons
const icons = {
  success: (
    <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};

const styles = {
  success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/90 dark:border-green-800 dark:text-green-100 shadow-green-500/20',
  error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/90 dark:border-red-800 dark:text-red-100 shadow-red-500/20',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/90 dark:border-yellow-800 dark:text-yellow-100 shadow-yellow-500/20',
  info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/90 dark:border-blue-800 dark:text-blue-100 shadow-blue-500/20',
};

const iconColors = {
  success: 'text-green-500 dark:text-green-400',
  error: 'text-red-500 dark:text-red-400',
  warning: 'text-yellow-500 dark:text-yellow-400',
  info: 'text-blue-500 dark:text-blue-400',
};

const NotificationItem = ({ notification, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // 5.5 seconds timeout then start closing animation
    const timer = setTimeout(() => {
      setIsClosing(true);
    }, 5500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isClosing) {
      // Wait for exit animation to finish before actually removing
      const removeTimer = setTimeout(() => {
        onClose(notification.id);
      }, 500); // matches the duration of slide-out animation
      return () => clearTimeout(removeTimer);
    }
  }, [isClosing, notification.id, onClose]);

  const handleClose = () => {
    setIsClosing(true);
  };

  const type = notification.type || 'info';
  const typeStyle = styles[type] || styles.info;
  const iconColor = iconColors[type] || iconColors.info;

  return (
    <div
      className={`
        pointer-events-auto
        w-80 sm:w-96 max-w-[90vw] p-4 rounded-xl shadow-lg border backdrop-blur-md
        flex items-start gap-3 relative overflow-hidden
        transition-all duration-500 ease-out
        ${isClosing ? 'opacity-0 translate-x-full scale-95' : 'opacity-100 translate-x-0 scale-100'}
        ${typeStyle}
      `}
      style={{
        animation: !isClosing ? 'slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none'
      }}
    >
      <div className={`mt-0.5 ${iconColor}`}>
        {icons[type] || icons.info}
      </div>
      <div className="flex-1 pr-6">
        <p className="text-sm font-medium leading-relaxed">
          {notification.message}
        </p>
      </div>
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors focus:outline-none"
        aria-label="Close notification"
      >
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-black/10 dark:bg-white/10 w-full rounded-b-xl origin-left" style={{ animation: `progress 5.5s linear forwards` }}></div>
    </div>
  );
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, type = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-5 right-5 sm:top-6 sm:right-6 z-[9999] flex flex-col gap-4 pointer-events-none">
        {notifications.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClose={removeNotification}
          />
        ))}
      </div>
      
      {/* Inline styles for keyframes so we don't need to touch index.css for these specific ones */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%) scale(0.95); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes progress {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      `}} />
    </NotificationContext.Provider>
  );
};
