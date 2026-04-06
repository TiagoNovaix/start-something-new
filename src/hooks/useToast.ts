import { toast } from 'sonner';

const baseStyle = {
  background: '#1E2330',
  borderRadius: '10px',
  color: '#E4E7F0',
  fontFamily: "'Plus Jakarta Sans', sans-serif",
};

export function useToast() {
  const success = (title: string, message?: string) => {
    toast.success(title, {
      description: message,
      duration: 4000,
      style: {
        ...baseStyle,
        border: '0.5px solid rgba(34,197,94,0.20)',
        borderLeft: '3px solid #22c55e',
      },
    });
  };

  const error = (title: string, message?: string) => {
    toast.error(title, {
      description: message,
      duration: 5000,
      style: {
        ...baseStyle,
        border: '0.5px solid rgba(226,0,85,0.22)',
        borderLeft: '3px solid #e20055',
      },
    });
  };

  const warning = (title: string, message?: string) => {
    toast.warning(title, {
      description: message,
      duration: 5000,
      style: {
        ...baseStyle,
        border: '0.5px solid rgba(245,158,11,0.22)',
        borderLeft: '3px solid #f59e0b',
      },
    });
  };

  return { success, error, warning };
}

// Standalone functions for non-component usage
export const toastSuccess = (title: string, message?: string) => {
  toast.success(title, {
    description: message,
    duration: 4000,
    style: {
      ...baseStyle,
      border: '0.5px solid rgba(34,197,94,0.20)',
      borderLeft: '3px solid #22c55e',
    },
  });
};

export const toastError = (title: string, message?: string) => {
  toast.error(title, {
    description: message,
    duration: 5000,
    style: {
      ...baseStyle,
      border: '0.5px solid rgba(226,0,85,0.22)',
      borderLeft: '3px solid #e20055',
    },
  });
};

export const toastWarning = (title: string, message?: string) => {
  toast.warning(title, {
    description: message,
    duration: 5000,
    style: {
      ...baseStyle,
      border: '0.5px solid rgba(245,158,11,0.22)',
      borderLeft: '3px solid #f59e0b',
    },
  });
};
