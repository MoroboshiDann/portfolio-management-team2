// TransactionForm.js
import React, { useContext, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TransactionContext } from "../context/useTrans";
import CompanyAutoComplete from './CompanyAutoComplete';

const TransactionForm = () => {
  const { addTransaction, transactions } = useContext(TransactionContext);
  const [submitStatus, setSubmitStatus] = useState({ message: '', type: '' });
  const [companyInput, setCompanyInput] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);

  const initialValues = { type: "buy", asset: "Cash", amount: 0, name: "" };

  const validationSchema = Yup.object({
    asset: Yup.string().required("Asset is required"),
    amount: Yup.number()
      .required("Amount is required")
      .positive("Amount must be positive"),
    name: Yup.string().required("Name is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      // Adjust amount based on transaction type
      const adjustedAmount = values.type === 'buy' ? -Math.abs(values.amount) : Math.abs(values.amount);
      
      const transactionData = {
        asset: values.asset,
        amount: adjustedAmount,
        name: values.name
      };

      const response = await fetch('/api/trans-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        const result = await response.json();
        addTransaction({ ...transactionData, id: result.id });
        setSubmitStatus({ message: 'Transaction saved successfully!', type: 'success' });
        resetForm();
      } else {
        setSubmitStatus({ message: 'Failed to save transaction', type: 'error' });
      }
    } catch (error) {
      console.error('Error submitting transaction:', error);
      setSubmitStatus({ message: 'Error saving transaction', type: 'error' });
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-xl mx-auto bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Record Transaction
        </h2>
        
        {submitStatus.message && (
          <div className={`mb-4 p-3 rounded-md ${
            submitStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {submitStatus.message}
          </div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Transaction Type
                </label>
                <Field
                  as="select"
                  name="type"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                </Field>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Asset
                </label>
                <Field
                  as="select"
                  name="asset"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select an asset</option>
                  <option value="Cash">Cash</option>
                  <option value="Stock">Stock</option>
                  <option value="Bonds">Bonds</option>
                  <option value="Real Estate">Real Estate</option>
                </Field>
                <ErrorMessage
                  name="asset"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <Field
                  name="amount"
                  type="number"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
                <ErrorMessage
                  name="amount"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <CompanyAutoComplete
                  value={companyInput}
                  onChange={val => {
                    setCompanyInput(val);
                    setFieldValue('name', val);
                  }}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-700 text-white p-2 rounded-md hover:bg-purple-600 transition"
              >
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>

      <div className="max-w-xl mx-auto bg-white p-6 shadow-lg rounded-lg mt-6">
        {/* Transaction History */}
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Transaction History
        </h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white p-4 shadow-md rounded-lg border border-gray-300"
              >
                <h4 className="text-lg font-semibold mb-2">
                  {transaction.amount < 0 ? 'Buy' : 'Sell'}
                </h4>
                <p className="text-gray-700 mb-2">Asset: {transaction.asset}</p>
                <p className="text-gray-700 mb-2">Name: {transaction.name}</p>
                <p className="text-gray-700">Amount: ${Math.abs(transaction.amount)}</p>
              </div>
            ))
          ) : (
            <p>No transactions recorded.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;
