import React from "react";
import { CircleAlert } from "lucide-react";
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
} from "recharts";

const Main = () => {
  return (
    <div className="p-10 bg-gray-100/50 h-screen">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">
          Platform-wide analytics, usage insights, and engagement metrics
        </p>
      </div>

      {/* alerts */}
      <div>
        <div>
          <p className="flex items-center gap-2">
            <CircleAlert className="text-orange-700" />
            Alerts & Risk Indicators
          </p>
        </div>

        <div className="flex gap-3 justify-between mt-4">
          {/* Card 1 */}
          <div className="bg-orange-50 p-4 rounded-lg flex flex-col gap-3 min-w-70 border-l-4 border-orange-500">
            <div className="flex justify-between">
              <h2 className="text-[15px] font-semibold text-slate-800">
                Inactive Organizations
              </h2>
              <p className="font-bold text-xl text-orange-600">3</p>
            </div>
            <p className="font-extralight text-sm text-gray-500">
              3 organizations with no activity in 30+ days
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-orange-50 p-4 rounded-lg flex flex-col gap-3 w-70 border-l-4 border-orange-500">
            <div className="flex justify-between">
              <h2 className="text-[15px] font-semibold text-slate-800">
                Dormant Users
              </h2>
              <p className="font-bold text-xl text-orange-600">4</p>
            </div>
            <p className="font-extralight text-sm text-gray-500">
              4 users with no recent activity
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-blue-50 p-4 rounded-lg flex flex-col gap-3 w-70 border-l-4 border-blue-500">
            <div className="flex justify-between">
              <h2 className="text-[15px] font-semibold text-slate-800">
                Underutilized Boards
              </h2>
              <p className="font-bold text-xl text-blue-600">2</p>
            </div>
            <p className="font-extralight text-sm text-gray-500">
              2 boards with minimal activity
            </p>
          </div>
        </div>
      </div>

      {/* analytics */}
      <div className="flex gap-2">
        {/* activity analytics */}
        <div>
          
        </div>
        {/* overview */}
        <div></div>
      </div>
      {/* top 10 board by count */}
      <div></div>
      {/* active org and users */}
      <div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Main;