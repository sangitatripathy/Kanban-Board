import { useState } from "react";

const AddColumn = ({ onAdd,message,btnText }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd(title);
    setTitle("");
    setOpen(false);
  };

  return (
    <div className="w-66 shrink-0">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-sm px-2 py-1 rounded-xl text-center text-white"
        >
          + {message}
        </button>
      ) : (
        <div className="bg-white p-3 rounded-xl shadow">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter list title..."
            className="w-full border p-1 rounded-xl mb-2 text-[13px]"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-3 py-1 rounded-xl text-[13px]"
            >
              Save
            </button>
            <button onClick={() => setOpen(false)} className="bg-gray-200 px-3 text-[13px] rounded-xl">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddColumn;