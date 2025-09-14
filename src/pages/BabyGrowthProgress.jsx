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
  const [comparisonChartData, setComparisonChartData] = useState({});

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
            label: "Baby's Weight (kg)",
            data: weights,
            fill: false,
            borderColor: "#ec4899",
            backgroundColor: "#ec4899",
            tension: 0.3,
            pointRadius: 6,
            pointHoverRadius: 8,
          },
        ],
      });

      // Prepare comparison chart data
      const ageRange = Math.max(12, Math.ceil(Math.max(...sortedData.map(entry => entry.age))));
      const comparisonLabels = [];
      const averageWeights = [];
      const babyWeights = [];
      
      for (let i = 0; i <= ageRange; i += 0.5) {
        comparisonLabels.push(`${i}mo`);
        averageWeights.push(getAverageWeight(i));
        
        // Find baby's weight at this age (interpolate if needed)
        const babyEntry = sortedData.find(entry => Math.abs(entry.age - i) < 0.25);
        if (babyEntry) {
          babyWeights.push(babyEntry.weight);
        } else {
          // Interpolate between nearest entries
          const before = sortedData.filter(entry => entry.age <= i).pop();
          const after = sortedData.filter(entry => entry.age >= i)[0];
          
          if (before && after) {
            const ratio = (i - before.age) / (after.age - before.age);
            const interpolatedWeight = before.weight + (after.weight - before.weight) * ratio;
            babyWeights.push(interpolatedWeight);
          } else if (before) {
            babyWeights.push(before.weight);
          } else if (after) {
            babyWeights.push(after.weight);
          } else {
            babyWeights.push(null);
          }
        }
      }

      setComparisonChartData({
        labels: comparisonLabels,
        datasets: [
          {
            label: "Average Weight (kg)",
            data: averageWeights,
            fill: false,
            borderColor: "#3b82f6",
            backgroundColor: "#3b82f6",
            tension: 0.3,
            borderDash: [5, 5],
            pointRadius: 0,
          },
          {
            label: "Baby's Weight (kg)",
            data: babyWeights,
            fill: false,
            borderColor: "#ec4899",
            backgroundColor: "#ec4899",
            tension: 0.3,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      });
    }
  }, [weightGain]);

  const getAverageWeight = (age) => {
    // WHO growth standards for average weight by age (in months)
    const averageWeights = {
      0: 3.3, 1: 4.2, 2: 5.1, 3: 5.8, 4: 6.4, 5: 6.9, 6: 7.3,
      7: 7.6, 8: 7.9, 9: 8.2, 10: 8.5, 11: 8.7, 12: 8.9,
      13: 9.1, 14: 9.3, 15: 9.5, 16: 9.7, 17: 9.9, 18: 10.1,
      19: 10.3, 20: 10.5, 21: 10.7, 22: 10.9, 23: 11.1, 24: 11.3
    };
    
    // For ages between months, interpolate
    const floorAge = Math.floor(age);
    const ceilAge = Math.ceil(age);
    
    if (floorAge === ceilAge) {
      return averageWeights[floorAge] || 11.3;
    }
    
    const floorWeight = averageWeights[floorAge] || 11.3;
    const ceilWeight = averageWeights[ceilAge] || 11.3;
    
    return floorWeight + (ceilWeight - floorWeight) * (age - floorAge);
  };

  const getGrowthPercentile = (age, weight) => {
    const expectedWeight = getAverageWeight(age);
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

          {/* Comparison Chart */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h4 className="font-semibold mb-4">Growth Comparison with Average</h4>
            <p className="text-sm text-gray-600 mb-4">
              Blue dashed line shows average weight for age. Pink line shows your baby's growth.
            </p>
            {comparisonChartData.labels ? (
              <Line 
                data={comparisonChartData}
                options={{
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
                      title: {
                        display: true,
                        text: 'Weight (kg)'
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Age (months)'
                      }
                    }
                  }
                }}
              />
            ) : (
              <p className="text-gray-500">No data available for comparison chart</p>
            )}
          </div>

          {/* Growth Assessment */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h4 className="font-semibold mb-4">Growth Assessment</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Current Percentile</h5>
                <p className="text-lg text-pink-600">
                  {getGrowthPercentile(currentAge, currentWeight)}
                </p>
              </div>
              <div>
                <h5 className="font-medium text-gray-700 mb-2">vs Average Weight</h5>
                <p className="text-lg text-pink-600">
                  {currentWeight > 0 && currentAge > 0 ? (
                    <>
                      {currentWeight.toFixed(1)}kg vs {getAverageWeight(currentAge).toFixed(1)}kg
                      <br />
                      <span className="text-sm">
                        {currentWeight > getAverageWeight(currentAge) ? 'Above' : 'Below'} average
                      </span>
                    </>
                  ) : 'N/A'}
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
