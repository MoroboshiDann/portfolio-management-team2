// TransactionForm.js
import React, { useContext, useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TransactionContext } from "../context/useTrans";
import CompanyAutoComplete from './CompanyAutoComplete';
import AIChatBox from './AIChatBox';

const TransactionForm = () => {
  const { addTransaction, transactions } = useContext(TransactionContext);
  const [submitStatus, setSubmitStatus] = useState({ message: '', type: '' });
  const [companyInput, setCompanyInput] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const [currentTransactionData, setCurrentTransactionData] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPrice, setCurrentPrice] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedCompanyOption, setSelectedCompanyOption] = useState(null);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Check if date is weekend (Saturday = 6, Sunday = 0)
  const isWeekend = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  // Check if date is today
  const isToday = (dateString) => {
    return dateString === getTodayDate();
  };

  // Check if transaction type should be disabled
  const shouldDisableTransactionType = (dateString) => {
    if (!dateString) return false;
    return !isToday(dateString);
  };

    // Function to get asset price from backend
  const getAssetPrice = async (asset, companyName, date) => {
    try {
      // 如果有选中的公司选项，使用其stock code进行查询
      let queryCompanyName = companyName;
      if (selectedCompanyOption && asset === 'stocks') {
        queryCompanyName = selectedCompanyOption.stockCode;
        console.log(`Using stock code from selected option: ${queryCompanyName}`);
      } else {
        // 清理公司名称，移除可能的标签文本
        queryCompanyName = companyName.replace(/\s*\([^)]*\)\s*$/, '').trim();
        console.log(`Using cleaned company name: ${queryCompanyName}`);
      }
       
      const response = await fetch(`/api/enhanced-trans-form/price?asset=${asset}&companyName=${encodeURIComponent(queryCompanyName)}&date=${date}`);
      if (response.ok) {
        const data = await response.json();
        return data.price;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch price');
      }
    } catch (error) {
      console.error('Error fetching asset price:', error);
      throw error;
    }
  };

  // Function to calculate amount from quantity
  const calculateAmountFromQuantity = async (quantity, type, companyName, date, setFieldValue) => {
    if (!quantity || !type || !companyName || !date) return;
    
    setIsCalculating(true);
    try {
      const price = await getAssetPrice(type, companyName, date);
      setCurrentPrice(price);
      const amount = quantity * price;
      setFieldValue('amount', amount.toFixed(2));
    } catch (error) {
      setSubmitStatus({ message: `Error calculating amount: ${error.message}`, type: 'error' });
    } finally {
      setIsCalculating(false);
    }
  };

  // Function to calculate quantity from amount
  const calculateQuantityFromAmount = async (amount, type, companyName, date, setFieldValue) => {
    if (!amount || !type || !companyName || !date) return;
    
    setIsCalculating(true);
    try {
      const price = await getAssetPrice(type, companyName, date);
      setCurrentPrice(price);
      const quantity = amount / price;
      setFieldValue('quantity', quantity.toFixed(5));
    } catch (error) {
      setSubmitStatus({ message: `Error calculating quantity: ${error.message}`, type: 'error' });
    } finally {
      setIsCalculating(false);
    }
  };

  const initialValues = { 
    transactionType: "buy", 
    type: "Cash", 
    amount: 0, 
    quantity: 0,
    name: "",
    date: getTodayDate()
  };

  const validationSchema = Yup.object({
    type: Yup.string().required("Asset type is required"),
    amount: Yup.number()
      .required("Amount is required")
      .positive("Amount must be positive"),
    quantity: Yup.number()
      .required("Quantity is required")
      .positive("Quantity must be positive"),
    name: Yup.string().required("Name is required"),
    date: Yup.date()
      .required("Date is required")
      .test('not-weekend', 'Cannot select weekends (Saturday or Sunday)', function(value) {
        if (!value) return true;
        return !isWeekend(value);
      })
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      // Clean company name (remove [CompanyName] suffix if present)
      const cleanCompanyName = values.name.replace(/\[CompanyName\]$/, '');
      
      const transactionData = {
        transactionType: values.transactionType,
        type: values.type,
        amount: values.amount,
        quantity: values.quantity,
        name: cleanCompanyName,
        date: values.date
      };

      const response = await fetch('/api/enhanced-trans-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        const result = await response.json();
        addTransaction({ ...result.data, id: result.id });
        setSubmitStatus({ message: 'Transaction saved successfully!', type: 'success' });
        resetForm();
        setSelectedDate('');
        setCurrentPrice(null);
      } else {
        const errorData = await response.json();
        setSubmitStatus({ message: errorData.error || 'Failed to save transaction', type: 'error' });
      }
    } catch (error) {
      console.error('Error submitting transaction:', error);
      setSubmitStatus({ message: 'Error saving transaction', type: 'error' });
    }
  };

  const handleAIConsultation = (values) => {
    const cleanCompanyName = values.name.replace(/\[CompanyName\]$/, '');
    const transactionData = {
      type: values.type,
      amount: values.amount,
      quantity: values.quantity,
      name: cleanCompanyName,
      transactionType: values.transactionType,
      date: values.date
    };
    setCurrentTransactionData(transactionData);
    setShowAIChat(true);
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
          {({ setFieldValue, values, setFieldTouched }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <Field
                  name="date"
                  type="date"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  onChange={(e) => {
                    const dateValue = e.target.value;
                    setSelectedDate(dateValue);
                    setFieldValue('date', dateValue);
                    
                    // If not today, force transaction type to 'buy'
                    if (dateValue && !isToday(dateValue)) {
                      setFieldValue('transactionType', 'buy');
                    }
                    
                    setFieldTouched('date', true);
                  }}
                />
                <ErrorMessage
                  name="date"
                  component="div"
                  className="text-red-500 text-xs"
                />
                {selectedDate && isWeekend(selectedDate) && (
                  <div className="text-red-500 text-xs mt-1">
                    Weekends are not allowed for transactions
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Transaction Type
                </label>
                <Field
                  as="select"
                  name="transactionType"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="buy">Buy</option>
                  {isToday(selectedDate) && (
                    <option value="sell">Sell</option>
                  )}
                </Field>
                {selectedDate && !isToday(selectedDate) && (
                  <div className="text-blue-600 text-xs mt-1">
                    Sell option is only available for today's date
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Asset Type
                </label>
                <Field
                  as="select"
                  name="type"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select an asset type</option>
                                     <option value="stocks">stocks</option>
                  <option value="mutual funds">mutual funds</option>
                  <option value="gold">gold</option>
                                     <option value="fixed deposite">fixed deposite</option>
                  <option value="real estate">real estate</option>
                  <option value="bonds">bonds</option>
                </Field>
                <ErrorMessage
                  name="type"
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
                  onOptionSelect={option => {
                    setSelectedCompanyOption(option);
                  }}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <Field
                    name="quantity"
                    type="number"
                    step="0.00001"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    onChange={(e) => {
                      const quantityValue = e.target.value;
                      setFieldValue('quantity', quantityValue);
                      
                                             // Calculate amount from quantity
                       if (quantityValue && values.type && values.name && values.date) {
                         calculateAmountFromQuantity(quantityValue, values.type, values.name, values.date, setFieldValue);
                       }
                    }}
                  />
                  <ErrorMessage
                    name="quantity"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Amount ($)
                  </label>
                  <Field
                    name="amount"
                    type="number"
                    step="0.01"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    onChange={(e) => {
                      const amountValue = e.target.value;
                      setFieldValue('amount', amountValue);
                      
                                             // Calculate quantity from amount
                       if (amountValue && values.type && values.name && values.date) {
                         calculateQuantityFromAmount(amountValue, values.type, values.name, values.date, setFieldValue);
                       }
                    }}
                  />
                  <ErrorMessage
                    name="amount"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
              </div>

              {currentPrice && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-700">
                    Current Price: ${currentPrice.toFixed(2)} per unit
                  </p>
                </div>
              )}

              {isCalculating && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-700">
                    Calculating price...
                  </p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => handleAIConsultation(values)}
                  className="flex-1 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-500 transition flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>AI Consultation</span>
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-700 text-white p-2 rounded-md hover:bg-purple-600 transition"
                  disabled={isCalculating}
                >
                  Submit
                </button>
              </div>
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
                  {transaction.amount > 0 ? 'Buy' : 'Sell'}
                </h4>
                <p className="text-gray-700 mb-2">Asset: {transaction.type}</p>
                <p className="text-gray-700 mb-2">Name: {transaction.name}</p>
                <p className="text-gray-700 mb-2">Quantity: {transaction.quantity}</p>
                <p className="text-gray-700 mb-2">Amount: ${Math.abs(transaction.amount)}</p>
                <p className="text-gray-700">Date: {transaction.date || 'N/A'}</p>
              </div>
            ))
          ) : (
            <p>No transactions recorded.</p>
          )}
        </div>
      </div>

      {/* AI Chat Box */}
      {showAIChat && (
        <AIChatBox
          transactionData={currentTransactionData}
          onClose={() => setShowAIChat(false)}
        />
      )}
    </div>
  );
};

export default TransactionForm;
