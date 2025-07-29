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

## 配置说明

### 1. 环境变量配置

在 `server` 目录下创建 `.env` 文件，添加以下配置：

```env
# 选择要使用的AI服务: openai, deepseek, baidu, alibaba
AI_SERVICE=openai

# OpenAI配置
OPENAI_API_KEY=your_openai_api_key_here

# DeepSeek配置
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# 百度文心一言配置
BAIDU_API_KEY=your_baidu_api_key_here
BAIDU_SECRET_KEY=your_baidu_secret_key_here

# 阿里通义千问配置
ALIBABA_API_KEY=your_alibaba_api_key_here
```

### 2. API密钥获取

#### OpenAI
1. 访问 https://platform.openai.com/
2. 注册账号并登录
3. 在API Keys页面创建新的API密钥
4. 复制密钥到环境变量

#### DeepSeek
1. 访问 https://platform.deepseek.com/
2. 注册账号并登录
3. 获取API密钥
4. 复制密钥到环境变量

#### 百度文心一言
1. 访问 https://cloud.baidu.com/product/wenxinworkshop
2. 注册百度智能云账号
3. 开通文心一言服务
4. 获取API Key和Secret Key

#### 阿里通义千问
1. 访问 https://dashscope.aliyun.com/
2. 注册阿里云账号
3. 开通通义千问服务
4. 获取API密钥

## 使用方法

### 1. 启动服务
```bash
# 启动后端服务
cd server
npm install
npm start

# 启动前端服务
cd ..
npm install
npm start
```

### 2. 使用AI顾问
1. 进入交易表单页面
2. 填写交易信息（资产类型、金额、公司名称等）
3. 点击"AI咨询"按钮
4. 在弹出的聊天框中与AI对话
5. 获得专业的投资建议

### 3. 快速问题
AI聊天框提供了一些快速问题按钮：
- 这笔交易的风险如何？
- 当前市场环境如何？
- 有什么投资建议？
- 我应该买入还是卖出？

## 技术架构

### 前端组件
- `AIChatBox.js` - AI聊天框组件
- `TransactionForm.js` - 集成了AI咨询功能的交易表单

### 后端服务
- `ai_advisor.js` - AI顾问API路由
- `ai_service.js` - AI服务工具类
- `ai_config.js` - AI配置文件

### API端点
- `POST /api/ai-advisor/chat` - AI聊天接口
- `GET /api/ai-advisor/suggestions` - 获取建议问题

## 安全注意事项

1. **API密钥安全**
   - 不要将API密钥提交到代码仓库
   - 使用环境变量存储敏感信息
   - 定期轮换API密钥

2. **数据隐私**
   - 交易数据仅用于生成AI建议
   - 不存储用户对话历史
   - 遵循数据保护法规

3. **服务限制**
   - 设置API调用频率限制
   - 监控API使用量
   - 设置合理的超时时间

## 故障排除

### 1. AI服务不可用
- 检查API密钥是否正确
- 确认网络连接正常
- 查看服务器日志

### 2. 响应缓慢
- 检查AI服务状态
- 优化网络连接
- 考虑使用本地缓存

### 3. 错误处理
- 系统会自动降级到模拟响应
- 查看浏览器控制台错误信息
- 检查服务器日志

## 扩展功能

### 1. 添加新的AI服务
1. 在 `ai_config.js` 中添加新服务配置
2. 在 `ai_service.js` 中实现API调用方法
3. 更新服务选择逻辑

### 2. 增强分析功能
- 集成实时市场数据
- 添加技术分析指标
- 实现投资组合优化算法

### 3. 个性化设置
- 用户风险偏好设置
- 投资目标配置
- 自定义AI建议风格

## 许可证

本项目遵循MIT许可证，AI服务的使用需要遵守各自服务商的条款和条件。 