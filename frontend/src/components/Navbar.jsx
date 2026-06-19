import React, { useCallback } from "react";
import { Moon, Sun, Bell, User, PanelLeft, CircleCheckBig } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";

const Navbar = ({ toggleDrawer, variant = "default", hideDrawer = false }) => {
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleToggleTheme = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  const handleDrawerToggle = useCallback(() => {
    toggleDrawer();
  }, [toggleDrawer]);

  const handleProfileClick = useCallback(() => {
    navigate("/profile");
  }, [navigate]);

  return (
    <div
      className={`flex items-center justify-between shadow-sm ${
        variant === "board" ?
          "bg-linear-to-r from-purple-900 to-purple-600 text-white px-4 py-3"
        : "px-10 py-3 border-b border-gray-300 bg-white dark:bg-gray-800"
      }`}
    >
      {/* Left */}
      <div>
        {hideDrawer ?
          <div className="flex gap-2 items-center">
            <div className="bg-white px-1.5 py-1.5 flex items-center rounded-md">
              <CircleCheckBig
                size={20}
                strokeWidth={2}
                className="text-gray-700"
              />
            </div>
            <h2 className="font-semibold">TaskFlow</h2>
          </div>
        : <PanelLeft
            size={20}
            className="cursor-pointer"
            onClick={handleDrawerToggle}
          />
        }
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button onClick={handleToggleTheme}>
          {theme === "light" ?
            <Moon />
          : <Sun />}
        </button>

        <Bell />
        <div onClick={handleProfileClick}>
          {user?.imageUrl ?
            <img
              src={`${user.imageUrl}`}
              className="w-8 h-8 rounded-full object-cover"
            />
          : <div className="w-8 h-8 rounded-full bg-orange-600 flex justify-center items-center text-white">
              <p>{user?.name?.[0].toUpperCase()}</p>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Navbar;
