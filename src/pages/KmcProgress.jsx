import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DAILY_GOAL_HOURS = 3; // 3 hours daily goal

const KmcProgress = () => {
  const [todayHours, setTodayHours] = useState(0);
  const [todayEntries, setTodayEntries] = useState(0);
  const [weeklyHours, setWeeklyHours] = useState(0);
  const [monthlyHours, setMonthlyHours] = useState(0);
  const [chartData, setChartData] = useState({});
  const [todayDate, setTodayDate] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("maasuvidhaUser"));
    if (!user) return;

    const kmcData = JSON.parse(localStorage.getItem("kmcData")) || {};
    const userKmc = kmcData[user.phone] || [];

    const today = new Date().toLocaleDateString();
    setTodayDate(today);

    let todayHrs = 0;
    let todayEnt = 0;
    let weekHrs = 0;
    let monthHrs = 0;

    // Group by date for chart
    const weeklyMap = {};
    const now = new Date();

    userKmc.forEach((entry) => {
      const entryDate = new Date(entry.date);
      const hours = entry.hours || 0; // Use hours directly from new data structure

      if (entry.date === today) {
        todayHrs += hours;
        todayEnt += 1; // Count entries instead of sessions
      }

      // Past 7 days
      const diffDays = Math.floor(
        (now - entryDate) / (1000 * 60 * 60 * 24)
      );
      if (diffDays < 7) {
        weekHrs += hours;
        weeklyMap[entryDate.toLocaleDateString("en-US", { weekday: "long" })] =
          hours;
      }

      // Same month
      if (
        entryDate.getMonth() === now.getMonth() &&
        entryDate.getFullYear() === now.getFullYear()
      ) {
        monthHrs += hours;
      }
    });

    setTodayHours(todayHrs);
    setTodayEntries(todayEnt);
    setWeeklyHours(weekHrs);
    setMonthlyHours(monthHrs);

    // Prepare chart data (last 7 days)
    const labels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const dataPoints = labels.map((day) => weeklyMap[day] || 0);

    setChartData({
      labels,
      datasets: [
        {
          label: "KMC Duration (hours)",
          data: dataPoints,
          fill: false,
          borderColor: "#ec4899",
          backgroundColor: "#ec4899",
          tension: 0.3,
        },
      ],
    });
  }, []);

  return (
    <div className="bg-pink-50 min-h-screen p-8 text-gray-900">
      <h2 className="text-3xl font-bold text-pink-700 mb-6">KMC Progress</h2>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h4 className="font-semibold">Today's Hours</h4>
          <p className="text-xl text-pink-600">{todayHours.toFixed(1)} hrs</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h4 className="font-semibold">Today's Entries</h4>
          <p className="text-xl text-pink-600">{todayEntries}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h4 className="font-semibold">Weekly Hours</h4>
          <p className="text-xl text-pink-600">{weeklyHours.toFixed(1)} hrs</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h4 className="font-semibold">Monthly Hours</h4>
          <p className="text-xl text-pink-600">{monthlyHours.toFixed(1)} hrs</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h4 className="font-semibold mb-4">Duration over time</h4>
        {chartData.labels ? (
          <Line data={chartData} />
        ) : (
          <p className="text-gray-500">No data available</p>
        )}
      </div>

      {/* Daily Goal */}
      <div className="bg-white p-6 rounded-lg shadow max-w-sm">
        <h4 className="font-semibold mb-2">Daily Goal</h4>
        <p className="text-gray-700">{todayDate}</p>
        <div className="w-full bg-gray-200 rounded-full h-6 my-3">
          <div
            className="bg-green-500 h-6 rounded-full text-xs text-white flex items-center justify-center"
            style={{
              width: `${Math.min(
                (todayHours / DAILY_GOAL_HOURS) * 100,
                100
              )}%`,
            }}
          >
            {Math.min(todayHours, DAILY_GOAL_HOURS).toFixed(1)} / {DAILY_GOAL_HOURS} hrs
          </div>
        </div>
        <p className="text-gray-700">
          {todayHours >= DAILY_GOAL_HOURS
            ? "🎉 Goal met!"
            : `Daily ${DAILY_GOAL_HOURS} hours goal not met yet…`}
        </p>
        <div className="text-4xl mt-2">
          {todayHours >= DAILY_GOAL_HOURS ? "😊" : "☹️"}
        </div>
      </div>
    </div>
  );
};

export default KmcProgress;