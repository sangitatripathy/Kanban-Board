import React, { useState, useCallback } from "react";
import Drawer from "../components/Drawer";
import Navbar from "../components/Navbar";
import Main from "../components/Main";

const Dashboard = () => {
  const [openDrawer, setOpenDrawer] = useState(true);

  const handleToggleDrawer = useCallback(() => {
    setOpenDrawer((prev) => !prev);
  }, []);

  return (
    <div className="flex h-screen">
      <div
        className={`transition-all duration-100 ease-in-out ${
          openDrawer ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        <Drawer />
      </div>

      <div className="flex-1 flex flex-col">
        <Navbar toggleDrawer={handleToggleDrawer} />

        <Main />
      </div>
    </div>
  );
};

export default Dashboard;
