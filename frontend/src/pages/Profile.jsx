import React, { useState } from "react";
import { useUser } from "@/context/userContext";
import Drawer from "../components/Drawer";
import Navbar from "../components/Navbar";
import { User, Camera, Mail, Calendar } from "lucide-react";

const Profile = () => {
  const { user } = useUser();
  const [openDrawer, setOpenDrawer] = useState(true);
  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  console.log(user);
  return (
    <div className="flex h-screen">
      <div
        className={`transition-all duration-100 ease-in-out ${
          openDrawer ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        <Drawer />
      </div>
      <div className="flex-1">
        <Navbar toggleDrawer={() => setOpenDrawer(!openDrawer)} />
        <div className="px-8 pt-5 bg-gray-200/50 min-h-screen">
          <div>
            <h1 className="text-2xl font-semibold">Profile Settings</h1>
            <p className="text-sm text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>
          <div className="bg-white py-4 rounded-md px-4 mt-5">
            <div>
              <p className="flex gap-2 items-center font-semibold">
                <span>
                  <User size={18} />
                </span>
                Personal Information
              </p>
              <p className="text-gray-500 text-xs">
                Update your profile information and photo
              </p>
            </div>
            <div className="mt-5">
              <div className="flex gap-10">
                {user?.imageUrl ?
                  <img src={user.imageUrl} alt="" />
                : <p className="bg-orange-500 h-15 w-15 rounded-full flex items-center justify-center text-white text-lg">
                    {user?.name?.[0]?.toUpperCase()}
                  </p>
                }
                <div>
                  <p className="text-[15px] font-semibold">{user?.name}</p>
                  <p className="text-gray-600 text-sm">{user?.email}</p>
                  <button className="flex gap-2 text-black items-center text-sm border px-2 py-1 mt-4 rounded-md">
                    <Camera size={15} />
                    Upload photo
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-3 mt-5">
                <div className="flex gap-1 flex-col">
                  <label className="font-semibold text-sm">Full Name</label>
                  <input
                    className="outline-none py-1 px-3 border border-gray-400 rounded-lg text-gray-800 text-sm"
                    type="text"
                    value={name}
                    name={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="flex gap-1 flex-col">
                  <label className="font-semibold text-sm">Email Address</label>
                  <input
                    className="outline-none py-1 px-3 border border-gray-400 rounded-lg text-gray-800 text-sm"
                    type="email"
                    value={email}
                    name={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
