// TransactionForm.js
import React, { useContext } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TransactionContext } from "../context/useTrans";

const TransactionForm = () => {
  const { addTransaction, transactions } = useContext(TransactionContext);

  const initialValues = { type: "buy", asset: "", amount: 0 };

  const validationSchema = Yup.object({
    asset: Yup.string().required("Asset is required"),
    amount: Yup.number()
      .required("Amount is required")
      .positive("Amount must be positive"),
  });

  const handleSubmit = (values, { resetForm }) => {
    addTransaction(values);
    resetForm();
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-xl mx-auto bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Record Transaction
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
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
                <option value="transfer">Transfer</option>
              </Field>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Asset
              </label>
              <Field
                name="asset"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
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
            <button
              type="submit"
              className="w-full bg-purple-700 text-white p-2 rounded-md hover:bg-purple-600 transition"
            >
              Submit
            </button>
          </Form>
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
                  {transaction.type.charAt(0).toUpperCase() +
                    transaction.type.slice(1)}
                </h4>
                <p className="text-gray-700 mb-2">Asset: {transaction.asset}</p>
                <p className="text-gray-700">Amount: ${transaction.amount}</p>
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
