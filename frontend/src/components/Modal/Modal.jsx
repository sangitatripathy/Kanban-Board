import React, { useState } from "react";

const Modal = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");

  const handleSubmit=() =>{
    if(!name.trim()) return
    onCreate(name)
    setName("")
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-100 shadow-xl">
        <h2 className="text-md font-semibold mb-4">Create Organization</h2>
        <input
          type="text"
          placeholder="Enter organization name"
          className="w-full border rounded-lg px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-blue-400 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm rounded-2xl bg-gray-200  hover:bg-red-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-3 py-1 rounded-2xl bg-blue-500 text-white text-sm"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
