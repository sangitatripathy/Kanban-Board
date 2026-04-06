import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRequest, postRequest } from "../lib/axios";
import { timeAgo } from "../utils/timeAgo";
import {
  ArrowLeft,
  Users,
  ClipboardCheck,
  ChartNoAxesCombined,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Drawer from "../components/Drawer";
import MemberList from "../components/MemberList";
import BoardList from "../components/BoardList";

const Boards = () => {
  const [boards, setBoards] = useState(null);
  const [member, setMember] = useState([]);
  const [invites, setInvites] = useState([]);
  const [org, setOrg] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(true);
  const [activeTab, setActiveTab] = useState("members");
  const { orgId } = useParams();

  const getBoards = async () => {
    const res = await getRequest(`/org/${orgId}/boards`);
    setBoards(res);
  };

  const getOrganisationName = async () => {
    const res = await getRequest(`/org/${orgId}`);
    setOrg(res);
  };

  const getMembers = async () => {
    const res = await getRequest(`/member/${orgId}`);
    setMember(res);
  };

  const getInvites = async () => {
    const res = await getRequest(`invite/org/${orgId}`);
    setInvites(res);
  };

  const sendInvite = async (email) => {
    try {
      console.log(email);
      await postRequest("/invite/", {
        email,
        orgId,
        role: "member",
      });

      getInvites();
      getMembers();
    } catch (error) {
      console.error(error);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    getBoards();
    getOrganisationName();
    getMembers();
    getInvites();
  }, [orgId]);

  console.log(boards);
  console.log(invites);

  const created = useMemo(() => timeAgo(org?.createdAt), [org]);
  return (
    <div className="flex h-screen">
      <div
        className={`transition-all duration-100 ease-in-out ${
          openDrawer ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        <Drawer />
      </div>
      <div className="flex-1 bg-gray-100/50 dark:bg-gray-800">
        <Navbar toggleDrawer={() => setOpenDrawer(!openDrawer)} />
        <div className="px-10 py-4 ">
          <div>
            <div
              onClick={() => navigate("/workspace/work")}
              className=" sm:w-115 flex justify-start gap-2 cursor-pointer items-center"
            >
              <ArrowLeft
                size={20}
                className="text-gray-500 dark:text-gray-300"
              />
              <p className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                Back to workspaces
              </p>
            </div>
            <div className="mt-5 flex gap-4 items-center">
              <h1 className="p-3 h-10 w-10 flex justify-center items-center bg-radial-[at_25%_25%] from-purple-500 to-purple-200 rounded-lg font-bold">
                {org?.name[0].toUpperCase()}
              </h1>
              <p className="font-bold">{org?.name}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-5">
            <div
              onClick={() => setActiveTab("members")}
              className="shadow-md bg-white min-h-25 rounded-lg px-3 py-2 flex items-center gap-5 transition active:scale-95"
            >
              <Users className="text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Members</p>
                <p className="text-md font-semibold">{member?.length}</p>
              </div>
            </div>

            <div
              onClick={() => setActiveTab("boards")}
              className="shadow-md bg-white min-h-25 rounded-lg px-3 py-2 flex items-center gap-5 transition active:scale-95"
            >
              <ClipboardCheck className="text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Boards</p>
                <p className="text-md font-semibold">{boards?.length}</p>
              </div>
            </div>

            <div className="shadow-md bg-white min-h-25 rounded-lg px-3 py-2 flex items-center gap-5 transition active:scale-95">
              <ChartNoAxesCombined className="text-purple-400 " />
              <div>
                <p className="text-sm text-gray-500">Analytics</p>
                <p className="text-md font-semibold">{`Created ${created}`}</p>
              </div>
            </div>
          </div>

          <div className="mt-5">
            {activeTab === "members" && (
              <MemberList
                member={member}
                invites={invites}
                onInvite={sendInvite}
              />
            )}
            {activeTab === "boards" && <BoardList boards={boards} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Boards;
