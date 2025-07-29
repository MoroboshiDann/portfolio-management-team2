const express = require('express');
const router = express.Router();
const AIService = require('../utils/ai_service');

// AI Advisor API endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, transactionData } = req.body;
    
    // 创建AI服务实例
    const aiService = new AIService();
    
    // Check if AI service is available
    if (!aiService.isAvailable()) {
      // If AI service is not available, use mock response
      console.log('AI service not available, using mock response');
      let aiResponse = '';
      
      // Generate response based on user message and transaction data
      if (message.toLowerCase().includes('buy') || message.toLowerCase().includes('买入')) {
        aiResponse = `Investment advice for your buy transaction:
        
📊 Transaction Analysis:
- Asset Type: ${transactionData?.asset || 'Not specified'}
- Transaction Amount: $${Math.abs(transactionData?.amount || 0)}
- Company Name: ${transactionData?.name || 'Not specified'}

💡 AI Recommendations:
${transactionData?.asset === 'Stock' ? 
  '• Consider fundamental analysis before buying stocks\n• Evaluate current market trends and industry outlook\n• Diversify your investments, avoid putting all funds in a single stock' :
  transactionData?.asset === 'Bonds' ?
  '• Bond investments are relatively stable, suitable for conservative investors\n• Pay attention to bond ratings and maturity dates\n• Consider the impact of interest rate environment on bond prices' :
  transactionData?.asset === 'Real Estate' ?
  '• Real estate investments require long-term holding\n• Evaluate location and rental return rates\n• Consider maintenance costs and market cycles' :
  '• Cash management is an important component of investment portfolio\n• Maintain appropriate liquidity\n• Consider inflation impact on cash value'
}

⚠️ Risk Reminders:
• Investment involves risks, enter the market with caution
• Make decisions based on your personal risk tolerance
• Past performance does not guarantee future returns`;
      } else if (message.toLowerCase().includes('sell') || message.toLowerCase().includes('Sell')) {
        aiResponse = `Investment advice for your sell transaction:
        
📊 Transaction Analysis:
- Asset Type: ${transactionData?.asset || 'Not specified'}
- Transaction Amount: $${Math.abs(transactionData?.amount || 0)}
- Company Name: ${transactionData?.name || 'Not specified'}

💡 AI Recommendations:
• Evaluate current market environment and asset performance
• Consider tax implications and transaction costs
• Confirm if the selling timing is appropriate

⚠️ Considerations:
• Avoid emotional trading decisions
• Consider if there are better investment opportunities
• Consider selling in batches to reduce market impact`;
      } else if (message.toLowerCase().includes('risk') || message.toLowerCase().includes('Risk')) {
        aiResponse = `Risk Assessment Analysis:
        
🔍 Current Transaction Risk Factors:
• Market volatility risk
• Liquidity risk
• Credit risk (if applicable)
• Exchange rate risk (if applicable)

📈 Risk Mitigation Recommendations:
• Set stop-loss points
• Diversify investment portfolio
• Regular rebalancing
• Maintain long-term investment perspective`;
      } else if (message.toLowerCase().includes('market') || message.toLowerCase().includes('Market')) {
        aiResponse = `Market Analysis:
        
📊 Current Market Trends:
• Monitor macroeconomic indicators
• Observe industry rotation patterns
• Analyze market sentiment indicators

💼 Investment Strategy Recommendations:
• Consider value investing vs growth investing
• Focus on defensive asset allocation
• Maintain portfolio diversification`;
      } else {
        aiResponse = `I understand your question. As an AI investment advisor, I can help you:
        
• Analyze the rationality of trading decisions
• Assess investment risks and returns
• Provide market trend analysis
• Suggest portfolio optimization strategies

Please tell me what you would like to know specifically, such as:
- What are the risks of this transaction?
- What is the current market environment?
- What investment advice do you have?`;
      }

      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      res.json({
        success: true,
        response: aiResponse,
        timestamp: new Date().toISOString(),
        service: 'Mock AI Service'
      });
      return;
    }
    
    // Use real AI service
    console.log('Using real AI service');
    const aiResponse = await aiService.generateResponse(message, transactionData);
    
    res.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString(),
      service: aiService.currentService.name
    });
    
  } catch (error) {
    console.error('AI Advisor API Error:', error);
    res.status(500).json({
      success: false,
      error: 'AI service is temporarily unavailable, please try again later'
    });
  }
});

// Get AI suggestion quick prompts
router.get('/suggestions', (req, res) => {
  const suggestions = [
    "What are the risks of this transaction?",
    "What is the current market environment?",
    "What investment advice do you have?",
    "Should I buy or sell?",
    "How to evaluate this investment opportunity?",
    "What risks should I be aware of?"
  ];
  
  res.json({
    success: true,
    suggestions
  });
});

module.exports = router; 