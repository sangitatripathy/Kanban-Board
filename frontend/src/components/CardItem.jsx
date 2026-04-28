import React from "react";
import { priorityColor } from "@/utils/timeAgo";
import { Archive, Clock } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const CardItem = ({ card, onClick, boardMembers }) => {
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
  const assigneeUsers = (boardMembers || []).filter((member) =>
    card.assignees?.some((id) => id.toString() === member.user._id.toString()),
  );
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group bg-white dark:bg-gray-800 rounded-lg px-3 py-2 relative cursor-pointer shadow-sm hover:shadow-md transition ${
        isDragging ? "opacity-40 scale-95" : ""
      }`}
      onClick={(e) => {
        e.stopPropagation();
        if (isDragging) return;
        onClick(card);
      }}
    >
      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition">
        <Archive
          size={16}
          className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-1"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <h3 className="text-[13px] font-normal text-gray-800 dark:text-gray-200">
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
      <div className="flex items-center justify-between mt-2">
        <div className="flex gap-2 items-center">
          {formattedDueDate && (
            <div
              className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded ${
                isOverdue
  ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
  : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              <Clock size={12} />
              <span>{formattedDueDate}</span>
            </div>
          )}

          <span
            className={`${priorityColor[card.priority]} text-[11px] px-2 py-0.5 rounded font-medium`}
          >
            {card.priority}
          </span>
        </div>
        {assigneeUsers.length > 0 && (
          <div className="flex -space-x-2">
            {assigneeUsers.slice(0, 3).map((member) => (
              <div key={member.user._id} className="relative group">
                {member.user.imageUrl ?
                  <img
                    src={member.user.imageUrl}
                    className="w-6 h-6 rounded-full border-2 border-white object-cover dark:border-gray-800"
                  />
                : <div className="w-6 h-6 rounded-full bg-gray-400 text-white flex items-center justify-center text-[10px] border-2 border-white dark:border-gray-800">
                    {member.user.name?.[0]}
                  </div>
                }
              </div>
            ))}

            {assigneeUsers.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-[10px] flex items-center justify-center border-2 border-white dark:border-gray-800">
                +{assigneeUsers.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardItem;
