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

const BabyGrowthProgress = () => {
  const [growthData, setGrowthData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [currentWeight, setCurrentWeight] = useState(0);
  const [currentAge, setCurrentAge] = useState(0);
  const [weightGain, setWeightGain] = useState(0);
  const [growthStatus, setGrowthStatus] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("maasuvidhaUser"));
    if (!user) return;

    const babyGrowthData = JSON.parse(localStorage.getItem("babyGrowthData")) || {};
    const userGrowth = babyGrowthData[user.phone] || [];
    setGrowthData(userGrowth);

    if (userGrowth.length > 0) {
      // Get latest entry
      const latest = userGrowth[userGrowth.length - 1];
      setCurrentWeight(latest.weight);
      setCurrentAge(latest.age);

      // Calculate weight gain (if more than one entry)
      if (userGrowth.length > 1) {
        const first = userGrowth[0];
        const last = userGrowth[userGrowth.length - 1];
        const ageDiff = last.age - first.age;
        const weightDiff = last.weight - first.weight;
        setWeightGain(ageDiff > 0 ? weightDiff / ageDiff : 0);
      }

      // Determine growth status
      const avgWeightGain = weightGain;
      if (avgWeightGain >= 0.5) {
        setGrowthStatus("Excellent growth! 🎉");
      } else if (avgWeightGain >= 0.3) {
        setGrowthStatus("Good growth! 👍");
      } else if (avgWeightGain >= 0.1) {
        setGrowthStatus("Moderate growth 📈");
      } else {
        setGrowthStatus("Monitor growth closely 👀");
      }

      // Prepare chart data
      const sortedData = [...userGrowth].sort((a, b) => new Date(a.date) - new Date(b.date));
      const labels = sortedData.map(entry => `${entry.age}mo`);
      const weights = sortedData.map(entry => entry.weight);

      setChartData({
        labels,
        datasets: [
          {
            label: "Weight (kg)",
            data: weights,
            fill: false,
            borderColor: "#ec4899",
            backgroundColor: "#ec4899",
            tension: 0.3,
          },
        ],
      });
    }
  }, [weightGain]);

  const getGrowthPercentile = (age, weight) => {
    // Simplified growth percentile calculation
    // In a real app, this would use WHO growth standards
    const expectedWeights = {
      0: 3.3, 1: 4.2, 2: 5.1, 3: 5.8, 4: 6.4, 5: 6.9, 6: 7.3,
      7: 7.6, 8: 7.9, 9: 8.2, 10: 8.5, 11: 8.7, 12: 8.9
    };
    
    const expectedWeight = expectedWeights[Math.floor(age)] || 8.9;
    const percentile = (weight / expectedWeight) * 100;
    
    if (percentile >= 90) return "Above average";
    if (percentile >= 75) return "Good";
    if (percentile >= 50) return "Average";
    if (percentile >= 25) return "Below average";
    return "Needs attention";
  };

  return (
    <div className="bg-pink-50 min-h-screen p-8 text-gray-900">
      <h2 className="text-3xl font-bold text-pink-700 mb-6">Baby Growth Progress</h2>

      {growthData.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="text-6xl mb-4">👶</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Growth Data Yet</h3>
          <p className="text-gray-600">
            Start tracking your baby's growth by recording weight and age measurements.
          </p>
        </div>
      ) : (
        <>
          {/* Current Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <h4 className="font-semibold">Current Weight</h4>
              <p className="text-xl text-pink-600">{currentWeight}kg</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <h4 className="font-semibold">Current Age</h4>
              <p className="text-xl text-pink-600">{currentAge} months</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <h4 className="font-semibold">Weight Gain Rate</h4>
              <p className="text-xl text-pink-600">{weightGain.toFixed(2)}kg/month</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <h4 className="font-semibold">Growth Status</h4>
              <p className="text-lg text-pink-600">{growthStatus}</p>
            </div>
          </div>

          {/* Growth Chart */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h4 className="font-semibold mb-4">Weight Growth Over Time</h4>
            {chartData.labels ? (
              <Line data={chartData} />
            ) : (
              <p className="text-gray-500">No data available for chart</p>
            )}
          </div>

          {/* Growth Assessment */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h4 className="font-semibold mb-4">Growth Assessment</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Current Percentile</h5>
                <p className="text-lg text-pink-600">
                  {getGrowthPercentile(currentAge, currentWeight)}
                </p>
              </div>
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Total Measurements</h5>
                <p className="text-lg text-pink-600">{growthData.length} entries</p>
              </div>
            </div>
          </div>

          {/* Recent Entries */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="font-semibold mb-4">Recent Growth Entries</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {growthData.slice(-10).reverse().map((entry, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-md text-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-gray-800">{entry.date}</span>
                      <span className="text-gray-600 ml-2">- {entry.age} months old</span>
                    </div>
                    <div className="text-pink-600 font-semibold">
                      {entry.weight}kg
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BabyGrowthProgress;
