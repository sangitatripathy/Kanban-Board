import React from 'react'
import { X } from "lucide-react";

const Members = ({onClose}) => {
  return (
    <div className="absolute top-8 right-[-10] bg-white shadow-lg rounded-lg z-50 w-64">
      <div className="flex p-1 items-center">
        <h1 className="w-80 text-center text-sm font-semibold">Members</h1>
        <X
          onClick={onClose}
          size={20}
          className="cursor-pointer text-gray-600"
        />
      </div>
      <hr/>
      <div className='p-2 flex flex-col gap-2'>
        <input type="text" placeholder='Search Members' className='border p-1 rounded-md text-sm w-full'/>
        <div className='flex justify-start flex-col'>
          <h3 className='text-xs'>Board Members</h3>
        </div>
      </div>
    </div>
  )
}

export default Members