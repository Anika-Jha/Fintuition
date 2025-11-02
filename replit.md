# Fintuition - Options Analytics Dashboard

## Overview

Fintuition is a professional financial analytics dashboard that provides advanced options pricing calculations, real-time stock data, AI-powered forecasts, and sentiment analysis. The application is designed for traders and financial analysts who need quick access to market data and sophisticated pricing models.

The platform integrates multiple financial data providers (Yahoo Finance, Alpha Vantage, Finnhub) with automatic fallback mechanisms, and includes AI-powered features using OpenAI for market forecasting and sentiment analysis. The core functionality centers around Black-Scholes options pricing with full Greeks calculations, combined with real-time market data visualization.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Component System**: shadcn/ui (Radix UI primitives) with Tailwind CSS
- Design system inspired by TradingView, Robinhood, and Bloomberg Terminal
- Custom theme system supporting light/dark modes via CSS variables
- Typography: Inter/IBM Plex Sans for UI, JetBrains Mono for financial data
- Responsive grid layout: 12-column system with 3-column desktop, 2-column tablet, single-column mobile

**State Management**:
- TanStack Query (React Query) for server state and API caching
- React Context for theme management
- No global state management library - component-level state with props drilling

**Key Design Patterns**:
- **Component Composition**: Reusable card-based layout with consistent API status indicators
- **Provider Pattern**: Multiple data providers with automatic fallback (Yahoo Finance → Alpha Vantage → Finnhub → Mock Data)
- **Status Tracking**: Each API call returns provider name and status (active/fallback/error/offline) for transparency

**Routing**: Wouter (lightweight client-side routing)

**Data Visualization**: Recharts library for stock price charts with interactive time period selection

### Backend Architecture

**Server Framework**: Express.js with TypeScript (ESM modules)

**API Design**:
- RESTful endpoints for stock data, historical charts, forecasts, and sentiment
- Provider cascade pattern: attempts primary provider, falls back to alternatives on failure
- Response format includes data, provider name, and status for transparency

**Key Services**:
1. **Stock API Service** (`server/services/stock-api.ts`):
   - Primary: Yahoo Finance (yahoo-finance2)
   - Fallback chain: Alpha Vantage → Finnhub → Mock data
   - Handles quote data and historical price data with configurable time periods

2. **AI Service** (`server/services/ai-service.ts`):
   - OpenAI integration for market forecasting and sentiment analysis
   - Fallback to mock data when API key unavailable
   - Structured JSON responses with validation

**Storage Layer**: In-memory storage implementation with interface pattern for future database integration

**Business Logic**:
- **Black-Scholes Calculator** (client-side): Full implementation with Delta, Gamma, Theta, Vega calculations
- **Provider Abstraction**: Consistent data transformation from multiple API formats to unified schema

### Data Storage Solutions

**Current Implementation**: In-memory storage (MemStorage class)
- User data stored in Map structure
- UUID-based identification

**Schema Definition**: Drizzle ORM with PostgreSQL dialect
- Database configuration ready (requires DATABASE_URL environment variable)
- User table defined with username/password fields
- Migration directory configured for schema changes

**Prepared for Database Integration**:
- Drizzle Kit configured with PostgreSQL support
- Schema validation using Zod
- Interface-based storage pattern allows swapping implementations

### Authentication and Authorization

**Minimal Implementation**: User creation and retrieval methods exist but no active authentication flow
- No session management currently implemented
- connect-pg-simple package included for future PostgreSQL session store
- User schema includes password field (stored as plain text - requires hashing implementation)

**Security Considerations**: 
- No current authentication middleware
- API endpoints are publicly accessible
- Prepared infrastructure suggests future session-based authentication

### External Dependencies

**Financial Data Providers**:
1. **Yahoo Finance** (primary): Real-time quotes, historical data, market cap
2. **Alpha Vantage** (fallback): Alternative market data source
3. **Finnhub** (fallback): Additional market data provider
4. **Mock Data** (ultimate fallback): Ensures application always functions

**AI/ML Services**:
- **OpenAI API**: GPT model for 30-day price forecasting and sentiment analysis
- Graceful degradation to historical trend analysis when unavailable

**Third-Party Libraries**:
- **@neondatabase/serverless**: PostgreSQL driver for Neon database
- **Drizzle ORM**: Type-safe database operations
- **Recharts**: Chart rendering
- **date-fns**: Date manipulation
- **nanoid**: Unique ID generation

**Development Tools**:
- **Vite**: Fast build tool with HMR
- **TypeScript**: Type safety across stack
- **Tailwind CSS**: Utility-first styling
- **PostCSS**: CSS processing with autoprefixer

**Deployment Considerations**:
- Build process: Vite for client, esbuild for server
- Production server runs compiled JavaScript (dist/index.js)
- Static assets served from dist/public
- Environment variables required: DATABASE_URL (optional), OPENAI_API_KEY (optional)