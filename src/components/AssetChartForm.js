import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const AssetChart = () => {
  const data = {
    labels: ["Stocks", "Bonds", "Real Estate", "Cash"],
    datasets: [
      {
        data: [50, 30, 10, 10],
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384", "#7b29be"],
        hoverBackgroundColor: ["#36A2EB", "#FFCE56", "#FF6384", "#7b29be"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col">
      <h3 className="text-xl font-bold mb-4">Asset Allocation</h3>
      <div className="flex-grow flex items-center justify-center"> {/* Centered chart area */}
        <div className="h-[500px] w-[500px] relative"> {/* Compact chart size */}
          <Pie 
            data={data}
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
                  bottom: 40 // Extra space for legend
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