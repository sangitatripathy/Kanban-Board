import React, { createContext, useState, useEffect, useContext } from "react";
import { getRequest } from "@/lib/axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await getRequest("/auth/me"); // or /user/me
      setUser(res);
    } catch (err) {
      setUser((prev) => prev ?? null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (userData) => {
    setUser(userData);
  };

  const logoutUser = async () => {
    try {
      await getRequest("/auth/logout"); 
    } catch (err) {
      console.error(err);
    }
    setUser(null);
  };
  console.log(user)
  return (
    <UserContext.Provider value={{ user, setUser, login, logoutUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);