import React, { useState } from "react";
import {
  X,
  Clock,
  User,
  Paperclip,
  MessageSquareMore,
  Ellipsis,
  EllipsisVertical,
  SquareCheck,
  RectangleEllipsis,
} from "lucide-react";
import Label from "../Board/LabelDropdown";
import Checklist from "../Board/Checklist";
import Calendar from "../Board/Calendar";
import Attachment from "../Board/Attachment";
import Members from "../Board/Members";
import { putRequest,deleteRequest } from "@/lib/axios";

const CardModal = ({
  card,
  onClose,
  board,
  updateBoardLabels,
  assignLabels,
  dateSave,
  handleChecklist,
}) => {
  if (!card) return null;
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeInput, setActiveInput] = useState(null);
  const [itemText, setItemText] = useState("");
  const [activeMenu, setactiveMenu] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editText, setEditText] = useState("");

  const handleAddItem = async (checklistId) => {
    try {
      const res = await putRequest(
        `/card/${card._id}/checklist/${checklistId}/item`,
        {
          itemText,
        },
      );
      handleChecklist(card._id, res);
      setItemText("");
      setActiveInput(null);
    } catch (error) {
      console.error(error.message);
    }
  };

  const updateItem = async (checklistId, itemId) => {
    try {
      const res = await putRequest(
        `/card/${card._id}/checklist/${checklistId}/item/${itemId}`,
        {
          text: editText,
        },
      );
      handleChecklist(card._id, res);
      setactiveMenu(null);
    } catch (error) {
      console.error(error.message);
    }
  };

  const deleteItem = async (checklistId, itemId) => {
    try {
      const res = await deleteRequest(
        `/card/${card._id}/checklist/${checklistId}/item/${itemId}`,
      );
      console.log(res)
      handleChecklist(card._id, res);
      setactiveMenu(null);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 flex justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white min-w-[75%] mt-10 rounded-xl shadow-lg h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4">
          <div className="flex gap-4">
            <Ellipsis className="text-gray-600" size={20} />
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <hr className="w-full" />

        <div className="flex h-full overflow-hidden">
          {/* left div */}
          <div className="flex flex-col gap-3 p-6 w-[50%] border-r border-gray-300 overflow-y-auto">
            <h1 className="text-lg font-semibold text-gray-800">
              {card.cardName}
            </h1>
            <div className="flex gap-2 relative">
              <button
                className="flex items-center gap-1 border border-gray-400 py-0.5 px-1 rounded-sm"
                onClick={() => setActiveDropdown("members")}
              >
                <User size={15} className="text-gray-600" />
                <p className="text-[13px]">Members</p>
              </button>

              <button
                className="flex items-center gap-1 border border-gray-400 py-0.5 px-1 rounded-sm"
                onClick={() => setActiveDropdown("checklist")}
              >
                <SquareCheck size={15} className="text-gray-600" />
                <p className="text-[13px]">Checklist</p>
              </button>

              <button
                className="flex items-center gap-1 border border-gray-400 py-0.5 px-1 rounded-sm"
                onClick={() => setActiveDropdown("attachment")}
              >
                <Paperclip size={15} className="text-gray-600" />
                <p className="text-[13px]">Attachment</p>
              </button>
              <button
                className="flex items-center gap-1 border border-gray-400 py-0.5 px-1 rounded-sm"
                onClick={() => setActiveDropdown("date")}
              >
                <Clock size={15} className="text-gray-600" />
                <p className="text-[13px]">Dates</p>
              </button>

              <button
                className="flex items-center gap-1 border border-gray-400 py-0.5 px-1 rounded-sm"
                onClick={() => setActiveDropdown("label")}
              >
                <p className="text-[13px]">Label</p>
              </button>

              {activeDropdown == "checklist" && (
                <Checklist
                  cardId={card._id}
                  onClose={() => setActiveDropdown(null)}
                  handleChecklist={handleChecklist}
                />
              )}
              {activeDropdown == "members" && (
                <Members onClose={() => setActiveDropdown(null)} />
              )}
              {activeDropdown == "attachment" && (
                <Attachment onClose={() => setActiveDropdown(null)} />
              )}
              {activeDropdown === "date" && (
                <Calendar
                  onClose={() => setActiveDropdown(null)}
                  cardId={card._id}
                  dateSave={dateSave}
                />
              )}
              {activeDropdown == "label" && (
                <Label
                  onClose={() => setActiveDropdown(null)}
                  updateBoardLabels={updateBoardLabels}
                  assignLabels={assignLabels}
                  card={card}
                  board={board}
                />
              )}
            </div>
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              {/* LABELS */}
              {card.labels?.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {card.labels.map((label) => (
                    <div
                      key={label._id}
                      className={`h-6 px-2 rounded text-white text-xs flex items-center ${label.color}`}
                      style={{ backgroundColor: label.color }}
                    >
                      {label.name}
                    </div>
                  ))}
                </div>
              )}

              {card.dueDate && (
                <div className="flex gap-2 text-xs text-gray-700 bg-gray-200 px-2 py-1 rounded">
                  <span>
                    Due:{" "}
                    {(() => {
                      const date = new Date(card.dueDate);

                      const hasTime =
                        date.getHours() !== 0 || date.getMinutes() !== 0;

                      return date.toLocaleString("en-US", {
                        month: "short", // Sep
                        day: "numeric", // 12
                        year: "numeric", // 2026
                        ...(hasTime && {
                          hour: "numeric",
                          minute: "2-digit",
                        }),
                      });
                    })()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 mt-4">
                <RectangleEllipsis />
                <h3>Description</h3>
              </div>
              <textarea
                className="border border-gray-600 py-2 px-4 w-full rounded-md text-sm"
                placeholder="Add a more detailed description..."
              ></textarea>
            </div>

            <div className="mt-4 flex flex-col gap-4">
              {card.checklist?.map((list) => {
                const completed = list.items.filter((i) => i.completed).length;
                const total = list.items.length;
                const percent = total === 0 ? 0 : (completed / total) * 100;

                return (
                  <div key={list._id} className="p-2 rounded-md">
                    <h3 className="text-sm mb-1 font-medium">{list.title}</h3>

                    <div className="mb-2 flex gap-1 items-center">
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {completed} / {total}
                      </span>

                      <div className="w-full bg-gray-300 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {list.items.map((item) => (
                        <div key={item._id} className="flex items-start gap-2">
                          <div className="flex gap-2 flex-1 min-w-0">
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => {}}
                            />
                            {editingItem === item._id ?
                              <div className="flex flex-col gap-2 w-full">
                                <input
                                  type="text"
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  className="border p-0.5 rounded text-sm w-full"
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      setEditingItem(null);
                                      setEditText("");
                                      updateItem(list._id, item._id);
                                    }}
                                    className="bg-blue-500 text-white text-[13px] px-2 py-0.5 rounded-xl text-sm"
                                  >
                                    Update
                                  </button>

                                  <button
                                    onClick={() => {
                                      setactiveMenu(null);
                                      setEditingItem(null);
                                      setEditText("");
                                    }}
                                    className="text-gray-600 text-[13px] px-2 py-0.5 rounded-xl bg-gray-200"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            : <p
                                className={`text-sm ${item.completed ? "line-through" : ""}`}
                              >
                                {item.text}
                              </p>
                            }
                          </div>
                          <div className="relative">
                            <EllipsisVertical
                              size={18}
                              className="text-gray-700"
                              onClick={() =>
                                setactiveMenu(
                                  activeMenu === item._id ? null : item._id,
                                )
                              }
                            />
                            {activeMenu === item._id && (
                              <div className="absolute right-4 bottom-[-4] bg-white border rounded shadow-md z-10 w-24">
                                <button
                                  className="block w-full text-left text-[13px] px-3 py-1 text-sm hover:bg-blue-100"
                                  onClick={() => {
                                    setEditingItem(item._id);
                                    setEditText(item.text);
                                    setActiveItemMenu(null);
                                  }}
                                >
                                  Update
                                </button>

                                <button
                                  className="block w-full text-left text-[13px] px-3 py-1 text-sm text-red-500 hover:bg-red-200"
                                  onClick={() => {
                                    deleteItem(list._id,item._id);
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {activeInput === list._id ?
                      <div className="mt-2 flex flex-col gap-2">
                        <input
                          type="text"
                          value={itemText}
                          onChange={(e) => setItemText(e.target.value)}
                          className="p-1 text-sm border rounded"
                        />

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddItem(list._id)}
                            className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => {
                              setActiveInput(null);
                              setItemText("");
                            }}
                            className="text-gray-600 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    : <button
                        onClick={() => setActiveInput(list._id)}
                        className="mt-2 text-sm bg-gray-200 px-2 py-1 rounded"
                      >
                        Add an item
                      </button>
                    }
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-6 bg-gray-100 w-[50%]">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <MessageSquareMore size={20} className="text-gray-500" />
                <p className="text-gray-700 text-md">Comments and activity</p>
              </div>
              <button className="bg-gray-200 px-2 py-1 rounded-md text-sm">
                Show details
              </button>
            </div>
            <input
              type="text"
              placeholder="Write a comment"
              className="px-2 py-1.5 bg-white w-full rounded-md text-sm mt-3 border-none outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
