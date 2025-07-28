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

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        console.log("start fetching portfolio data");
        // Fetch portfolio data
        const portfolioResponse = await fetch('/api/portfolio/chart-data');
        if (!portfolioResponse.ok) {
          throw new Error('Failed to fetch portfolio data');
        }
        const portfolioResult = await portfolioResponse.json();
        console.log("fetched portfolio data");
        // setPortfolioData({
        //   datasets: [{
        //     ...portfolioData.datasets[0],
        //     data: portfolioResult.values
        //   }]
        // });
        portfolioData.datasets[0].data = portfolioResult.values;
        console.log(portfolioResult.values);
        console.log(portfolioData);
        console.log("start fetching transaction data");

        // Fetch transaction data
        const transactionResponse = await fetch('/api/transactions/chart-data');
        if (!transactionResponse.ok) {
          throw new Error('Failed to fetch transaction data');
        }
        const transactionResult = await transactionResponse.json();
        console.log("fetched portfolio data");
        transactionData.datasets[0].data = transactionResult.values;
        // Update state with fetched data
        // setPortfolioData({
        //   datasets: [{
        //     ...portfolioData.datasets[0],
        //     data: portfolioResult.values
        //   }]
        // });
        
        // setTransactionData({
        //   datasets: [{
        //     ...transactionData.datasets[0],
        //     data: transactionResult.values
        //   }]
        // });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

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
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Financial Dashboard
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Portfolio Growth</h3>
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
