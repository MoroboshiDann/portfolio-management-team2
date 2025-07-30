# AI Investment Advisor Integration Guide

## Feature Overview

This project has successfully integrated AI investment advisor functionality, allowing users to receive AI intelligent advice when making buy/sell transactions, helping them make wiser investment decisions.

## Main Features

### 1. AI Chat Box
- Real-time AI investment advice
- Transaction risk assessment
- Market environment analysis
- Investment strategy recommendations

### 2. Supported AI Services
- OpenAI GPT (ChatGPT)
- DeepSeek
- Baidu Wenxin
- Alibaba Tongyi Qianwen

### 3. Intelligent Analysis
- Personalized recommendations based on transaction data
- Risk assessment and mitigation measures
- Market trend analysis
- Portfolio optimization suggestions

## Configuration Instructions

### 1. Environment Variable Configuration

Create a `.env` file in the `server` directory and add the following configuration:

```env
# Choose AI service to use: openai, deepseek, baidu, alibaba
AI_SERVICE=openai

# OpenAI configuration
OPENAI_API_KEY=your_openai_api_key_here

# DeepSeek configuration
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# Baidu Wenxin configuration
BAIDU_API_KEY=your_baidu_api_key_here
BAIDU_SECRET_KEY=your_baidu_secret_key_here

# Alibaba Tongyi Qianwen configuration
ALIBABA_API_KEY=your_alibaba_api_key_here
```

### 2. API Key Acquisition

#### OpenAI
1. Visit https://platform.openai.com/
2. Register an account and log in
3. Create a new API key on the API Keys page
4. Copy the key to environment variables

#### DeepSeek
1. Visit https://platform.deepseek.com/
2. Register an account and log in
3. Get API key
4. Copy the key to environment variables

#### Baidu Wenxin
1. Visit https://cloud.baidu.com/product/wenxinworkshop
2. Register a Baidu Smart Cloud account
3. Enable Wenxin service
4. Get API Key and Secret Key

#### Alibaba Tongyi Qianwen
1. Visit https://dashscope.aliyun.com/
2. Register an Alibaba Cloud account
3. Enable Tongyi Qianwen service
4. Get API key

## Usage Instructions

### 1. Start Services
```bash
# Start backend service
cd server
npm install
npm start

# Start frontend service
cd ..
npm install
npm start
```

### 2. Use AI Advisor
1. Navigate to the transaction form page
2. Fill in transaction information (asset type, amount, company name, etc.)
3. Click the "AI Consultation" button
4. Chat with AI in the popup chat box
5. Get professional investment advice

### 3. Quick Questions
The AI chat box provides some quick question buttons:
- What are the risks of this transaction?
- What is the current market environment?
- What investment advice do you have?
- Should I buy or sell?

## Technical Architecture

### Frontend Components
- `AIChatBox.js` - AI chat box component
- `TransactionForm.js` - Transaction form with integrated AI consultation functionality

### Backend Services
- `ai_advisor.js` - AI advisor API routes
- `ai_service.js` - AI service utility class
- `ai_config.js` - AI configuration file

### API Endpoints
- `POST /api/ai-advisor/chat` - AI chat interface
- `GET /api/ai-advisor/suggestions` - Get suggestion questions

## Security Considerations

1. **API Key Security**
   - Do not commit API keys to code repositories
   - Use environment variables to store sensitive information
   - Regularly rotate API keys

2. **Data Privacy**
   - Transaction data is only used for generating AI advice
   - User conversation history is not stored
   - Follow data protection regulations

3. **Service Limitations**
   - Set API call frequency limits
   - Monitor API usage
   - Set reasonable timeout times

## Troubleshooting

### 1. AI Service Unavailable
- Check if API keys are correct
- Confirm network connection is normal
- Check server logs

### 2. Slow Response
- Check AI service status
- Optimize network connection
- Consider using local caching

### 3. Error Handling
- System automatically degrades to mock response
- Check browser console error messages
- Check server logs

## Extension Features

### 1. Add New AI Services
1. Add new service configuration in `ai_config.js`
2. Implement API call methods in `ai_service.js`
3. Update service selection logic

### 2. Enhanced Analysis Features
- Integrate real-time market data
- Add technical analysis indicators
- Implement portfolio optimization algorithms

### 3. Personalization Settings
- User risk preference settings
- Investment goal configuration
- Customize AI advice style

## License

This project follows the MIT license, and the use of AI services needs to comply with the terms and conditions of their respective service providers. 