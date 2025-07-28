// TransactionReconciliation.js
// import React, { useContext, useEffect, useState } from "react";
// import { TransactionContext } from "../context/useTrans";
import React, { useState } from 'react';
import {
  FaCoins,
  FaBuilding,
  FaChartLine,
  FaPiggyBank,
  FaBalanceScale,
  FaShieldAlt,
} from 'react-icons/fa';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';

const FinancialAdvice = () => {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Investment Advice for Investors</h1>

      {/* Asset Allocation Recommendations */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Asset Allocation</h2>

        {/* Stocks */}
        <div
          className="p-4 border-b cursor-pointer hover:bg-gray-50 transition"
          onClick={() => toggleSection('stocks')}
        >
          <div className="flex justify-between items-center">
            <span>
              <FaChartLine className="inline-block text-blue-500 mr-2" />
              <strong>Stocks</strong>
            </span>
            {openSections.stocks ? <MdExpandLess /> : <MdExpandMore />}
          </div>
          {openSections.stocks && (
            <p className="mt-4 text-gray-700">
              Stocks represent ownership in a company and offer high potential returns due to their volatility. It's advisable to diversify investments across industries and choose blue-chip stocks for stability. Consider index funds or diversified equity mutual funds for reduced risk. Stocks are ideal for long-term growth and require a higher risk tolerance. 
              <br />
              When investing in stocks, always do thorough research and avoid speculative buying. Utilize dollar-cost averaging to minimize market fluctuations. Be prepared for short-term losses, and invest with a long-term perspective. Review your portfolio periodically and rebalance as needed.
            </p>
          )}
        </div>

        {/* Mutual Funds */}
        <div
          className="p-4 border-b cursor-pointer hover:bg-gray-50 transition"
          onClick={() => toggleSection('mutualFunds')}
        >
          <div className="flex justify-between items-center">
            <span>
              <FaCoins className="inline-block text-green-500 mr-2" />
              <strong>Mutual Funds</strong>
            </span>
            {openSections.mutualFunds ? <MdExpandLess /> : <MdExpandMore />}
          </div>
          {openSections.mutualFunds && (
            <p className="mt-4 text-gray-700">
              Mutual funds pool money from multiple investors to invest in a diversified portfolio of stocks, bonds, or other assets. This approach reduces individual risk and provides professional management. Ideal for beginners, mutual funds come in various types, including equity, debt, and balanced funds.
              <br />
              Equity funds offer growth potential, while debt funds provide stability. Balanced funds combine both. Consider the fund's track record, fees, and fund manager's expertise before investing. Mutual funds can be used to achieve specific financial goals and are suitable for regular investment through systematic investment plans (SIPs).
            </p>
          )}
        </div>

        {/* Gold */}
        <div
          className="p-4 border-b cursor-pointer hover:bg-gray-50 transition"
          onClick={() => toggleSection('gold')}
        >
          <div className="flex justify-between items-center">
            <span>
              <FaBalanceScale className="inline-block text-yellow-500 mr-2" />
              <strong>Gold</strong>
            </span>
            {openSections.gold ? <MdExpandLess /> : <MdExpandMore />}
          </div>
          {openSections.gold && (
            <p className="mt-4 text-gray-700">
              Gold is a traditional store of value, often considered a safe-haven asset during economic uncertainty. Investing in gold can be done through physical gold, gold ETFs, or sovereign gold bonds. Gold is also a hedge against inflation, offering protection during periods of currency devaluation.
              <br />
              Consider diversifying your portfolio with a small allocation to gold. Sovereign gold bonds offer interest payments, making them attractive to long-term investors. Gold ETFs provide liquidity and are easier to trade. Avoid over-investing in gold, as it doesn't generate income like other assets.
            </p>
          )}
        </div>

        {/* Fixed Deposits */}
        <div
          className="p-4 border-b cursor-pointer hover:bg-gray-50 transition"
          onClick={() => toggleSection('fixedDeposits')}
        >
          <div className="flex justify-between items-center">
            <span>
              <FaPiggyBank className="inline-block text-pink-500 mr-2" />
              <strong>Fixed Deposits</strong>
            </span>
            {openSections.fixedDeposits ? <MdExpandLess /> : <MdExpandMore />}
          </div>
          {openSections.fixedDeposits && (
            <p className="mt-4 text-gray-700">
              Fixed deposits are low-risk investments offering stable returns. They are suitable for conservative investors and are ideal for parking emergency funds. Fixed deposits have a predetermined interest rate and term, providing predictable returns.
              <br />
              Consider laddering fixed deposits for liquidity. This involves investing in multiple deposits with different maturity dates. Fixed deposits are generally insured by the government, offering added security. However, early withdrawal may result in penalties, so consider your liquidity needs.
            </p>
          )}
        </div>

        {/* Real Estate */}
        <div
          className="p-4 border-b cursor-pointer hover:bg-gray-50 transition"
          onClick={() => toggleSection('realEstate')}
        >
          <div class="flex justify-between items-center">
            <span>
              <FaBuilding className="inline-block text-purple-500 mr-2" />
              <strong>Real Estate</strong>
            </span>
            {openSections.realEstate ? <MdExpandLess /> : <MdExpandMore />}
          </div>
          {openSections.realEstate && (
            <p className="mt-4 text-gray-700">
              Real estate is a long-term investment that can offer capital appreciation and rental income. Consider investing in residential or commercial property, or opt for real estate investment trusts (REITs) for a more liquid approach. Real estate can diversify a portfolio and hedge against market fluctuations.
              <br />
              When investing in real estate, research the location, market trends, and potential returns. Consider property maintenance costs, rental management, and taxes. REITs offer diversification and can be traded like stocks, making them suitable for smaller investors. Avoid overleveraging and maintain a balanced portfolio.
            </p>
          )}
        </div>

        {/* Life Insurance */}
        <div
          className="p-4 cursor-pointer hover:bg-gray-50 transition"
          onClick={() => toggleSection('lifeInsurance')}
        >
          <div class="flex justify-between items-center">
            <span>
              <FaShieldAlt className="inline-block text-red-500 mr-2" />
              <strong>Life Insurance</strong>
            </span>
            {openSections.lifeInsurance ? <MdExpandLess /> : <MdExpandMore />}
          </div>
          {openSections.lifeInsurance && (
            <p className="mt-4 text-gray-700">
              Life insurance provides financial protection for your loved ones in the event of your passing. Term insurance is the most cost-effective option, offering a high coverage-to-cost ratio. It provides a payout to beneficiaries if the policyholder dies during the term.
              <br />
              Consider your financial obligations and coverage needs before purchasing life insurance. Focus on term insurance rather than whole life or endowment policies, which often carry higher costs and lower returns. Review your policy periodically and ensure it aligns with your current financial situation.
            </p>
          )}
        </div>
      </div>

      {/* Emergency Fund Recommendations */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Emergency Fund</h2>
        <p className="text-gray-700">
          An emergency fund is essential for covering unexpected expenses. It should cover 3-6 months of living expenses and be easily accessible. Keep it in cash or cash-equivalent assets like savings accounts, fixed deposits, or liquid mutual funds.
          <br />
          Consider creating an emergency fund before investing in riskier assets. This ensures you have a financial safety net for emergencies like job loss, medical expenses, or unexpected repairs. Reassess your emergency fund periodically to ensure it meets your current needs.
        </p>
      </div>
    </div>
  );
};

export default FinancialAdvice;

