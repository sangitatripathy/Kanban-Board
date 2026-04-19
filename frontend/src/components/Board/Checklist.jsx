import React from "react";
import { X } from "lucide-react";

const Checklist = ({ onClose }) => {
  return (
    <div className="absolute top-8 right-[-5] bg-white shadow-lg rounded-lg z-50 w-64">
      <div className="flex p-1 items-center">
        <h1 className="w-80 text-center text-sm font-semibold">CheckList</h1>
        <X
          onClick={onClose}
          size={20}
          className="cursor-pointer text-gray-600"
        />
      </div>
      <hr />
      <div className="flex flex-col justify-start gap-3 p-2">
        <div className="flex flex-col">
          <label className="text-[13px]">Title</label>
          <input
            type="text"
            placeholder="Checklist"
            className="text-sm border p-1 rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-[13px] font-semibold">Copy items from...</label>
          <select name="" id="" className="p-1 border rounded-md text-sm"></select>
        </div>
        <button className="bg-blue-500 p-1 text-sm text-white rounded-md w-15">Add</button>
      </div>
    </div>
  );
};

export default Checklist;
