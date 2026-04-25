import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "@/context/userContext";

const VerifyInvitation = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useUser();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) {
      localStorage.setItem("inviteToken", token);
    }
  }, [token]);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    const verifyInvite = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/invite/verify/${token}`,
        );
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      }
    };

    verifyInvite();
  }, [token, user, loading]);

  if (error) return <div>{error}</div>;
  if (!data) return <div>Loading...</div>;
  console.log(token)
  return (
    <div>
      <h2>You're invited to join {data.orgName}</h2>
      <p>Role: {data.role}</p>
      <p>Invited by: {data.invitedBy}</p>

      <button onClick={handleAccept}>Accept Invite</button>
    </div>
  );

  async function handleAccept() {
    try {
      await axios.post(
        "http://localhost:8000/api/invite/accept",
        { token },
        { withCredentials: true },
      );

      localStorage.removeItem("inviteToken");

      alert("Joined successfully");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  }
};

export default VerifyInvitation;
