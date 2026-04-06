import { useEffect, useState, useRef } from "react";
import { getRequest } from "../../lib/axios";

const VerifyEmail = () => {
  const [message, setMessage] = useState("Verifying...");
  const hasCalled = useRef(false);

  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;
    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
      setMessage("Invalid verification link ❌");
      return;
    }

    getRequest(`/auth/verify-email?token=${token}`)
      .then((res) => {
        setMessage("Email verified successfully ✅");
      })
      .catch((err) => {
        setMessage(err.message || "Verification failed ❌");
      });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>{message}</h2>
    </div>
  );
};

export default VerifyEmail;
