import React, { useEffect, useState } from "react";
import { getRequest } from "@/lib/axios";
import BoardList from "@/components/BoardList";
import Drawer from "@/components/Drawer";
import Navbar from "@/components/Navbar";

const AllBoards = () => {
  const [boards, setBoards] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(true);

  const fetchBoards = async () => {
    try {
      const res = await getRequest("/org/board/all");
      setBoards(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <div className="flex h-screen">
      <div
        className={`transition-all duration-100 ease-in-out ${
          openDrawer ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        <Drawer />
      </div>
      <div className="flex-1 flex flex-col">
        <Navbar toggleDrawer={() => setOpenDrawer(!openDrawer)} />
        <div className="p-6">
          <h1 className="text-xl font-semibold mb-4">All Boards</h1>

          <BoardList boards={boards} onCreateBoard={null} />
        </div>
      </div>
    </div>
  );
};

export default AllBoards;
