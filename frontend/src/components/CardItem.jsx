import React from "react";
import { priorityColor } from "@/utils/timeAgo";
import { Archive, Clock } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const CardItem = ({ card, onClick }) => {
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
    activationConstraint: {
      distance: 5,
    },
  });
  const style = {
    transform:
      transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    transition: "transform 200ms cubic-bezier(0.2, 0, 0, 1)",
  };

  const formattedDueDate =
    card.dueDate ?
      new Date(card.dueDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      })
    : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = card.dueDate ? new Date(card.dueDate) : null;
  if (due) due.setHours(0, 0, 0, 0);

  const isOverdue = due && due < today;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group bg-white rounded-lg px-3 py-2 relative cursor-pointer shadow-sm hover:shadow-md transition ${
        isDragging ? "opacity-40 scale-95" : ""
      }`}
      onClick={(e) => {
        e.stopPropagation();
        if (isDragging) return;
        onClick(card);
      }}
    >
      {/* Top actions */}
      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition">
        <Archive
          size={16}
          className="bg-gray-100 text-gray-600 rounded-full p-1 cursor-pointer shadow-sm hover:bg-gray-200"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <h3 className="text-[13px] font-normal text-gray-800 leading-snug">
        {card.cardName}
      </h3>

      <div className="flex items-center gap-2 mt-2">
        <div className="flex gap-1 flex-wrap">
          {card.labels?.map((label) => (
            <div
              key={label._id}
              className={`h-4 p-2 text-white text-xs flex items-center rounded ${label.color}`}
              style={{ backgroundColor: label.color }}
            >
              {label.name}
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        {formattedDueDate && (
          <div
            className={`flex w-18 items-center gap-1 text-[11px] px-2 py-0.5 rounded ${
              isOverdue ?
                "bg-red-100 text-red-600"
              : "bg-gray-100 text-gray-600"
            }`}
          >
            <Clock
              size={12}
              className={isOverdue ? "text-red-600" : "text-gray-600"}
            />
            <span>{formattedDueDate}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span
            className={`${priorityColor[card.priority]} text-[11px] px-2 py-0.5 rounded font-medium`}
          >
            {card.priority}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardItem;
