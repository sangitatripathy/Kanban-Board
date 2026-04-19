import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { X } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

const Calendar = ({ onClose }) => {
  const [dateRange, setDateRange] = useState([new Date(), null]);
  const [startDate, endDate] = dateRange;

  return (
    <div className="absolute top-8 right-0 bg-white shadow-lg rounded-lg z-50 w-70">
      <div className="flex justify-between p-2">
        <h1 className="text-[13px] font-semibold">Dates</h1>
        <X
          onClick={onClose}
          size={15}
          className="cursor-pointer text-gray-600"
        />
      </div>
      <hr />
      <div className="p-2 flex justify-center items-center">
        <DatePicker
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => setDateRange(update)}
          inline
        />
      </div>
      <div className="p-2 mx-auto flex flex-col gap-2">
        <div>
          <label className="text-xs">Start Date</label>
          <div className="flex gap-2">
            <input type="checkbox" />
            <input type="date" className="border p-0.5 rounded-md text-sm"/>
          </div>
        </div>

        <div>
          <label className="text-xs">Due Date</label>
          <div className="flex gap-2">
            <input type="checkbox" />
            <input type="date" className="border p-0.5 rounded-md text-sm"/>
            <input type="time" className="border p-0.5 rounded-md text-sm"/>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-xs">set due date reminder</label>
          <select for="duedate" className="p-1 border rounded-md text-sm">
            <option value="atTime">At time of due date</option>
            <option value="5mins">5 Minutes before</option>
            <option value="1hour">1 Hour before</option>
            <option value="1day">1 Day before</option>           
          </select>
        </div>
        <button className="bg-blue-500 p-1 text-sm text-white rounded-md">Save</button>
        <button className="bg-gray-300 p-1 text-sm text-black rounded-md">Remove</button>
      </div>
    </div>
  );
};

export default Calendar;
