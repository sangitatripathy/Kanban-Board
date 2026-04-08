import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { ListFilter, Users, EllipsisVertical } from "lucide-react";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import SortableColumn from "@/components/SortableColumn";
import { getRequest, putRequest } from "@/lib/axios";

const Board = () => {
  const [columns, setColumns] = useState([]);
  const location = useLocation();
  const { board } = location.state || {};

  const fetchColumns = async () => {
    const res = await getRequest(`/board/${board?._id}/columns`);
    setColumns(res);
  };

  useEffect(() => {
    fetchColumns();
  }, []);

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = columns.findIndex((c) => c._id === active.id);
    const newIndex = columns.findIndex((c) => c._id === over.id);

    const newColumns = arrayMove(columns, oldIndex, newIndex);
    setColumns(newColumns); // ✅ optimistic UI

    await putRequest(`/board/${board._id}/column/${active.id}`, {
      newIndex,
    });
  };
  const members = board?.members;
  const visibleMembers = members.slice(0, 5);
  const extraCount = Math.max(0, members.length - 5);
  return (
    <div>
      <Navbar />
      <div className="px-10 py-4 flex justify-between items-center">
        <div>
          <h1>{board?.boardName}</h1>
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
          <button><EllipsisVertical size={19}/></button>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Members: {board?.members?.length || 0}
      </p>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={columns?.map((col) => col._id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex gap-4">
            {columns?.map((col) => (
              <SortableColumn key={col._id} column={col} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default Board;
