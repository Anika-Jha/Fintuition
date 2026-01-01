# Fintuition - AI-Powered Trading Dashboard

A modern, AI-driven financial dashboard that combines real-time market data, AI-powered forecasting, sentiment analysis, and portfolio tracking.

## Features

###  Market Dashboard
- **Real-time stock prices** with live updates from Yahoo Finance
- **Interactive price charts** with historical data visualization
- **Technical indicators**: RSI, Moving Averages (SMA 20/50), Bollinger Bands
- **Quick access** to popular stocks (AAPL, MSFT, GOOGL, AMZN, TSLA, NVDA)

###  AI-Powered Insights
- **Price Forecasting**: OpenAI-powered 30-day price predictions with confidence scores
- **Sentiment Analysis**: AI-driven market sentiment from news and trends
- **Trade Alerts**: Intelligent buy/sell/hold recommendations based on AI analysis
- **Trend Detection**: Bullish, bearish, or neutral market trend identification

###  Portfolio Management
- **Track holdings** with real-time valuation
- **Performance metrics**: Total value, gains/losses, and percentage changes
- **Easy management**: Add, view, and remove portfolio holdings
- **Live price updates** for all portfolio symbols

###  Options Pricing
- **Black-Scholes calculator** for call and put options
- **The Greeks**: Delta, Gamma, Theta, Vega, and Rho calculations
- **Customizable inputs**: Strike price, volatility, days to expiry, risk-free rate

###  UI/UX
- **Light & Dark mode** with smooth transitions
- **Responsive design** optimized for desktop and mobile
- **Professional interface** inspired by Bloomberg Terminal and TradingView
- **Intuitive navigation** with sidebar menu

## Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for fast development
- **TailwindCSS** for styling
- **Recharts** for data visualization
- **Shadcn UI** component library
- **React Query** for state management
- **Wouter** for routing

### Backend
- **Express.js** API server
- **Yahoo Finance API** for market data
- **OpenAI GPT-5** for AI predictions and sentiment analysis
- **In-memory storage** for portfolio and alerts

## Getting Started

### Prerequisites
- Node.js 20+
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key (get it from https://platform.openai.com/api-keys)

4. Run the development server:
```bash
npm run dev
```

5. Open your browser to the provided URL (typically port 5000)

## Usage

### Viewing Market Data
1. Navigate to the **Dashboard** page
2. Search for any stock symbol or select from popular stocks
3. View real-time prices, charts, and technical indicators

### AI Forecasts
1. Go to the **Forecasts** page
2. Search for a stock symbol
3. View AI-powered price predictions and sentiment analysis
4. Review key factors influencing the forecast

### Managing Portfolio
1. Visit the **Portfolio** page
2. Click "Add Holding" to add stocks to your portfolio
3. Enter symbol, quantity, and average purchase price
4. Track your total value and gains/losses in real-time

### Trade Alerts
1. Check the **Alerts** page for AI-generated recommendations
2. View buy, sell, or hold signals with confidence scores
3. Dismiss alerts you've acted on

### Options Pricing
1. Navigate to the **Options** page
2. Enter the required parameters (stock price, strike, volatility, etc.)
3. Calculate call and put option prices
4. View the Greeks for risk assessment

## API Endpoints

### Market Data
- `GET /api/price/:symbol` - Get current price data
- `GET /api/price/:symbol/historical` - Get historical price data
- `GET /api/indicators/:symbol` - Get technical indicators

### AI Services
- `GET /api/predict/:symbol` - Get AI price forecast
- `GET /api/sentiment/:symbol` - Get sentiment analysis

### Portfolio
- `GET /api/portfolio` - List all holdings
- `POST /api/portfolio` - Add new holding
- `DELETE /api/portfolio/:id` - Remove holding

### Alerts
- `GET /api/alerts` - List active alerts
- `POST /api/alerts/:id/dismiss` - Dismiss an alert

### Options
- `POST /api/options/calculate` - Calculate option prices

## Design System

Fintuition follows a professional financial platform design:
- **Colors**: Blue primary, with semantic colors for gains (green) and losses (red)
- **Typography**: Inter for UI, JetBrains Mono for prices and numbers
- **Layout**: Sidebar navigation with responsive grid layouts
- **Components**: Data-dense cards optimized for information scanning

## Architecture

### Data Flow
1. **Frontend** sends requests via React Query
2. **Backend API** processes requests:
   - Fetches real-time data from Yahoo Finance
   - Calls OpenAI for AI analysis
   - Manages portfolio in-memory storage
3. **Response** is cached and displayed with loading/error states

### AI Integration
- Uses OpenAI GPT-5 for intelligent analysis
- Structured JSON responses for predictable parsing
- Fallback mechanisms for API failures

## Future Enhancements

- PostgreSQL database for persistent storage
- WebSocket support for live price streaming
- Custom LSTM/Transformer models for forecasting
- Multiple portfolio support
- Export reports and analytics
- Price alerts and notifications
- Integration with trading APIs

## License

MIT License

## Support

For issues or questions, please open an issue on the repository.
