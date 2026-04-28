import React, { useState } from "react";
import {
  LayoutDashboard,
  Layers,
  Star,
  Clock,
  CircleCheckBig,
} from "lucide-react";
import { useUser } from "../context/userContext";
import { useNavigate, useLocation } from "react-router-dom";
import ConfirmModal from "./Modal/ConfirmModal";

const Drawer = () => {
  const { logoutUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;
  const menuItemClass = (path) => `
  flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors group
  ${
    isActive(path) ?
      "bg-blue-100 dark:bg-gray-700 text-blue-600"
    : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
  }
`;
  return (
    <div className="w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 rounded-tr-xl rounded-br-xl shadow-lg px-4 py-6 flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold">TaskFlow</h1>
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <div
          onClick={() => navigate("/dashboard")}
          className={menuItemClass("/dashboard")}
        >
          <LayoutDashboard size={18} className="text-inherit" />
          <span className="text-sm text-inherit">Dashboard</span>
        </div>

        <div
          onClick={() => navigate("/all-boards")}
          className={menuItemClass("/all-boards")}
        >
          <Layers size={18} className="text-inherit" />
          <span className="text-sm text-inherit">All Boards</span>
        </div>

        {/* Starred */}
        <div
          onClick={() => navigate("/all-boards")}
          className={menuItemClass("/starred-boards")}
        >
          <Star size={18} className="text-inherit" />
          <span className="text-sm text-inherit">Starred</span>
        </div>
      </div>

      {/* Workspaces */}
      <div className="mt-6">
        <p className="text-sm text-gray-500 mb-4 dark:text-white">WORKSPACES</p>

        <div className="flex flex-col gap-2">
          <div
            className={menuItemClass("/workspace/personal")}
            onClick={() => navigate("/workspace/personal")}
          >
            <div className="w-6 h-6 bg-purple-500 text-white flex items-center justify-center rounded">
              P
            </div>
            <span className="text-sm">Personal</span>
          </div>

          <div
            className={menuItemClass("/workspace/work")}
            onClick={() => navigate("/workspace/work")}
          >
            <div className="w-6 h-6 bg-blue-500 text-white flex items-center justify-center rounded">
              W
            </div>
            <span className="text-sm">Work</span>
          </div>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer text-sm">
          Team Settings
        </div>

        <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer text-sm">
          Settings
        </div>

        <div
          onClick={() => setShowLogoutModal(true)}
          className="p-2 bg-red-400 hover:bg-red-600 text-white rounded cursor-pointer text-sm"
        >
          Log Out
        </div>
      </div>
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Log out"
        description="Are you sure you want to log out?"
        confirmText="Log out"
        type="delete"
      />
    </div>
  );
};

export default Drawer;
