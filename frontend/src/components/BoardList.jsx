import React, { useState } from "react";
import InviteModal from "./Modal/InviteModal";
import ConfirmModal from "./Modal/ConfirmModal"; // 🔥 NEW
import { Plus, EllipsisVertical } from "lucide-react";
import { timeAgo } from "@/utils/timeAgo";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { putRequest, deleteRequest } from "@/lib/axios";

const BoardList = ({ boards = [], onCreateBoard }) => {
  const [openModal, setOpenModal] = useState(false);
  const [tab, setTab] = useState("active");
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    action: null,
    boardId: null,
  });

  const navigate = useNavigate();

  const gradients = [
    "from-blue-200 to-indigo-400",
    "from-purple-500 to-pink-500",
    "from-green-200 to-emerald-500",
    "from-orange-200 to-red-500",
  ];

  const filteredBoards = boards.filter((b) =>
    tab === "active" ? !b.isArchived : b.isArchived,
  );

  const handleConfirm = async () => {
    const { action, boardId } = confirmModal;

    try {
      await putRequest(`/org/board/${boardId}/action?action=${action}`);

      setConfirmModal({ open: false });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-4">
          <Tabs
            defaultValue="active"
            value={tab}
            onValueChange={(val) => setTab(val)}
          >
            <TabsList variant="line">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
          </Tabs>

          {onCreateBoard && tab === "active" && (
            <button
              onClick={() => setOpenModal(true)}
              className="flex gap-1 items-center text-sm rounded-3xl bg-blue-500 text-white px-4 py-2 hover:shadow"
            >
              <Plus size={15} />
              Create a Board
            </button>
          )}
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 min-h-50">
          {filteredBoards.map((board, index) => {
            const gradient = gradients[index % gradients.length];

            return (
              <div
                key={board._id}
                className="relative bg-white rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer"
                onClick={() => navigate(`/board/${board._id}`)}
              >
                <div
                  className={`h-35 rounded-t-xl bg-linear-to-r ${gradient}`}
                />

                <div className="flex justify-between p-2 items-center">
                  <div>
                    <h2 className="font-normal text-gray-800">
                      {board.boardName}
                    </h2>

                    <p className="text-xs text-gray-500 mt-1">
                      Created {timeAgo(board.createdAt)}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 rounded hover:bg-gray-100"
                      >
                        <EllipsisVertical
                          size={20}
                          className="text-gray-600 cursor-pointer"
                        />
                      </div>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      className="w-32"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {!board.isArchived ?
                        <DropdownMenuItem
                          onClick={() =>
                            setConfirmModal({
                              open: true,
                              action: "archive",
                              boardId: board._id,
                            })
                          }
                        >
                          Archive
                        </DropdownMenuItem>
                      : <DropdownMenuItem
                          onClick={() =>
                            setConfirmModal({
                              open: true,
                              action: "unarchive",
                              boardId: board._id,
                            })
                          }
                        >
                          Restore
                        </DropdownMenuItem>
                      }

                      <DropdownMenuItem
                        onClick={() =>
                          setConfirmModal({
                            open: true,
                            action: "delete",
                            boardId: board._id,
                          })
                        }
                        className="text-red-600"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </div>

        {filteredBoards.length === 0 && (
          <div className="text-center text-gray-500 mt-10 text-sm">
            No {tab} boards found
          </div>
        )}
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

      <ConfirmModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false })}
        onConfirm={handleConfirm}
        title={
          confirmModal.action === "delete" ? "Delete Board"
          : confirmModal.action === "archive" ?
            "Archive Board"
          : "Restore Board"
        }
        description={
          confirmModal.action === "delete" ?
            "Are you sure you want to delete this board?"
          : confirmModal.action === "archive" ?
            "Are you sure you want to archive this board?"
          : "Are you sure you want to restore this board?"
        }
        confirmText={
          confirmModal.action === "delete" ? "Delete"
          : confirmModal.action === "archive" ?
            "Archive"
          : "Restore"
        }
        type={confirmModal.action === "delete" ? "delete" : "default"}
      />
    </>
  );
};

export default BoardList;
