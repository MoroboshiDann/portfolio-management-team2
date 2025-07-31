import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useState, useEffect, useRef } from "react"; // 添加 useRef

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);
const AssetChartForm = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      hoverBackgroundColor: [],
      borderWidth: 1,
      borderColor: "#ffffff",
    }]
  });
  
  const [assetRecords, setAssetRecords] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalValue, setTotalValue] = useState(0);
  const [calculatingProfitRates, setCalculatingProfitRates] = useState(false);
  const chartRef = useRef(null);
  
  // Stable color mapping for asset types
  const colorMapRef = useRef({});
  const colorPalette = [
    "#36A2EB", "#FFCE56", "#FF6384", "#4BC0C0", 
    "#9966FF", "#FF9F40", "#C9CBCF", "#7EBE57"
  ];

  useEffect(() => {
    fetchAssetData();
  }, []);

  const fetchAssetData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/assetchart/asset-allocation');
      const data = await response.json();
      
      // Aggregate data for duplicate labels
      const aggregatedData = {};
      data.labels.forEach((label, index) => {
        const cleanLabel = label.trim();
        const value = typeof data.values[index] === 'string' 
          ? parseFloat(data.values[index].replace(/[^0-9.]/g, '')) 
          : Number(data.values[index]);
          
        if (!isNaN(value)) {
          if (!aggregatedData[cleanLabel]) {
            aggregatedData[cleanLabel] = 0;
          }
          aggregatedData[cleanLabel] += value;
        }
      });
      
      const labels = Object.keys(aggregatedData);
      const values = Object.values(aggregatedData);
      const total = values.reduce((sum, val) => sum + val, 0);
      setTotalValue(total);
      
      // Assign consistent colors
      const backgroundColors = labels.map(label => {
        if (!colorMapRef.current[label]) {
          // Get next available color
          const colorIndex = Object.keys(colorMapRef.current).length % colorPalette.length;
          colorMapRef.current[label] = colorPalette[colorIndex];
        }
        return colorMapRef.current[label];
      });
      
      setChartData({
        labels,
        datasets: [{
          data: values,
          backgroundColor: backgroundColors,
          hoverBackgroundColor: backgroundColors,
          borderWidth: 1,
          borderColor: "#ffffff",
        }]
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching asset data:', error);
      setLoading(false);
    }
  };

  const fetchAssetRecords = async (type) => {
    try {
      setLoading(true);
      setCalculatingProfitRates(true);
      
      const response = await fetch(`/api/assetchart/asset-records?type=${type}`);
      const data = await response.json();
      
      setAssetRecords(data);
      setSelectedAsset(type);
      setCalculatingProfitRates(false);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching asset records:', error);
      setCalculatingProfitRates(false);
      setLoading(false);
    }
  };

  const handleChartClick = (event, elements) => {
    if (elements.length > 0) {
      const clickedIndex = elements[0].index;
      const assetType = chartData.labels[clickedIndex].toLowerCase();
      fetchAssetRecords(assetType);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading asset data...</div>;
  }

    const getChartInstance = () => {
    return chartRef.current?.chartInstance;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Asset Allocation</h2>
      
      <div className="h-96 flex justify-center relative">
        <Doughnut
          ref={chartRef} // 添加引用
          data={chartData}
          options={{
            cutout: "60%",
            maintainAspectRatio: false,
            onClick: handleChartClick,
            plugins: {
              datalabels: {
                display: function(context) {
                  // 只显示非零值的标签
                  const value = context.dataset.data[context.dataIndex];
                  return value > 0;
                },
                color: "#ffffff",
                font: {
                  weight: "bold",
                  size: 12
                },
                formatter: (value) => {
                  // 4. 使用存储的总价值计算百分比
                  if (totalValue === 0) return "0%";
                  const percentage = Math.round((value / totalValue) * 100);
                  return `${percentage}%`;
                }
              },
              legend: {
                position: "bottom",
                labels: {
                  padding: 20,
                  font: {
                    size: 12
                  },
                  generateLabels: (chart) => {
                    const datasets = chart.data.datasets;
                    return chart.data.labels.map((label, i) => ({
                      text: `${label}: $${datasets[0].data[i].toLocaleString()}`,
                      fillStyle: datasets[0].backgroundColor[i],
                      strokeStyle: datasets[0].borderColor,
                      lineWidth: 1,
                      hidden: datasets[0].data[i] === 0, // 隐藏零值图例
                      index: i
                    }));
                  }
                },
                onClick: (e, legendItem, legend) => {
                  if (!legendItem.hidden) {
                    const assetType = chartData.labels[legendItem.index].toLowerCase();
                    fetchAssetRecords(assetType);
                  }
                }
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const label = context.label || "";
                    const value = context.raw || 0;
                    
                    // 5. 使用存储的总价值计算百分比
                    if (totalValue === 0) return `${label}: $${value.toLocaleString()}`;
                    
                    const percentage = ((value / totalValue) * 100).toFixed(1);
                    return `${label}: $${value.toLocaleString()} (${percentage}%)`;
                  }
                }
              }
            }
          }}
        />
        
        {/* 6. 添加中心总价值显示 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-sm text-gray-600 font-medium">Total Value</div>
            <div className="text-xl font-bold text-gray-800">
              ${totalValue.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </div>
          </div>
        </div>
      </div>
      
      {selectedAsset && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">
            {selectedAsset.charAt(0).toUpperCase() + selectedAsset.slice(1)} Records
          </h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Type</th>
                  <th className="py-2 px-4 border-b">Amount</th>
                  <th className="py-2 px-4 border-b">Quantity</th>
                  <th className="py-2 px-4 border-b">Profit Rate</th>
                  <th className="py-2 px-4 border-b">Date</th>
                </tr>
              </thead>
              <tbody>
                {assetRecords.map(record => (
                  <tr key={record.id}>
                    <td className="py-2 px-4 border-b">{record.name}</td>
                    <td className="py-2 px-4 border-b">{record.type}</td>
                    <td className="py-2 px-4 border-b">${record.amount.toLocaleString()}</td>
                    <td className="py-2 px-4 border-b">{record.quantity?.toLocaleString() || 'N/A'}</td>
                    <td className="py-2 px-4 border-b">
                      {calculatingProfitRates ? (
                        <span className="text-blue-500">Calculating...</span>
                      ) : record.profitRate !== null && record.profitRate !== undefined ? (
                        <span className={`font-semibold ${record.profitRate >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {record.profitRate.toFixed(2)}%
                        </span>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {new Date(record.date).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-semibold">
                  <td className="py-2 px-4 border-t" colSpan="2">Total {selectedAsset}</td>
                  <td className="py-2 px-4 border-t">
                    ${assetRecords
                      .reduce((sum, record) => sum + parseFloat(record.amount), 0)
                      .toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                  </td>
                  <td className="py-2 px-4 border-t"></td>
                  <td className="py-2 px-4 border-t"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetChartForm;