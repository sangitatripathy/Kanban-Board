import React from "react";
import { Moon, Sun, Bell, User, PanelLeft } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useUser } from "../context/userContext";

const Navbar = ({ toggleDrawer }) => {
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center justify-between px-10 py-3 border-b border-gray-300 shadow-sm bg-white dark:bg-gray-800">
      
      {/* Left */}
      <div className="flex gap-4 items-center">
        <PanelLeft
          size={20}
          className="cursor-pointer"
          onClick={toggleDrawer}
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button onClick={toggleTheme}>
          {theme === "light" ? <Moon /> : <Sun />}
        </button>

        <Bell />

        {user?.imageUrl ? (
          <img
            src={`http://localhost:8000${user.imageUrl}`}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <User className="bg-gray-400 p-1 rounded-full w-8 h-8" />
        )}
      </div>
    </div>
  );
};

export default Navbar;