import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useState, useEffect } from "react";

ChartJS.register(CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const AssetChart = () => {
  const [chartData, setChartData] = useState({
    labels: ["Stocks", "Bonds", "Real Estate", "Cash"],
    datasets: [
      {
        data: [0, 0, 0, 0], // Initial values
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384", "#7b29be"],
        hoverBackgroundColor: ["#36A2EB", "#FFCE56", "#FF6384", "#7b29be"],
        borderWidth: 1,
      },
    ],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssetData = async () => {
      try {
        console.log("start fetching asset allocation data");
        const response = await fetch('/api/assetchart/asset-allocation');
        if (!response.ok) {
          throw new Error('Failed to fetch asset allocation data');
        }
        const result = await response.json();
        console.log("fetched asset allocation data");
        
        setChartData({
          labels: result.labels,
          datasets: [
            {
              data: result.values,
              backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384", "#7b29be"],
              hoverBackgroundColor: ["#36A2EB", "#FFCE56", "#FF6384", "#7b29be"],
              borderWidth: 1,
            },
          ],
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching asset allocation data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAssetData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600">Loading asset allocation...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col">
      <h3 className="text-xl font-bold mb-4">Asset Allocation</h3>
      <div className="flex-grow flex items-center justify-center">
        <div className="h-[500px] w-[500px] relative">
          <Pie 
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  align: 'center',
                  labels: {
                    boxWidth: 12,
                    padding: 20,
                    usePointStyle: true,
                  }
                }
              },
              layout: {
                padding: {
                  bottom: 40
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AssetChart;