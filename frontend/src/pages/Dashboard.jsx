import React, { useState } from "react";
import { Moon, Sun, Search, Bell, User, PanelLeft } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Drawer from "../components/Drawer";
import { useUser } from "../context/userContext";

const Dashboard = () => {
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [openDrawer, setOpenDrawer] = useState(true);
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={` transition-all duration-300 ${
          openDrawer ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        <Drawer />
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between px-10 py-3 border-b border-gray-300 shadow-sm">
          <div className="flex gap-4 items-center">
            <PanelLeft
              size={20}
              className="cursor-pointer"
              onClick={() => setOpenDrawer(!openDrawer)}
            />

            <div className="flex items-center gap-2 border px-2 py-1 rounded-md w-80">
              <Search size={18} />
              <input
                className="outline-none w-full text-sm"
                type="text"
                placeholder="Search boards, cards..."
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={toggleTheme}>
              {theme === "light" ?
                <Moon />
              : <Sun />}
            </button>
            <Bell />
            {user?.imageUrl ?
              <img
                src={`http://localhost:8000${user.imageUrl}`}
                className="w-8 h-8 rounded-full object-cover"
              />
            : <User className="bg-gray-400 p-1 rounded-full w-8 h-8" />}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h1 className="text-xl font-bold">Boards</h1>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
