// AI configuration file - for managing API keys and configurations of different AI services

// OpenAI configuration
const OPENAI_CONFIG = {
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-3.5-turbo',
  maxTokens: 1000,
  temperature: 0.7
};

// DeepSeek configuration
const DEEPSEEK_CONFIG = {
  apiKey: process.env.DEEPSEEK_API_KEY,
  model: 'deepseek-chat',
  maxTokens: 1000,
  temperature: 0.7
};

// Baidu Wenxin configuration
const BAIDU_CONFIG = {
  apiKey: process.env.BAIDU_API_KEY,
  secretKey: process.env.BAIDU_SECRET_KEY,
  model: 'ernie-bot-4',
  maxTokens: 1000
};

// Alibaba Tongyi Qianwen configuration
const ALIBABA_CONFIG = {
  apiKey: process.env.ALIBABA_API_KEY,
  model: 'qwen-turbo',
  maxTokens: 1000
};

// Currently used AI service
const CURRENT_AI_SERVICE = process.env.AI_SERVICE || 'openai'; // Options: openai, deepseek, baidu, alibaba

// AI service configuration mapping
const AI_SERVICES = {
  openai: {
    name: 'OpenAI GPT',
    config: OPENAI_CONFIG,
    enabled: !!OPENAI_CONFIG.apiKey
  },
  deepseek: {
    name: 'DeepSeek',
    config: DEEPSEEK_CONFIG,
    enabled: !!DEEPSEEK_CONFIG.apiKey
  },
  baidu: {
    name: 'Baidu Wenxin',
    config: BAIDU_CONFIG,
    enabled: !!(BAIDU_CONFIG.apiKey && BAIDU_CONFIG.secretKey)
  },
  alibaba: {
    name: 'Alibaba Tongyi Qianwen',
    config: ALIBABA_CONFIG,
    enabled: !!ALIBABA_CONFIG.apiKey
  }
};

// Get current AI service configuration
const getCurrentAIService = () => {
  return AI_SERVICES[CURRENT_AI_SERVICE] || AI_SERVICES.openai;
};

// Check if AI service is available
const isAIServiceAvailable = () => {
  const currentService = getCurrentAIService();
  return currentService.enabled;
};

// Get AI service list
const getAvailableAIServices = () => {
  return Object.entries(AI_SERVICES)
    .filter(([key, service]) => service.enabled)
    .map(([key, service]) => ({
      key,
      name: service.name,
      config: service.config
    }));
};

module.exports = {
  AI_SERVICES,
  getCurrentAIService,
  isAIServiceAvailable,
  getAvailableAIServices,
  CURRENT_AI_SERVICE
}; 