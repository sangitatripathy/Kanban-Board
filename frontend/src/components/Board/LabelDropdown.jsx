import React, { useEffect, useState } from "react";
import { SquarePen, X, ChevronLeft } from "lucide-react";
import { putRequest } from "@/lib/axios";

const trelloColors = [
  "#7BC8A4",
  "#E6D46A",
  "#E8C97A",
  "#E7B8B5",
  "#CBB4D4",
  "#4FBF8F",
  "#F2D12E",
  "#FFA500",
  "#F36C60",
  "#A86AD7",
  "#2E8B57",
  "#A67C00",
  "#CC7000",
  "#D63C2E",
  "#8E44AD",
  "#A9BBD4",
  "#9FC3CF",
  "#B9D98A",
  "#DDB6CF",
  "#C4C4C4",
  "#5B8FD9",
  "#63AFC7",
  "#8BC34A",
  "#D96AA7",
  "#8A8D93",
  "#2D6CC4",
  "#2F7F99",
  "#5A7F2B",
  "bg-gray-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-purple-500",
  "bg-yellow-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-red-500",
];

const Label = ({ onClose, updateBoardLabels, assignLabels, card, board }) => {
  const [view, setView] = useState("list");
  const [selectedColor, setSelectedColor] = useState(null);
  const [title, setTitle] = useState("");
  const [editingLabel, setEditingLabel] = useState(null);

  const existingLabel = card?.labels || [];
  const boardLabels = board?.labels || [];

  const selected = boardLabels.filter((bl) =>
    existingLabel.some((l) => l._id === bl._id),
  );

  const remaining = boardLabels.filter(
    (bl) => !existingLabel.some((l) => l._id === bl._id),
  );

  const allLabels = [...selected, ...remaining];

  const handleSaveLabel = async () => {
    try {
      let res;

      if (view === "edit") {
        res = await putRequest(
          `/card/${board._id}/labels/${editingLabel._id}`,
          {
            color: selectedColor,
            name: title,
          },
        );
      } else {
        res = await putRequest(`/card/${board._id}/labels/`, {
          color: selectedColor,
          name: title,
        });
      }
      console.log(res);
      if (res) {
        updateBoardLabels(res);
        setTitle("");
        setEditingLabel(null);
        setView("list");
      }
    } catch (error) {
      console.error("Error saving label:", error);
    }
  };

  const handleToggleLabel = async (item) => {
    const isSelected = existingLabel.some((l) => l._id === item._id);

    let updatedLabels;

    if (isSelected) {
      updatedLabels = existingLabel.filter((l) => l._id !== item._id);
    } else {
      updatedLabels = [...existingLabel, item];
    }

    await putRequest(`/org/board/${board._id}/card/${card._id}`, {
      labels: updatedLabels.map((l) => l._id),
    });
    console.log(updatedLabels)
    assignLabels(card._id, updatedLabels);
  };

  return (
    <div className="absolute top-8 right-0 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg rounded-lg z-50 w-64">
      {view === "list" && (
        <div>
          <div className="flex justify-between p-2">
            <h1 className="text-[13px] font-semibold text-gray-900 dark:text-white">Labels</h1>
            <X
              onClick={onClose}
              size={15}
              className="cursor-pointer text-gray-600 dark:text-gray-400"
            />
          </div>
          <hr className="border-gray-200 dark:border-gray-700" />
          <div className="p-2">
            <div className="flex flex-col gap-2">
              {allLabels.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="checkbox"
                    checked={existingLabel.some((l) => l._id === item._id)}
                    onChange={() => handleToggleLabel(item)}
                  />
                  <div
                    className={`h-6 w-80 rounded cursor-pointer flex items-center justify-center ${item.color}`}
                    style={{ backgroundColor: item.color }}
                  >
                    {" "}
                    <p className="text-white text-xs">{item?.name}</p>
                  </div>
                  <SquarePen
                    onClick={() => {
                      setView("edit");
                      setSelectedColor(item.color);
                      setTitle(item.name || "");
                      setEditingLabel(item);
                    }}
                    size={20}
                    className="text-gray-600"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setView("create");
                setSelectedColor("#E7B8B5");
              }}
              className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 mt-3 w-full p-1 rounded-md text-[13px]"
            >
              Create a new label
            </button>
          </div>
        </div>
      )}
      {(view === "edit" || view == "create") && (
        <div>
          <div className="flex items-center justify-between p-2">
            <ChevronLeft size={15} onClick={() => setView("list")} />
            <p className="text-[13px] font-semibold text-gray-900 dark:text-white">
              {view == "edit" ? "Edit Label" : "Create Label"}
            </p>
            <X
              onClick={onClose}
              size={15}
              className="cursor-pointer text-gray-600"
            />
          </div>
          <hr />

          <div className="h-18 bg-gray-200  dark:bg-gray-800 flex justify-center items-center">
            <div
              style={{ backgroundColor: selectedColor }}
              className={`h-8 w-50 rounded ${selectedColor}`}
            ></div>
          </div>

          <div className="p-2 mt-2">
            <div className="flex flex-col">
              <label className="text-[13px] mb-1 text-gray-700 dark:text-gray-300">Title</label>
              <input
                type="text"
                value={title}
                className="border border-gray-500 p-1 rounded-md outline-none text-sm"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <h1 className="text-[13px] text-gray-700 dark:text-gray-300">Select a color</h1>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {trelloColors.map((color, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`h-8 w-8 rounded flex items-center justify-center cursor-pointer relative ${color}`}
                    style={{ backgroundColor: color }}
                  >
                    {selectedColor === color && (
                      <span className="text-white text-sm font-bold">✔</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={handleSaveLabel}
              className=" text-[13px] bg-blue-500 hover:bg-blue-600 w-full text-white mt-3 p-1 rounded-md"
            >
              {view === "edit" ? "Update" : "Create"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Label;
