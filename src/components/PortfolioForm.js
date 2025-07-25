import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import AssestChart from "./AssestChart";
import { useState } from "react";

const PortfolioForm = ({ portfolios, addPortfolio, updatePortfolio }) => {
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [editing, setEditing] = useState(false);

  const initialValues = selectedPortfolio || { name: "", asset: "", value: 0 };

  const validationSchema = Yup.object({
    name: Yup.string().required("Portfolio name is required"),
    asset: Yup.string().required("Asset is required"),
    value: Yup.number()
      .required("Value is required")
      .positive("Value must be positive"),
  });

  const handleSubmit = (values) => {
    if (editing) {
      updatePortfolio(values);
      setEditing(false);
    } else {
      addPortfolio(values);
    }
    setSelectedPortfolio(null);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 mx-auto bg-transparent py-6">
        <div className="w-full bg-white p-6 shadow-lg rounded-lg justify-items-start ">
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editing ? "Edit Portfolio" : "Create New Portfolio"}
            </h2>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              <Form>
                <div className="mb-8">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Portfolio Name
                  </label>
                  <Field
                    name="name"
                    type="text"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
                <div className="mb-8">
                  <label
                    htmlFor="asset"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Asset
                  </label>
                  <Field
                    name="asset"
                    type="text"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  <ErrorMessage
                    name="asset"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
                <div className="mb-8">
                  <label
                    htmlFor="value"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Value
                  </label>
                  <Field
                    name="value"
                    type="number"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  <ErrorMessage
                    name="value"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-700 text-white p-2 rounded-md hover:bg-purple-600 transition"
                >
                  {editing ? "Update Portfolio" : "Create Portfolio"}
                </button>
                {editing && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setSelectedPortfolio(null);
                    }}
                    className="mt-2 w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                )}
              </Form>
            </Formik>
          </div>
        </div>
        <div className="w-full justify-items-end items-end">
          <AssestChart />
        </div>
      </div>
      <div className="mt-8 max-w-6xl mx-auto bg-white p-6 shadow-lg rounded-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-8">
          Existing Portfolios
        </h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {portfolios.length > 0 ? (
            portfolios.map((portfolio, index) => (
              <div
                key={index}
                className="bg-white p-4 shadow-md rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  setSelectedPortfolio(portfolio);
                  setEditing(true);
                }}
              >
                <h4 className="text-lg font-semibold mb-2">{portfolio.name}</h4>
                <p className="text-gray-700 mb-2">Asset: {portfolio.asset}</p>
                <p className="text-gray-700">Value: ${portfolio.value}</p>
              </div>
            ))
          ) : (
            <div className="text-center">
              <p>No portfolios available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioForm;
