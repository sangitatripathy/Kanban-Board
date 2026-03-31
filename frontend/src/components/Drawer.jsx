import React from "react";
import { LayoutDashboard, Layers, Star, Clock } from "lucide-react";
import { useUser} from "../context/userContext";
import { useNavigate } from "react-router-dom";

const Drawer = () => {
  const {logoutUser} = useUser()
  const navigate = useNavigate();

  const handleLogout = () =>{
    logoutUser()
    navigate("/")
  }

  return (
    <div className="w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 rounded-tr-xl rounded-br-xl shadow-lg px-4 py-6 flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold">TaskFlow</h1>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-100 dark:bg-gray-700">
          <LayoutDashboard size={18} />
          <span className="text-sm">Dashboard</span>
        </div>

        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200">
          <Layers size={18} />
          <span className="text-sm">All Boards</span>
        </div>

        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200">
          <Star size={18} />
          <span className="text-sm">Starred</span>
        </div>

        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200">
          <Clock size={18} />
          <span className="text-sm">Recent</span>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-500 mb-4">WORKSPACES</p>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-500 text-white flex items-center justify-center rounded">
              P
            </div>
            <span className="text-sm">Personal</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 text-white flex items-center justify-center rounded">
              W
            </div>
            <span className="text-sm">Work</span>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-auto flex flex-col gap-2">
        <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer text-sm">
          Team Settings
        </div>
        <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer text-sm">
          Settings
        </div>
        <div onClick={handleLogout} className="p-2 bg-red-400 hover:bg-red-600 text-white rounded cursor-pointer text-sm">
          Log Out
        </div>
      </div>
    </div>
  );
};

export default Drawer;
