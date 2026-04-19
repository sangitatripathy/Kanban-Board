import React, { useEffect, useState } from "react";
import { SquarePen, X, ChevronLeft } from "lucide-react";

const colors = [
  "bg-red-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-gray-500",
];

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
  "#A64D79",
  "#6B6F75",
  "#1E4FA1",
  "#276C80",
  "#4E6E22",
  "#8E3E6D",
  "#5C6066",
  "#3A3F45",
];

const Label = ({ onClose }) => {
  const [view, setView] = useState("list");
  const [selectedColor, setSelectedColor] = useState(null);
  const [title, setTitle] = useState("");

  return (
    <div className="absolute top-8 right-0 bg-white shadow-lg rounded-lg z-50 w-64">
      {view === "list" && (
        <div>
          <div className="flex justify-between p-2">
            <h1 className="text-[13px] font-semibold">Labels</h1>
            <X
              onClick={onClose}
              size={15}
              className="cursor-pointer text-gray-600"
            />
          </div>
          <hr />
          <div className="p-2">
            <div className="flex flex-col gap-2">
              {colors.map((color, i) => (
                <div key={i} className="flex gap-2">
                  <input type="checkbox" />
                  <div
                    className={`h-6 w-80 rounded cursor-pointer ${color}`}
                  ></div>
                  <SquarePen
                    onClick={() => setView("edit")}
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
              className="bg-gray-200 mt-3 w-full p-1 rounded-md text-[13px]"
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
            <p className="text-[13px] font-semibold">
              {view == "edit" ? "Edit Label" : "Create Label"}
            </p>
            <X
              onClick={onClose}
              size={15}
              className="cursor-pointer text-gray-600"
            />
          </div>
          <hr />

          <div className="h-18 bg-gray-200 flex justify-center items-center">
            <div
              style={{ backgroundColor: selectedColor }}
              className={`h-8 w-50 rounded`}
            ></div>
          </div>

          <div className="p-2 mt-2">
            <div className="flex flex-col">
              <label className="text-[13px] mb-1">Title</label>
              <input
                type="text"
                className="border border-gray-500 p-1 rounded-md outline-none"
              />
            </div>
            <div className="mt-2">
              <h1 className="text-[13px]">Select a color</h1>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {trelloColors.map((color, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className="h-8 w-8 rounded flex items-center justify-center cursor-pointer relative"
                    style={{ backgroundColor: color }}
                  >
                    {selectedColor === color && (
                      <span className="text-white text-sm font-bold">✔</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <button className=" text-[13px] bg-blue-500 hover:bg-blue-600 w-full text-white mt-3 p-1 rounded-md">
              {view === "edit" ? "Update" : "Create"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Label;
