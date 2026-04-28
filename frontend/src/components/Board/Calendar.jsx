import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { X } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import { putRequest } from "@/lib/axios";

const Calendar = ({ onClose, cardId, dateSave }) => {
  const [dateRange, setDateRange] = useState([new Date(), null]);
  const [startDate, endDate] = dateRange;
  const [hasStart, setHasStart] = useState(false);
  const [hasEnd, setHasEnd] = useState(false);
  const [dueTime, setDueTime] = useState("");

  const handleDateUpdate = async () => {
    try {
      const payload = {
        startDate: hasStart ? startDate : null,
        dueDate: hasEnd ? endDate : null,
        dueTime: hasEnd ? dueTime : null,
      };
      dateSave(cardId, payload);
      const res = await putRequest(`/card/${cardId}/dates`, payload);
      onClose();
    } catch (error) {
      console.error(error.message);
    }
  };
  console.log(cardId);
  return (
    <div className="absolute top-8 right-0 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg rounded-lg z-50 w-70">
      <div className="flex justify-between p-2">
        <h1 className="text-[13px] font-semibold text-gray-900 dark:text-white">
          Dates
        </h1>

        <X
          onClick={onClose}
          size={15}
          className="cursor-pointer text-gray-600 dark:text-gray-400"
        />
      </div>

      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Date Picker */}
      <div className="p-2 flex justify-center items-center">
        <div
          className="dark:[&_.react-datepicker]:bg-gray-900 
                    dark:[&_.react-datepicker]:text-white 
                    dark:[&_.react-datepicker__header]:bg-gray-800 
                    dark:[&_.react-datepicker__day]:text-white 
                    dark:[&_.react-datepicker__day--selected]:bg-blue-500 
                    dark:[&_.react-datepicker__day:hover]:bg-gray-700 
                    dark:[&_.react-datepicker__current-month]:text-white 
                    dark:[&_.react-datepicker__day-name]:text-gray-400"
        >
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              setDateRange(update);
              if (update[0]) setHasStart(true);
              if (update[1]) setHasEnd(true);
            }}
            inline
          />
        </div>
      </div>

      <div className="p-2 mx-auto flex flex-col gap-2">
        {/* Start Date */}
        <div>
          <label className="text-xs text-gray-700 dark:text-gray-300">
            Start Date
          </label>

          <div className="flex gap-2">
            <input
              type="checkbox"
              checked={hasStart}
              onChange={() => setHasStart(!hasStart)}
            />

            <input
              type="date"
              value={startDate.toISOString().split("T")[0]}
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-0.5 rounded-md text-sm"
              onChange={(e) => {
                const newDate = new Date(e.target.value);
                setDateRange[[newDate, endDate]];
                setHasStart(true);
              }}
            />
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label className="text-xs text-gray-700 dark:text-gray-300">
            Due Date
          </label>

          <div className="flex gap-2">
            <input
              type="checkbox"
              checked={hasEnd}
              onChange={() => setHasEnd(!hasEnd)}
            />

            <input
              type="date"
              value={endDate ? endDate.toISOString().split("T")[0] : ""}
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-0.5 rounded-md text-sm"
              onChange={(e) => {
                const newDate = new Date(e.target.value);
                setDateRange[[startDate, newDate]];
                setHasEnd(true);
              }}
            />

            <input
              type="time"
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-0.5 rounded-md text-sm"
              onChange={(e) => setDueTime(e.target.value)}
            />
          </div>
        </div>

        {/* Reminder */}
        <div className="flex flex-col">
          <label className="text-xs text-gray-700 dark:text-gray-300">
            set due date reminder
          </label>

          <select className="p-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md text-[13px]">
            <option value="atTime">At time of due date</option>
            <option value="5mins">5 Minutes before</option>
            <option value="1hour">1 Hour before</option>
            <option value="1day">1 Day before</option>
          </select>
        </div>

        {/* Buttons */}
        <button
          onClick={handleDateUpdate}
          className="bg-blue-500 p-1 text-[13px] text-white rounded-md"
        >
          Save
        </button>

        <button className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white p-1 text-[13px] rounded-md">
          Remove
        </button>
      </div>
    </div>
  );
};

export default Calendar;
