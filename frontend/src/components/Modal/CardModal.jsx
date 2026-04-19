import React, { useState } from "react";
import {
  X,
  Clock,
  User,
  Paperclip,
  MessageSquareMore,
  Ellipsis,
  SquareCheck,
  RectangleEllipsis,
} from "lucide-react";
import Label from "../Board/LabelDropdown";
import Checklist from "../Board/Checklist";
import Calendar from "../Board/Calendar";
import Attachment from "../Board/Attachment";
import Members from "../Board/Members";

const CardModal = ({ card, onClose }) => {
  if (!card) return null;
  const [activeDropdown, setActiveDropdown] = useState(null);

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
        <div className="flex items-stretch h-full">
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
                <Checklist onClose={() => setActiveDropdown(null)} />
              )}
              {activeDropdown == "members" && (
                <Members onClose={() => setActiveDropdown(null)} />
              )}
              {activeDropdown == "attachment" && (
                <Attachment onClose={() => setActiveDropdown(null)} />
              )}
              {activeDropdown === "date" && (
                <Calendar onClose={() => setActiveDropdown(null)} />
              )}
              {activeDropdown == "label" && (
                <Label onClose={() => setActiveDropdown(null)} />
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
          </div>

          {/* Right Div */}
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
