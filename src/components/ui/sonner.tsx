import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      position="bottom-right"
      gap={8}
      toastOptions={{
        style: {
          background: '#1E2330',
          border: '0.5px solid rgba(255,255,255,0.07)',
          borderRadius: '10px',
          color: '#E4E7F0',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '13px',
          padding: '13px 14px',
        },
        duration: 4000,
      }}
      {...props}
    />
  );
};

export { Toaster };
