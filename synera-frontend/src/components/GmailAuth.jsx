import React, { useEffect } from "react";

const GmailAuth = () => {
  useEffect(() => {
    window.location.href = "http://127.0.0.1:8000/gmail-auth/"; // redirect to backend for OAuth
  }, []);

  return <p>Redirecting to Gmail...</p>;
};

export default GmailAuth;
