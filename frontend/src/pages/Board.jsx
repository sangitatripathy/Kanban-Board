import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { ListFilter, Users, EllipsisVertical } from "lucide-react";

import {
  DndContext,
  closestCenter,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import SortableColumn from "@/components/SortableColumn";
import AddColumn from "@/components/AddColumn";
import CardItem from "@/components/CardItem";
import CardModal from "@/components/Modal/CardModal";
import { getRequest, putRequest, postRequest } from "@/lib/axios";

const Board = () => {
  const [columns, setColumns] = useState([]);
  const [cards, setCards] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const location = useLocation();
  const [boardData, setBoardData] = useState(location.state?.board);

  const fetchColumns = async () => {
    const res = await getRequest(`/org/board-details/${boardData?._id}`);
    setColumns(res.columns);
  };

  useEffect(() => {
    fetchColumns();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const handleDragStart = (event) => {
    const { active } = event;

    if (active.data.current?.type === "card") {
      setActiveCard(active.data.current.card);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeType = active.data.current?.type;

    if (activeType !== "card") {
      const oldIndex = columns.findIndex((c) => c._id === active.id);
      const newIndex = columns.findIndex((c) => c._id === over.id);

      if (oldIndex === newIndex) return;

      const newColumns = arrayMove(columns, oldIndex, newIndex);
      setColumns(newColumns);

      await putRequest("/board/reorder-columns", {
        columns: newColumns.map((col, index) => ({
          _id: col._id,
          position: index,
        })),
      });

      return;
    }

    const sourceColId = active.data.current.columnId;
    const targetColId = over.data.current?.columnId || over.id;

    let updatedSourceCards = [];
    let updatedTargetCards = [];

    const newCols = structuredClone(columns);

    const sourceCol = newCols.find((c) => c._id === sourceColId);
    const targetCol = newCols.find((c) => c._id === targetColId);

    if (!sourceCol || !targetCol) return;

    const activeIndex = sourceCol.cards.findIndex((c) => c._id === active.id);

    if (sourceColId === targetColId) {
      const overIndex = sourceCol.cards.findIndex((c) => c._id === over.id);

      sourceCol.cards = arrayMove(sourceCol.cards, activeIndex, overIndex);

      updatedSourceCards = sourceCol.cards;

      setColumns(newCols);

      await putRequest("/column/card/reorder-cards", {
        sourceColId,
        targetColId: sourceColId,
        sourceCards: updatedSourceCards.map((card, index) => ({
          _id: card._id,
          position: index,
        })),
      });

      return;
    }

    const [movedCard] = sourceCol.cards.splice(activeIndex, 1);

    const overIndex = targetCol.cards.findIndex((c) => c._id === over.id);

    if (overIndex === -1) {
      targetCol.cards.push({
        ...movedCard,
        columnId: targetColId,
      });
    } else {
      targetCol.cards.splice(overIndex, 0, {
        ...movedCard,
        columnId: targetColId,
      });
    }

    sourceCol.cards = sourceCol.cards.map((card, index) => ({
      ...card,
      position: index,
    }));

    targetCol.cards = targetCol.cards.map((card, index) => ({
      ...card,
      position: index,
    }));

    updatedSourceCards = sourceCol.cards;
    updatedTargetCards = targetCol.cards;

    setColumns(newCols);

    await putRequest("/column/card/reorder-cards", {
      sourceColId,
      targetColId,
      sourceCards: updatedSourceCards.map((card) => ({
        _id: card._id,
        position: card.position,
      })),
      targetCards: updatedTargetCards.map((card) => ({
        _id: card._id,
        position: card.position,
      })),
    });
  };

  const handleAddColumn = async (title) => {
    try {
      const res = await postRequest(`/board/${board._id}/columns`, {
        title,
      });

      setColumns((prev) => [...prev, res]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCard = async (cardName, column) => {
    const res = await postRequest(`/column/${column}`, {
      cardName,
      boardId: board._id,
    });
    const newCard = res;
    setColumns((prev) => {
      return prev.map((col) =>
        col._id === column ? { ...col, cards: [...col.cards, newCard] } : col,
      );
    });
  };

  const handleUpdateBoardLabels = (updatedLabels) => {
    setBoardData((prev) => ({
      ...prev,
      labels: updatedLabels,
    }));
  };

  const handleAssignLabels = (cardId, labels) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        cards: col.cards.map((card) =>
          card._id === cardId ? { ...card, labels } : card,
        ),
      })),
    );

    setSelectedCard((prev) =>
      prev && prev._id === cardId ? { ...prev, labels } : prev,
    );
  };
  const members = boardData?.members || [];
  const visibleMembers = members.slice(0, 5);
  const extraCount = Math.max(0, members.length - 5);

  return (
    <div className="h-screen flex flex-col">
      <Navbar variant="board" hideDrawer={true} />
      <div className="px-4 py-2 flex justify-between items-center bg-linear-to-r from-purple-800 to-purple-500">
        <div>
          <h1 className="font-semibold text-white">{boardData?.boardName}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            {visibleMembers.map((member, index) => (
              <div
                key={member._id}
                className={`w-8 h-8 rounded-full border-2 border-white overflow-hidden flex items-center justify-center text-xs font-semibold bg-gray-300 text-gray-700 ${
                  index !== 0 ? "-ml-2" : ""
                }`}
              >
                {member.imageUrl ?
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                : member.name[0].toUpperCase()}
              </div>
            ))}

            {extraCount > 0 && (
              <div className="-ml-2 w-8 h-8 rounded-full bg-gray-200 text-xs flex items-center justify-center border-2 border-white">
                +{extraCount}
              </div>
            )}
          </div>
          <div>
            {" "}
            <ListFilter size={19} />
          </div>
          <div className="flex gap-2 bg-gray-300 px-2 py-1 rounded-md">
            <Users size={19} />
            <p>Add Member</p>
          </div>
          <button>
            <EllipsisVertical size={19} />
          </button>
        </div>
      </div>
      <div className="flex-1 px-4 mt-6 overflow-x-auto overflow-y-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <DragOverlay>
            {activeCard ?
              <div className="w-72">
                <CardItem card={activeCard} onClick={() => {}} />
              </div>
            : null}
          </DragOverlay>
          <SortableContext
            items={columns?.map((col) => col._id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex gap-4 items-start">
              {columns?.map((col) => (
                <SortableColumn
                  key={col._id}
                  column={col}
                  onAddCard={handleAddCard}
                  onCardClick={(card) => setSelectedCard(card)}
                />
              ))}
              <AddColumn onAdd={handleAddColumn} message={"Add another list"} />
            </div>
          </SortableContext>
        </DndContext>
      </div>
      {selectedCard && (
        <CardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          board={boardData}
          updateBoardLabels={handleUpdateBoardLabels}
          assignLabels={handleAssignLabels}
        />
      )}
    </div>
  );
};

export default Board;
