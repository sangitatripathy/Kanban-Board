import React from "react";
import { X } from "lucide-react";
import { putRequest } from "@/lib/axios";

const Members = ({ onClose, board, card, onUpdate }) => {
  const handleToggle = async (userId) => {
    try {
      const res = await putRequest(`/card/${card._id}/members/`, {
        userId,
      });
      onUpdate(card._id, res.assignees);
    } catch (err) {
      console.error(err);
    }
  };

  const isAssigned = (userId) => {
    return card.assignees?.some((id) => id.toString() === userId.toString());
  };

  return (
    <div className="absolute top-8 right-[-10] bg-white shadow-lg rounded-lg z-50 w-64">
      <div className="flex p-1 items-center">
        <h1 className="w-80 text-center text-sm font-semibold">Members</h1>
        <X
          onClick={onClose}
          size={20}
          className="cursor-pointer text-gray-600"
        />
      </div>

      <hr />

      <div className="p-2 flex flex-col gap-2">
        <input
          type="text"
          placeholder="Search Members"
          className="border p-1 rounded-md text-sm w-full"
        />

        <div className="flex flex-col">
          <h3 className="text-xs mb-1">Board Members</h3>

          {board.members.map((member) => {
            const assigned = isAssigned(member.user._id);

            return (
              <div
                key={member.user._id}
                onClick={() => handleToggle(member.user._id)}
                className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer ${
                  assigned ? "bg-green-100" : "hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  {member.user.imageUrl ?
                    <img
                      src={member.user.imageUrl}
                      className="w-9 h-9 rounded-full"
                    />
                  : <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                      {member.user.name?.[0]}
                    </div>
                  }

                  <p className="text-sm">{member.user.name}</p>
                </div>
                {assigned && <span className="text-green-600 text-sm">✓</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Members;
