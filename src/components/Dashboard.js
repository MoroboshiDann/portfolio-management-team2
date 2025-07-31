import { Line, Bar } from "react-chartjs-2";
import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement, // Register the point elementddd
  LineElement, // Register the line element for line charts
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [portfolioData, setPortfolioData] = useState({
    labels: [1,2,3,4,5,6,7,8,9,10,11,12],
    datasets: [
      {
        label: "Portfolio Value",
        data: [0.00],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        fill: true,
      },
    ],
  });
  
  const [transactionData, setTransactionData] = useState({
    labels: [1,2,3,4],
    datasets: [
      {
        label: "Transactions",
        data: [0.0],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
      },
    ],
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2025);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        console.log("start fetching portfolio data");
        // Fetch portfolio data
        const monthlyAssetResponse = await fetch(`/api/dashboard/monthly-asset?year=${selectedYear}`);
        if (!monthlyAssetResponse.ok) {
          throw new Error('Failed to fetch portfolio data');
        }
        const monthlyAssetResult = await monthlyAssetResponse.json();
        console.log("fetched portfolio data");

        // Create array with 12 months, defaulting to 0
        const monthlyData = new Array(12).fill(0);
        // Map the actual data to correct month positions (month - 1 for 0-based index)
        if (monthlyAssetResult.monthlyData) {
          monthlyAssetResult.monthlyData.forEach(item => {
            monthlyData[item.month - 1] = item.value;
          });
        }
        setPortfolioData(prev => ({
          ...prev,
          datasets: [{
            ...prev.datasets[0],
            data: monthlyData
          }]
        }));
        // console.log(monthlyAssetResult.values);
        // console.log(portfolioData);
        // console.log("start fetching transaction data");

        // Fetch transaction data
        const transactionResponse = await fetch(`/api/dashboard/transaction-data?year=${selectedYear}`);
        if (!transactionResponse.ok) {
          throw new Error('Failed to fetch transaction data');
        }
        const transactionResult = await transactionResponse.json();
        console.log("fetched transaction data:", transactionResult);
        
        // Create array with 4 quarters, defaulting to 0
        const quarterlyData = new Array(4).fill(0);
        // Map the actual data to correct quarter positions (quarter - 1 for 0-based index)
        if (transactionResult.quarterlyData) {
          transactionResult.quarterlyData.forEach(item => {
            quarterlyData[item.quarter - 1] = item.value;
          });
        }
        console.log("quarterly data array:", quarterlyData);
        setTransactionData(prev => ({
          ...prev,
          datasets: [{
            ...prev.datasets[0],
            data: quarterlyData
          }]
        }));
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchChartData();
  }, [selectedYear]);

  if (loading) {
    return (
      <div className="p-8 bg-gray-100 h-full flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gray-100 h-full flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Financial Dashboard
        </h2>
        <select 
          value={selectedYear} 
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={2023}>2023</option>
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
        </select>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Total Assets</h3>
          <Line data={portfolioData} />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
          <Bar data={transactionData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
