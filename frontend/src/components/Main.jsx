import React from "react";
import { CircleAlert } from "lucide-react";

const Main = () => {
  return (
    <div className="p-4">
      <div>
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <p>Platform-wide analytics, usage insights, and engagement metrics</p>
      </div>

      {/* alerts */}
      <div>
        <div>
          <CircleAlert />
          <p>Alerts & Risk Indicators</p>
        </div>
        <div>
          <div>
            <h2>Inactive Organizations</h2>
            <p></p>
          </div>
          <p>organizations with no activity in 30+ days</p>
        </div>
        <div>
          <div>
            <h2>Dormant Users</h2>
            <p></p>
          </div>
          <p>users with no recent activity</p>
        </div>
        <div>
          <div>
            <h2>Underutilized Boards</h2>
            <p></p>
          </div>
          <p>boards with minimal activity</p>
        </div>
      </div>

      {/* analytics */}
      <div>
        {/* activity analytics */}
        <div></div>
        {/* overview */}
        <div>

        </div>
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
