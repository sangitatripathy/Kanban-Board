import React, { useState } from "react";
import { timeAgo } from "../utils/timeAgo";
import { SquarePlus, Crown, Users } from "lucide-react";
import InviteModal from "./InviteModal";

const MemberList = ({ member = [], invites = [],onInvite }) => {
  const [openModal, setOpenModal] = useState(false);
  const [tab, setTab] = useState("teamMember");

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setOpenModal(true)}
          className="flex gap-1 items-center text-sm rounded-3xl bg-blue-500 text-white px-4 py-2  hover:shadow-lg"
        >
          <SquarePlus size={16} />
          Invite Member
        </button>
      </div>

      <div className="flex gap-6 border-b mb-4">
        <button
          onClick={() => setTab("teamMember")}
          className={`pb-2 ${
            tab === "teamMember"
              ? "border-b-2 border-blue-500 font-semibold"
              : "text-gray-500"
          }`}
        >
          Team Members ({member.length})
        </button>

        <button
          onClick={() => setTab("invitedMember")}
          className={`pb-2 ${
            tab === "invitedMember"
              ? "border-b-2 border-blue-500 font-semibold"
              : "text-gray-500"
          }`}
        >
          Invited Members ({invites.length})
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        
        {tab === "teamMember" &&
          member.map((m) => (
            <div
              key={m.userId}
              className="flex justify-between items-center px-6 py-4 border-b last:border-none"
            >

              <div className="flex items-center gap-4">

                <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
                  {m.imageUrl ? (
                    <img
                      src={m.imageUrl}
                      alt={m.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-semibold">
                      {m.name?.[0]?.toUpperCase()}
                    </span>
                  )}
                </div>

                <div>
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-[12px] text-gray-500 font-light">{m.email}</p>
                  <p className="text-[12px] text-gray-400">
                    Joined {timeAgo(m.createdAt)}
                  </p>
                </div>
              </div>

              <div>
                {m.role === "admin" && (
                  <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
                    <Crown size={14} />
                    Admin
                  </div>
                )}

                {m.role === "member" && (
                  <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                    <Users size={14} />
                    Member
                  </div>
                )}
              </div>
            </div>
          ))}

        {tab === "invitedMember" &&
          invites.map((inv) => (
            <div
              key={inv._id}
              className="flex justify-between items-center px-6 py-4 border-b last:border-none"
            >
              <div>
                <p className="font-semibold">{inv.email}</p>
                <p className="text-xs text-gray-400">
                  Invited • {inv.status}
                </p>
              </div>

              <div
                className={`px-3 py-1 rounded-full text-xs ${
                  inv.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {inv.status}
              </div>
            </div>
          ))}
      </div>

      {openModal && (
        <InviteModal onClose={() => setOpenModal(false)} onCreate={onInvite} />
      )}
    </>
  );
};

export default MemberList;