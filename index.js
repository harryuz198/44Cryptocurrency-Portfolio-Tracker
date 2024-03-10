const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

// 使用body-parser中间件解析POST请求的JSON数据
app.use(bodyParser.json());

// 模拟用户数据存储
let users = [
  { id: 1, username: 'john_doe', password: 'password123', portfolio: [] },
  // 添加更多用户数据...
];

// 处理获取用户投资组合数据的请求
app.get('/portfolio/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  const user = users.find((u) => u.id === userId);

  if (user) {
    // 获取加密货币市场数据（示例使用CoinGecko API）
    const portfolioValue = await calculatePortfolioValue(user.portfolio);

    res.json({ portfolio: user.portfolio, portfolioValue });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// 处理添加新投资的请求
app.post('/portfolio/:userId/add-investment', async (req, res) => {
  const userId = parseInt(req.params.userId);
  const { symbol, amount } = req.body;

  const user = users.find((u) => u.id === userId);

  if (user) {
    // 获取加密货币市场数据（示例使用CoinGecko API）
    const currentPrice = await getCryptoCurrencyPrice(symbol);

    const newInvestment = { symbol, amount, currentPrice };
    user.portfolio.push(newInvestment);

    res.json({ message: 'Investment added successfully', investment: newInvestment });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// 计算投资组合价值
async function calculatePortfolioValue(portfolio) {
  let totalValue = 0;

  for (const investment of portfolio) {
    const currentPrice = await getCryptoCurrencyPrice(investment.symbol);
    totalValue += currentPrice * investment.amount;
  }

  return totalValue;
}

// 获取加密货币市场价格
async function getCryptoCurrencyPrice(symbol) {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`);
    return response.data[symbol].usd;
  } catch (error) {
    console.error(`Error fetching price for ${symbol}: ${error.message}`);
    return 0;
  }
}

// 启动Express应用程序
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
