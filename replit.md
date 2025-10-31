# Fintuition - AI-Powered Trading Dashboard

## Project Overview
Fintuition is a comprehensive AI-driven financial trading dashboard built with React, TypeScript, Express, and OpenAI. It provides real-time market data, AI-powered forecasting, sentiment analysis, and portfolio tracking.

## Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with Vite for fast development
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state
- **Styling**: TailwindCSS with Shadcn UI components
- **Charts**: Recharts for data visualization
- **Theme**: Light/Dark mode with persistent preferences

### Backend (Express + TypeScript)
- **Framework**: Express.js with TypeScript
- **Market Data**: Yahoo Finance API via yahoo-finance2
- **AI Services**: OpenAI GPT-4o for forecasting and sentiment
- **Storage**: In-memory storage for portfolio and alerts
- **API Design**: RESTful endpoints with proper error handling

## Key Features

1. **Market Dashboard**
   - Real-time stock prices with live updates
   - Interactive price charts with multiple timeframes (1D, 1W, 1M, 3M, 1Y)
   - Technical indicators (RSI, SMA 20/50, Bollinger Bands)
   - Quick access to popular stocks

2. **AI-Powered Forecasting**
   - 30-day price predictions using OpenAI GPT-4o
   - Confidence scores and trend analysis (bullish/bearish/neutral)
   - Detailed reasoning and key factors
   - Visual confidence indicators

3. **Sentiment Analysis**
   - AI-driven market sentiment from news trends
   - Sentiment scores ranging from -1 (negative) to +1 (positive)
   - Visual sentiment gauge with color coding
   - News headlines with sentiment classification

4. **Portfolio Management**
   - Track multiple holdings with real-time valuations
   - Performance metrics (total value, gains/losses, percentages)
   - Easy CRUD operations (add, view, delete holdings)
   - Live price updates for all portfolio symbols

5. **Options Pricing**
   - Black-Scholes model implementation
   - Calculate call and put option prices
   - Display all Greeks (Delta, Gamma, Theta, Vega, Rho)
   - Customizable inputs for comprehensive analysis

6. **Trade Alerts**
   - AI-generated buy/sell/hold recommendations
   - Confidence scores for each alert
   - Dismiss functionality for acted-upon alerts
   - Real-time alert generation

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components (Dashboard, Portfolio, etc.)
│   │   ├── lib/           # Utilities and providers
│   │   └── App.tsx        # Main application component
│   └── index.html
├── server/                # Backend Express application
│   ├── services/          # Business logic services
│   │   ├── openai.ts     # AI forecasting and sentiment
│   │   ├── market-data.ts # Yahoo Finance integration
│   │   └── options-pricing.ts # Black-Scholes calculations
│   ├── routes.ts          # API route definitions
│   └── storage.ts         # In-memory data storage
├── shared/                # Shared types and schemas
│   └── schema.ts          # Zod schemas and TypeScript types
└── README.md
```

## API Endpoints

### Market Data
- `GET /api/price/:symbol` - Current price and market data
- `GET /api/price/:symbol/historical?period=1mo` - Historical price data
- `GET /api/portfolio/prices/:symbols` - Batch price fetch for portfolio
- `GET /api/indicators/:symbol` - Technical indicators (RSI, SMA, Bollinger)

### AI Services
- `GET /api/predict/:symbol` - AI-powered price forecast
- `GET /api/sentiment/:symbol` - Sentiment analysis

### Portfolio
- `GET /api/portfolio` - List all holdings
- `POST /api/portfolio` - Add new holding
- `DELETE /api/portfolio/:id` - Remove holding

### Alerts
- `GET /api/alerts` - List active alerts
- `POST /api/alerts/generate/:symbol` - Generate new alert
- `POST /api/alerts/:id/dismiss` - Dismiss alert

### Options
- `POST /api/options/calculate` - Calculate option prices

## Environment Variables

- `OPENAI_API_KEY` - Required for AI features (forecasting, sentiment, alerts)
- `SESSION_SECRET` - For session management
- `NODE_ENV` - Environment (development/production)

## Design Guidelines

The application follows professional financial platform design principles:
- **Color Scheme**: Blue primary, green for gains, red for losses
- **Typography**: Inter for UI, JetBrains Mono for numbers/prices
- **Layout**: Data-dense with efficient information scanning
- **Responsive**: Mobile-first with adaptive layouts
- **Accessibility**: WCAG AA compliant with proper contrast

## Development

### Running the Application
```bash
npm run dev
```
The backend runs on port 5000, serving both API and frontend.

### Adding New Features
1. Define types in `shared/schema.ts`
2. Implement backend logic in `server/services/`
3. Add API routes in `server/routes.ts`
4. Create frontend components in `client/src/components/`
5. Wire up with React Query in page components

## Future Enhancements

Planned features for future development:
- PostgreSQL database for persistent storage
- WebSocket support for live price streaming
- Custom LSTM/Transformer models for advanced forecasting
- Multiple portfolio support with comparison
- Export reports and analytics
- Price alerts with notifications
- Integration with brokerage APIs for live trading
- Advanced charting with candlesticks and more indicators
- Social features (share trades, follow traders)

## Technologies Used

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- Shadcn UI
- TanStack React Query
- Recharts
- Wouter
- Lucide Icons

### Backend
- Node.js 20
- Express.js
- TypeScript
- OpenAI GPT-4o
- Yahoo Finance API
- Zod (validation)
- Drizzle ORM

## Notes

- The application uses in-memory storage, so data resets on server restart
- Yahoo Finance API is free but has rate limits
- OpenAI API requires credits for AI features
- All prices are in USD
- Market data may have slight delays
