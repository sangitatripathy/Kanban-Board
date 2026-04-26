import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Ellipsis } from "lucide-react";
import CardItem from "./CardItem";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import AddColumn from "./AddColumn";

export default function SortableColumn({ column, onAddCard, onCardClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-gray-100 rounded-xl w-72 p-3 shrink-0 flex flex-col max-h-[calc(100vh-130px)] transition ${
        isDragging ? "opacity-60" : ""
      }`}
    >
      {/* Header */}
      <div
        {...attributes}
        {...listeners}
        className="flex justify-between items-center mb-3 cursor-grab shrink-0"
      >
        <h3 className="font-semibold text-sm">{column.title}</h3>
        <Ellipsis size={18} className="text-gray-500" />
      </div>

      {/* Cards */}
      <SortableContext
        items={(column.cards || []).map((card) => card._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3 mb-3 overflow-y-auto overflow-x-hidden pr-1 custom-scrollbar scrollbar-gutter-stable">
          {(column.cards || []).map((card) => (
            <CardItem
              key={card._id}
              card={{ ...card, columnId: column._id }}
              onClick={onCardClick}
              boardMembers={column.boardMembers}
            />
          ))}
        </div>
      </SortableContext>

      <AddColumn
        message="Add a card"
        btnText="Add Card"
        onAdd={(cardName) => onAddCard(cardName, column._id)}
      />
    </div>
  );
}
