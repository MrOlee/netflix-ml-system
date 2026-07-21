// frontend/src/hooks/useToast.js
import { useState } from 'react';

export const useToast = () => {
  const [toast, setToast] = useState({ message: '', type: '', visible: false });

  const showToast = (message, type = 'info') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast({ ...toast, visible: false });
    }, 3000);
  };

  return { toast, showToast };
};
