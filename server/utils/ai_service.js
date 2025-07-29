const { getCurrentAIService, isAIServiceAvailable } = require('../config/ai_config');

class AIService {
  constructor() {
    this.currentService = getCurrentAIService();
  }

  // Check if AI service is available
  isAvailable() {
    return isAIServiceAvailable();
  }

  // Generate investment advice prompt
  generateInvestmentPrompt(message, transactionData) {
    const basePrompt = `You are a professional investment advisor AI assistant. Please provide professional and accurate investment advice based on the user's investment questions.

User Question: ${message}

Transaction Information:
- Asset Type: ${transactionData?.asset || 'Not specified'}
- Transaction Amount: $${Math.abs(transactionData?.amount || 0)}
- Company Name: ${transactionData?.name || 'Not specified'}
- Transaction Type: ${transactionData?.type || 'Not specified'}

Please provide advice in the following areas:
1. Transaction risk assessment
2. Market environment analysis
3. Investment strategy recommendations
4. Risk control measures

Please answer in English and maintain a professional, objective tone.`;

    return basePrompt;
  }

  // Call OpenAI API
  async callOpenAI(prompt) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.currentService.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.currentService.config.model,
          messages: [
            {
              role: 'system',
              content: 'You are a professional investment advisor, skilled in analyzing investment risks and providing investment advice.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: this.currentService.config.maxTokens,
          temperature: this.currentService.config.temperature
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }

  // Call DeepSeek API
  async callDeepSeek(prompt) {
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.currentService.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.currentService.config.model,
          messages: [
            {
              role: 'system',
              content: 'You are a professional investment advisor, skilled in analyzing investment risks and providing investment advice.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: this.currentService.config.maxTokens,
          temperature: this.currentService.config.temperature
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('DeepSeek API Error:', error);
      throw error;
    }
  }

  // Call Baidu Wenxin API
  async callBaidu(prompt) {
    try {
      // First get access token
      const tokenResponse = await fetch(`https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${this.currentService.config.apiKey}&client_secret=${this.currentService.config.secretKey}`, {
        method: 'POST'
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to get Baidu access token');
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // Call Wenxin API
      const response = await fetch(`https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions?access_token=${accessToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a professional investment advisor, skilled in analyzing investment risks and providing investment advice.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_output_tokens: this.currentService.config.maxTokens,
          temperature: this.currentService.config.temperature
        }),
      });

      if (!response.ok) {
        throw new Error(`Baidu API error: ${response.status}`);
      }

      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Baidu API Error:', error);
      throw error;
    }
  }

  // Call Alibaba Tongyi Qianwen API
  async callAlibaba(prompt) {
    try {
      const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.currentService.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.currentService.config.model,
          input: {
            messages: [
              {
                role: 'system',
                content: 'You are a professional investment advisor, skilled in analyzing investment risks and providing investment advice.'
              },
              {
                role: 'user',
                content: prompt
              }
            ]
          },
          parameters: {
            max_tokens: this.currentService.config.maxTokens,
            temperature: this.currentService.config.temperature
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Alibaba API error: ${response.status}`);
      }

      const data = await response.json();
      return data.output.text;
    } catch (error) {
      console.error('Alibaba API Error:', error);
      throw error;
    }
  }

  // Main AI call method
  async generateResponse(message, transactionData) {
    if (!this.isAvailable()) {
      throw new Error('AI service is not available, please check API configuration');
    }

    const prompt = this.generateInvestmentPrompt(message, transactionData);
    const serviceName = this.currentService.name;

    try {
      let response;
      
      switch (serviceName) {
        case 'OpenAI GPT':
          response = await this.callOpenAI(prompt);
          break;
        case 'DeepSeek':
          response = await this.callDeepSeek(prompt);
          break;
        case '百度文心一言':
          response = await this.callBaidu(prompt);
          break;
        case '阿里通义千问':
          response = await this.callAlibaba(prompt);
          break;
        default:
          throw new Error(`Unsupported AI service: ${serviceName}`);
      }

      return response;
    } catch (error) {
      console.error(`AI Service Error (${serviceName}):`, error);
      throw error;
    }
  }
}

module.exports = AIService; 