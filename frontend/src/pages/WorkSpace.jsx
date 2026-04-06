import React, { useState, useEffect } from "react";
import Drawer from "../components/Drawer";
import Navbar from "../components/Navbar";
import { BookOpenCheck, SquarePlus } from "lucide-react";
import { getRequest, postRequest } from "../lib/axios";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";

const WorkSpace = () => {
  const [openDrawer, setOpenDrawer] = useState(true);
  const [organization, setOrganization] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const gradients = [
    "from-blue-200 to-indigo-400",
    "from-purple-500 to-pink-500",
    "from-green-200 to-emerald-500",
    "from-orange-200 to-red-500",
  ];

  const getOrganization = async () => {
    try {
      const res = await getRequest("/org/");
      setOrganization(res);
    } catch (error) {
      console.error(error);
    }
  };

  const createOrganization = async (name) => {
    try {
      console.log(name);
      const res = await postRequest("/org/", { orgName: name });
      setOrganization((prev) => ({
        ...prev,
        org: [...prev.org, res],
      }));
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    getOrganization();
  }, [showModal]);

  return (
    <>
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
          <div>
            <div className="px-10 py-4">
              <div className="flex justify-between">
                <div className="flex gap-4">
                  <div className="bg-blue-400 w-13 h-13 flex items-center justify-center rounded-lg text-gray-100">
                    <BookOpenCheck />
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold">Workspaces</h1>
                    <p className="text-gray-500 font-light">
                      Select an organization to manage members and settings
                    </p>
                  </div>
                </div>
                <div
                  onClick={() => setShowModal(true)}
                  className="flex gap-1 h-10 items-center bg-blue-500 rounded-4xl px-4 py-1  hover:shadow-lg"
                >
                  <SquarePlus className="text-white" size={15} />
                  <button className="text-sm text-white">
                    Create Organisation
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 mt-6">
                {organization?.org?.map((org, index) => {
                  const gradient = gradients[index % gradients.length];

                  return (
                    <div
                      onClick={()=>navigate(`/workspace/work/${org._id}`)}
                      key={org._id}
                      className={`p-5 rounded-xl text-white shadow-md bg-radial-[at_25%_25%] ${gradient} h-50 w-80 hover:shadow-lg hover:-translate-y-1 transition-all duration-200`}
                    >
                      <h2 className="text-lg font-semibold text-center">
                        {org.name}
                      </h2>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          onCreate={createOrganization}
        />
      )}
    </>
  );
};

export default WorkSpace;
