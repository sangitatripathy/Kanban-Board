import React, { useState } from "react";
import InviteModal from "./InviteModal";
import { SquarePlus } from "lucide-react";
import { timeAgo } from "@/utils/timeAgo";
import { useNavigate } from "react-router-dom";

const BoardList = ({ boards = [], onCreateBoard }) => {
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();

  const gradients = [
    "from-blue-200 to-indigo-400",
    "from-purple-500 to-pink-500",
    "from-green-200 to-emerald-500",
    "from-orange-200 to-red-500",
  ];

  return (
    <>
      <div>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setOpenModal(true)}
            className="flex gap-1 items-center text-sm rounded-3xl bg-blue-500 text-white px-4 py-2 hover:shadow"
          >
            <SquarePlus size={15} />
            Create a Board
          </button>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 min-h-50">
          {boards.map((board, index) => {
            const gradient = gradients[index % gradients.length];
            return (
              <div
                key={board._id}
                onClick={()=>navigate(`/board/${board._id}`)}
                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer"
              >
                <div
                  className={`h-35 rounded-t-xl bg-gradient-to-r ${gradient}`}
                />

                <div className="p-2">
                  <h2 className="font-normal text-gray-800">
                    {board.boardName}
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    Created {timeAgo(board.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {openModal && (
        <InviteModal
          onClose={() => setOpenModal(false)}
          onCreate={onCreateBoard}
          title="Create Board"
          placeholder="Enter board name"
          buttonText="Create"
        />
      )}
    </>
  );
};

export default BoardList;
