import React, { useState } from "react";
import { X } from "lucide-react";
import { putRequest } from "@/lib/axios";

const Checklist = ({ cardId, onClose, handleChecklist }) => {
  const [title, setTitle] = useState("");

  const handleAddCheckList = async () => {
    try {
      const res = await putRequest(`/card/${cardId}/checklist/`, {
        title,
      });
      handleChecklist(cardId, res);
      onClose();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="absolute top-8 right-[-5] bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg rounded-lg z-50 w-64">
      <div className="flex p-1 items-center">
        <h1 className="w-80 text-center text-sm font-semibold text-gray-900 dark:text-white">
          CheckList
        </h1>

        <X
          onClick={onClose}
          size={20}
          className="cursor-pointer text-gray-600 dark:text-gray-400"
        />
      </div>

      <hr className="border-gray-200 dark:border-gray-700" />

      <div className="flex flex-col justify-start gap-3 p-2">
        {/* Title */}
        <div className="flex flex-col">
          <label className="text-[13px] text-gray-700 dark:text-gray-300">
            Title
          </label>

          <input
            type="text"
            placeholder="Checklist"
            className="text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-1 rounded-md placeholder-gray-400"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Copy items */}
        <div className="flex flex-col">
          <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300">
            Copy items from...
          </label>

          <select className="p-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md text-sm"></select>
        </div>

        {/* Button */}
        <button
          onClick={handleAddCheckList}
          className="bg-blue-500 p-1 text-sm text-white rounded-md w-15"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default Checklist;
