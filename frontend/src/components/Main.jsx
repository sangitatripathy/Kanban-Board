import React, { useEffect, useState } from "react";
import {
  Flame,
  ChevronsDown,
  Dice3,
  CircleCheck,
  Calendar,
} from "lucide-react";
import { useUser } from "@/context/userContext";
import { getGreeting } from "@/utils/timeAgo";
import { getRequest } from "@/lib/axios";
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
} from "recharts";

const Main = () => {
  const { user } = useUser();

  const [orgData, setOrgData] = useState(null);
  const [activityData, setActivityData] = useState([]);
  const [range, setRange] = useState("7");
  const getDashboardData = async () => {
    const res = await getRequest("/analytics/dashboard");
    setOrgData(res);
  };

  const getActivityData = async () => {
    const res = await getRequest("/analytics/activity");
    setActivityData(res);
  };

  useEffect(() => {
    if (user) {
      getDashboardData();
      getActivityData();
    }
  }, [user]);

  const chartData = range === "7" ? activityData.slice(-7) : activityData;

  return (
    <div className="px-8 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-2xl font-semibold mt-5">
        {getGreeting()}, {user?.name}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard
          title="Total Tasks"
          value={orgData?.totalCards || 0}
          icon={<CircleCheck className="text-blue-600" size={20} />}
          border="border-blue-600"
        />

        <StatCard
          title="High Priority"
          value={orgData?.priority?.high || 0}
          icon={<Flame className="text-red-600" size={20} />}
          border="border-red-600"
        />

        <StatCard
          title="Medium Priority"
          value={orgData?.priority?.medium || 0}
          icon={<Dice3 className="text-yellow-600" size={20} />}
          border="border-yellow-600"
        />

        <StatCard
          title="Low Priority"
          value={orgData?.priority?.low || 0}
          icon={<ChevronsDown className="text-green-600" size={20} />}
          border="border-green-600"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">
            Activity (Last {range} Days)
          </h2>

          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 text-xs">
            <button
              onClick={() => setRange("7")}
              className={`px-3 py-1 rounded-md transition ${
                range === "7" ?
                  "bg-white dark:bg-gray-900 shadow text-black dark:text-white"
                : "text-gray-500 dark:text-gray-300"
              }`}
            >
              7 Days
            </button>

            <button
              onClick={() => setRange("30")}
              className={`px-3 py-1 rounded-md transition ${
                range === "30" ?
                  "bg-white dark:bg-gray-900 shadow text-black dark:text-white"
                : "text-gray-500 dark:text-gray-300"
              }`}
            >
              30 Days
            </button>
          </div>
        </div>

        {chartData.every((d) => d.created === 0 && d.updated === 0) ?
          <p className="text-xs text-gray-500">
            No activity in the selected range
          </p>
        : <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getDate()}/${d.getMonth() + 1}`;
                }}
              />

              <YAxis tick={{ fontSize: 11 }} />

              <Tooltip
                contentStyle={{
                  fontSize: "12px",
                  borderRadius: "8px",
                }}
                labelStyle={{ fontSize: "11px" }}
              />

              <Legend wrapperStyle={{ fontSize: "12px" }} />

              <Line
                type="monotone"
                dataKey="created"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                name="Created"
              />

              <Line
                type="monotone"
                dataKey="updated"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                name="Updated"
              />
            </LineChart>
          </ResponsiveContainer>
        }
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm mt-6">
        <h2 className="text-sm font-semibold mb-3 flex gap-3 items-center">
          {" "}
          <span>
            <Calendar className="text-red-500" size={18} />
          </span>
          Upcoming Deadlines
        </h2>

        {!orgData?.upcomingDeadlines || orgData.upcomingDeadlines.length === 0 ?
          <p className="text-xs text-gray-500">
            No upcoming deadlines this week 🎉
          </p>
        : <div className="flex flex-col gap-3">
            {orgData.upcomingDeadlines.map((card) => (
              <div
                key={card._id}
                className="flex items-center justify-between p-3 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{card.cardName}</p>

                  <p className="text-xs text-gray-500">
                    Due: {new Date(card.dueDate).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded ${
                    card.priority === "High" ? "bg-red-100 text-red-600"
                    : card.priority === "Medium" ?
                      "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
                  }`}
                >
                  {card.priority}
                </span>
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  );
};

export default Main;

const StatCard = ({ title, value, icon, border }) => (
  <div
    className={`border-l-4 ${border} bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm`}
  >
    <div className="flex justify-between items-start">
      <p className="text-gray-600 dark:text-gray-300 text-xs font-medium">
        {title}
      </p>
      {icon}
    </div>

    <p className="text-2xl font-semibold mt-2">{value}</p>
  </div>
);
