// TransactionReconciliation.js
import React, { useContext, useEffect, useState } from "react";
import { TransactionContext } from "../context/useTrans";

const TransactionReconciliation = () => {
  const { transactions } = useContext(TransactionContext);
  const [expectedTransactions, setExpectedTransactions] = useState([]);
  const [reconciliationResults, setReconciliationResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch expected transactions from API
  useEffect(() => {
    const fetchExpectedTransactions = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/expected-transactions"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();
        setExpectedTransactions(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExpectedTransactions();
  }, []);

  // Perform reconciliation
  const reconcileTransactions = () => {
    const mismatches = [];

    const normalizeTransaction = (transaction) => {
      return {
        id: transaction.id ? transaction.id.trim() : "",
        type: transaction.type ? transaction.type.trim().toLowerCase() : "",
        asset: transaction.asset ? transaction.asset.trim().toLowerCase() : "",
        amount: transaction.amount
          ? parseFloat(transaction.amount).toFixed(2)
          : "0.00",
      };
    };

    const normalizedExpected = expectedTransactions.map(normalizeTransaction);
    const normalizedCurrent = transactions.map(normalizeTransaction);

    normalizedCurrent.forEach((transaction) => {
      const expectedTransaction = normalizedExpected.find(
        (et) =>
          et.type === transaction.type &&
          et.asset === transaction.asset &&
          et.amount === transaction.amount
      );
      if (!expectedTransaction) {
        mismatches.push(transaction);
      }
    });

    setReconciliationResults(mismatches);
  };

  if (loading) {
    return (
      <div className="p-8 bg-gray-100 h-full">
        <div className="max-w-xl mx-auto bg-white p-6 shadow-lg rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            Loading expected transactions...
          </h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gray-100 h-full">
        <div className="max-w-xl mx-auto bg-white p-6 shadow-lg rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Error: {error}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 h-full">
      <div className="max-w-xl mx-auto bg-white p-6 shadow-lg rounded-lg">
        <h3 className="text-lg font-semibold mb-4">
          Transaction Reconciliation
        </h3>

        {/* Display current transactions */}
        <h4 className="text-md font-semibold mb-2">Current Transactions</h4>
        <div className="mb-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-gray-50 p-4 mb-2 border border-gray-200 rounded"
            >
              {transaction.type} - {transaction.asset} - ${transaction.amount}
            </div>
          ))}
        </div>

        {/* Fetch and display expected transactions */}
        <h4 className="text-md font-semibold mb-2">
          Expected Transactions from API
        </h4>
        <div className="mb-4">
          {expectedTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-gray-50 p-4 mb-2 border border-gray-200 rounded"
            >
              {transaction.type} - {transaction.asset} - ${transaction.amount}
            </div>
          ))}
        </div>

        <button
          className="bg-purple-700 hover:bg-purple-600 text-white py-2 px-4 rounded"
          onClick={reconcileTransactions}
          disabled={expectedTransactions.length === 0}
        >
          Reconcile Transactions
        </button>

        {/* Display reconciliation results */}
        {reconciliationResults && (
          <div className="mt-4">
            <h4 className="text-md font-semibold mb-2">
              Reconciliation Results
            </h4>
            {reconciliationResults.length > 0 ? (
              <div className="text-red-500">
                {reconciliationResults.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="bg-red-50 p-4 mb-2 border border-red-200 rounded"
                  >
                    Mismatch: {transaction.type} - {transaction.asset} - $
                    {transaction.amount}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-green-500">All transactions match!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionReconciliation;
