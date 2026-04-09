import React from "react";
import { Navigate } from "react-router-dom";

const ExternalRedirect = ({ url }: { url: string }) => {
  React.useEffect(() => {
    window.location.href = url;
  }, [url]);
  return null;
};

const RegisterRedirect = () => (
  <ExternalRedirect url="https://sell-financeiro.lovable.app" />
);

export default RegisterRedirect;
