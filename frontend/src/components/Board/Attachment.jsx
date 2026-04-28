import React, { useRef } from "react";
import { X } from "lucide-react";

const Attachment = ({ onClose }) => {
  const fileInputref = useRef(null);

  const handleClick = () => {
    fileInputref.current.click();
  };

  const handleFileChange = (event) => {};

  return (
    <div className="absolute top-8 right-30 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg rounded-lg z-50 w-64">
      <div className="flex p-1 items-center">
        <h1 className="w-80 text-center text-sm font-semibold text-gray-900 dark:text-white">
          Attachment
        </h1>

        <X
          onClick={onClose}
          size={20}
          className="cursor-pointer text-gray-600 dark:text-gray-400"
        />
      </div>

      <hr className="border-gray-200 dark:border-gray-700" />

      <div className="p-2">
        <div className="flex flex-col gap-3">
          <h1 className="text-[13px] text-gray-900 dark:text-gray-200">
            Attach a file from your computer
          </h1>

          <p className="text-[11px] text-gray-600 dark:text-gray-400">
            You can also drag and drop files to upload them.
          </p>

          <input
            type="file"
            className="hidden"
            ref={fileInputref}
            onChange={handleFileChange}
          />

          <button
            onClick={handleClick}
            className="bg-blue-500 text-white py-1 px-4 rounded text-sm hover:bg-blue-700 transition-colors"
          >
            Choose a file
          </button>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* Link input */}
        <div className="flex flex-col gap-1 mt-3">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Search or paste a link
          </label>

          <input
            type="text"
            placeholder="Paste a link"
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-1 rounded-md text-sm placeholder-gray-400"
          />
        </div>

        {/* Display text */}
        <div className="flex flex-col mt-3">
          <label className="text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
            Display text(optional)
          </label>

          <input
            type="text"
            placeholder="Text to display"
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-1 rounded-md text-sm placeholder-gray-400"
          />

          <p className="text-[10px] text-gray-400 dark:text-gray-500">
            Give this link a title or description
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-3">
          <button className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-black dark:text-white text-[13px] px-2 py-1 rounded-md">
            Cancel
          </button>

          <button className="bg-blue-500 hover:bg-blue-600 text-white text-[13px] px-2 py-1 rounded-md">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Attachment;
