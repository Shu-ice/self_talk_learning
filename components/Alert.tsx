
import React from 'react';

interface AlertProps {
  message: string;
  type: 'error' | 'warning' | 'info';
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  const baseClasses = "p-4 mb-4 text-sm rounded-lg";
  const typeClasses = {
    error: "bg-red-100 text-red-700 dark:bg-red-200 dark:text-red-800",
    warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-200 dark:text-yellow-800",
    info: "bg-sky-100 text-sky-700 dark:bg-sky-200 dark:text-sky-800",
  };

  if (!message) return null;

  return (
    <div className={`${baseClasses} ${typeClasses[type]} flex justify-between items-center`} role="alert">
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 p-1 rounded-md hover:bg-opacity-20 hover:bg-current focus:outline-none focus:ring-2 focus:ring-current"
          aria-label="Close alert"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Alert;
