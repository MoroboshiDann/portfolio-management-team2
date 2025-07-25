import { Pie } from "react-chartjs-2";
// chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register the components
ChartJS.register(CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const AssestChart = () => {
  const data = {
    labels: ["Stocks", "Bonds", "Real Estate", "Cash"],
    datasets: [
      {
        data: [50, 30, 10, 10],
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384", "#7b29be"],
        hoverBackgroundColor: ["#36A2EB", "#FFCE56", "#FF6384", "#7b29be"],
      },
    ],
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Asset Allocation</h3>
      <Pie data={data} />
    </div>
  );
};

export default AssestChart;
