export const getAllocationFromRisk = (riskTolerance) => {
    if (typeof riskTolerance !== 'number' || riskTolerance < 1 || riskTolerance > 20) {
      console.error('Invalid risk tolerance. It must be a number between 1 and 20.');
      return []; // Return an empty array or some default allocation
    }
  
    // Proceed with asset allocation logic
    let allocation = [];
  
    if (riskTolerance <= 4) {
      // Very conservative
      allocation = [
        { name: 'Bonds', value: 60 },
        { name: 'Fixed Deposit', value: 20 },
        { name: 'Gold', value: 10 },
        { name: 'Cash', value: 10 },
      ];
    } else if (riskTolerance <= 8) {
      // Conservative
      allocation = [
        { name: 'Bonds', value: 40 },
        { name: 'Fixed Deposit', value: 20 },
        { name: 'Gold', value: 20 },
        { name: 'Stocks', value: 20 },
      ];
    } else if (riskTolerance <= 12) {
      // Moderate
      allocation = [
        { name: 'Bonds', value: 30 },
        { name: 'Stocks', value: 40 },
        { name: 'Real Estate', value: 20 },
        { name: 'Commodities', value: 10 },
      ];
    } else if (riskTolerance <= 16) {
      // Aggressive
      allocation = [
        { name: 'Stocks', value: 50 },
        { name: 'Real Estate', value: 30 },
        { name: 'Gold', value: 10 },
        { name: 'Commodities', value: 10 },
      ];
    } else {
      // Very aggressive
      allocation = [
        { name: 'Stocks', value: 70 },
        { name: 'Real Estate', value: 20 },
        { name: 'Commodities', value: 10 },
      ];
    }
  
    return allocation;
  };