// testHandleStockUtil.js
const { getLatestStockPrice, getStockPriceByDate } = require('./utils/handleStockUtil');

async function testHandleStockUtil() {
  console.log('开始测试 handleStockUtil...');
  
  try {
    // 测试1: 获取最新股票价格
    console.log('\n=== 测试1: 获取最新股票价格 ===');
    const latestData = await getLatestStockPrice('AAPL');
    console.log('最新股票价格数据:');
    console.log(JSON.stringify(latestData, null, 2));
    
    // 测试2: 获取特定日期的股票价格（包含日期信息）
    console.log('\n=== 测试2: 获取特定日期的股票价格 ===');
    const specificDateData = await getStockPriceByDate('AAPL', '2025-07-25');
    console.log('特定日期股票价格数据:');
    console.log(JSON.stringify(specificDateData, null, 2));
    
    // 检查返回数据是否包含新增的日期属性
    if (specificDateData.length > 0) {
      const firstItem = specificDateData[0];
      if (firstItem.symbol && firstItem.price && firstItem.date) {
        console.log('✓ 数据格式正确，包含 symbol, price 和 date 属性');
      } else {
        console.log('✗ 数据格式不完整');
      }
    }
    
    // 测试3: 测试另一个股票代码
    console.log('\n=== 测试3: 测试另一个股票 ===');
    const latestData2 = await getLatestStockPrice('GOOGL');
    console.log('GOOGL最新股票价格数据:');
    console.log(JSON.stringify(latestData2, null, 2));
    
    // 测试4: 测试另一个特定日期
    console.log('\n=== 测试4: 测试另一个特定日期 ===');
    const specificDateData2 = await getStockPriceByDate('GOOGL', '2023-06-01');
    console.log('GOOGL特定日期股票价格数据:');
    console.log(JSON.stringify(specificDateData2, null, 2));
    
    // 验证日期格式是否正确（YYYY-MM-DD）
    if (specificDateData2.length > 0) {
      const firstItem = specificDateData2[0];
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (dateRegex.test(firstItem.date)) {
        console.log('✓ 日期格式正确 (YYYY-MM-DD)');
      } else {
        console.log('✗ 日期格式不正确');
      }
    }
    
  } catch (error) {
    console.error('测试过程中发生错误:', error.message);
    console.error('错误堆栈:', error.stack);
  }
  
  console.log('\n测试完成。');
}

// 运行测试
testHandleStockUtil();