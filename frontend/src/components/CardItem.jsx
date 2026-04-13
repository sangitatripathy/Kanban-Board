import React from "react";
import { Archive } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const CardItem = ({ card }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card._id,
    data: {
      type: "card",
      columnId: card.columnId,
      card,
    },
  });

  const style = {
    transform:
      transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    transition: "transform 200ms cubic-bezier(0.2, 0, 0, 1)",
  };

  const priorityColor = {
    Low: "bg-green-100 border-green-400 text-green-500",
    Medium: "bg-yellow-100 border-yellow-400 text-yellow-500",
    High: "bg-red-100 border-red-400 text-red-500",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group bg-white rounded-lg px-3 py-2 relative cursor-grab shadow-sm hover:shadow-md transition ${
        isDragging ? "opacity-40 scale-95" : ""
      }`}
    >
      {/* Top actions */}
      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition">
        <Archive
          size={16}
          className="bg-gray-100 text-gray-600 rounded-full p-1 cursor-pointer shadow-sm hover:bg-gray-200"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Title */}
      <h3 className="text-[13px] font-normal text-gray-800 leading-snug">
        {card.cardName}
      </h3>

      {/* Footer */}
      <div className="flex items-center justify-between mt-2">
        <span
          className={`${priorityColor[card.priority]} text-[11px] px-2 py-0.5 rounded font-medium`}
        >
          {card.priority}
        </span>
      </div>
    </div>
  );
};

export default CardItem;
