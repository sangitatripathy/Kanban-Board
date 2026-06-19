import { useState, useCallback } from "react";

const AddColumn = ({ onAdd, message, btnText }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = useCallback(() => {
    if (!title.trim()) return;
    onAdd(title);
    setTitle("");
    setOpen(false);
  }, [title, onAdd]);

  const handleOpenClick = useCallback(() => {
    setOpen(true);
  }, []);

  const handleCancelClick = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <div className="w-66 shrink-0">
      {!open ?
        <button
          onClick={handleOpenClick}
          className="w-full bg-blue-500 hover:bg-blue-600 text-sm px-2 py-1 rounded-xl text-center text-white"
        >
          + {message}
        </button>
      : <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter list title..."
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-1 rounded-xl mb-2 text-[13px]"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-3 py-1 rounded-xl text-[13px]"
            >
              Save
            </button>
            <button
              onClick={handleCancelClick}
              className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-3 text-[13px] rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      }
    </div>
  );
};

export default AddColumn;
