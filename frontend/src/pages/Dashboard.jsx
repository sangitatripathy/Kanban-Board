import React, { useState } from "react";
import Drawer from "../components/Drawer";
import Navbar from "../components/Navbar";
import Main from "../components/Main";

const Dashboard = () => {
  const [openDrawer, setOpenDrawer] = useState(true);

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

        <Navbar toggleDrawer={() => setOpenDrawer(!openDrawer)} />

        <Main />

      </div>
    </div>
  );
};

export default Dashboard;