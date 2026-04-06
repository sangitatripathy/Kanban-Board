import React, { useState } from "react";

const InviteModal = ({ onClose, onCreate }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = () =>{
    if(!email) return
    onCreate(email)
    setEmail("");
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-100 shadow-xl">
        <h2 className="text-md font-semibold mb-4">Invite Member</h2>
        <input
          type="email"
          placeholder="johndoe@gmail.com"
          className="w-full border rounded-lg px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-blue-400 text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-2xl bg-gray-200 hover:bg-red-400 hover:text-white text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-3 py-1 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white text-sm"
          >
            Send Invite 
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
