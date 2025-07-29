import { Pie } from "react-chartjs-2";
import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const AssetChartForm = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384', '#4BC0C0'],
      hoverBackgroundColor: ['#36A2EB', '#FFCE56', '#FF6384', '#4BC0C0']
    }]
  });
  
  const [assetRecords, setAssetRecords] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssetData();
  }, []);

  const fetchAssetData = async () => {
    try {
      const response = await fetch('/api/assetchart/asset-allocation');
      const data = await response.json();
      
      setChartData({
        labels: data.labels,
        datasets: [{
          data: data.values,
          backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384', '#4BC0C0'],
          hoverBackgroundColor: ['#36A2EB', '#FFCE56', '#FF6384', '#4BC0C0']
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
      const response = await fetch(`/api/assetchart/asset-records?type=${type}`);
      const data = await response.json();
      
      setAssetRecords(data);
      setSelectedAsset(type);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching asset records:', error);
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

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Asset Allocation</h2>
      
      <div className="h-96 flex justify-center">
        <Pie 
          data={chartData}
          options={{
            onClick: handleChartClick,
            plugins: {
              legend: {
                position: 'bottom',
                onClick: (e, legendItem, legend) => {
                  const assetType = legend.chart.data.labels[legendItem.index].toLowerCase();
                  fetchAssetRecords(assetType);
                }
              }
            }
          }}
        />
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
                  <th className="py-2 px-4 border-b">Asset</th>
                  <th className="py-2 px-4 border-b">Amount</th>
                  <th className="py-2 px-4 border-b">Date</th>
                </tr>
              </thead>
              <tbody>
                {assetRecords.map(record => (
                  <tr key={record.id}>
                    <td className="py-2 px-4 border-b">{record.name}</td>
                    <td className="py-2 px-4 border-b">{record.asset}</td>
                    <td className="py-2 px-4 border-b">${record.amount.toLocaleString()}</td>
                    <td className="py-2 px-4 border-b">
                      {new Date(record.create_date).toLocaleDateString('zh-CN', {
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