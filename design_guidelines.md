# Fintuition Dashboard Design Guidelines

## Design Approach

**Approach**: Reference-based with Design System Foundation  
**Primary References**: TradingView (charts & data visualization), Robinhood (modern fintech UI), Bloomberg Terminal (professional density)  
**Supporting System**: Material Design principles for data-heavy applications  

**Core Principle**: Create a professional financial analytics interface that balances information density with clarity, ensuring traders can quickly scan data, perform calculations, and make informed decisions.

---

## Typography System

**Primary Font**: Inter or IBM Plex Sans (via Google Fonts CDN)
- Headings: 600-700 weight
- Body text: 400 weight
- Data labels: 500 weight

**Monospace Font**: JetBrains Mono or IBM Plex Mono (for all numerical data)
- All prices, calculations, and Greeks: 500 weight
- Ticker symbols: 600 weight

**Type Scale**:
- Page title: text-3xl (30px)
- Section headers: text-xl (20px)
- Card titles: text-lg (18px)
- Data labels: text-sm (14px)
- Primary numbers: text-2xl to text-4xl depending on importance
- Secondary data: text-base (16px)

---

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, and 8
- Component padding: p-4 to p-6
- Card spacing: p-6
- Section gaps: gap-6 to gap-8
- Margins between sections: mb-8

**Grid Structure**:
- Dashboard: 12-column grid system
- Desktop (lg): 3-column layout for main sections
- Tablet (md): 2-column layout
- Mobile (base): Single column stack

**Container Strategy**:
- Max-width: max-w-7xl for main content
- Full-width for charts
- Consistent horizontal padding: px-4 md:px-6 lg:px-8

---

## Component Library

### Dashboard Layout Structure

**Header Bar** (sticky top-0):
- Logo/brand on left
- Search/ticker input (center-left)
- API status indicators (subtle, top-right)
- Settings/profile (far right)
- Height: h-16
- Border-bottom for separation

**Main Calculator Card** (hero section):
- Prominent placement: first content block
- Two-column layout (lg): Input form left, Results right
- Mobile: Stack vertically
- Padding: p-8
- Shadow: shadow-lg

**Input Form Elements**:
- Text fields with clear labels above
- Number inputs with step controls visible
- Dropdown selects with chevron icons
- Calculate button: Large, prominent, primary CTA
- Input groups: Space-y-4
- Field labels: text-sm font-medium mb-1

**Results Display Panel**:
- Bordered container with subtle shadow
- Large numerical displays using monospace
- Call/Put prices: text-4xl font-bold
- Greeks displayed in 2x2 grid
- Each Greek: Label (text-xs) + Value (text-xl)
- Spacing: gap-4 between items

### Chart Components

**Price Chart Section**:
- Full-width container
- Height: h-96 to h-[500px]
- Chart.js or Recharts integration
- Time period selector tabs above chart (1D, 1W, 1M, 3M, 1Y)
- Legend placement: top-right overlay on chart
- Responsive: Reduce height on mobile (h-64)

**Multiple Chart Tabs**:
- Tab navigation: Horizontal scroll on mobile
- Tab design: border-b-2 for active state
- Spacing: space-x-6 between tabs

### Data Cards Grid

**3-Column Feature Grid** (lg breakpoint):
- Stock Data Card
- Forecast Card  
- Sentiment Analysis Card
- Card design: rounded-lg border shadow-sm
- Padding: p-6
- Minimum height: min-h-[280px]
- Hover: Subtle lift effect (transition-shadow)

**Stock Data Card Content**:
- Current price: text-3xl font-mono font-bold
- Price change: text-lg with directional indicator
- Volume, High, Low in compact rows
- Layout: space-y-3

**Forecast Card Content**:
- Prediction value: text-2xl font-mono
- Confidence percentage: text-base
- Visual: Small sparkline or mini chart
- API status message when unavailable

**Sentiment Analysis Card Content**:
- Sentiment score: Large circular progress indicator
- Analysis text: 2-3 lines, text-sm
- Fallback mode indicator when AI unavailable

### Forms & Inputs

**Input Field Pattern**:
```
Label (text-sm font-medium)
Input (h-10 px-3 rounded-md border)
Helper text (text-xs, optional)
```

**Numerical Inputs**:
- Right-aligned text for numbers
- Step controls visible
- Prefix symbols ($, %) as inner elements

**Buttons**:
- Primary (Calculate): h-11 px-8 rounded-md text-base font-medium
- Secondary (Reset/Clear): h-10 px-6 rounded-md text-sm
- Icon buttons: h-9 w-9 square

### Status Indicators

**API Status Badges**:
- Small pill design: rounded-full px-2 py-1 text-xs
- Position: Inline with section headers or top-right of cards
- Icons: Small dot indicator (w-2 h-2 rounded-full)
- States: Active, Fallback, Error

**Loading States**:
- Skeleton screens for data cards
- Spinner for calculations: w-5 h-5
- Pulse animation for loading text

### Navigation & Tabs

**Tab Navigation**:
- Horizontal border-bottom style
- Active tab: border-b-2 with slight background
- Padding: px-4 py-2
- Font: text-sm font-medium

### Error & Empty States

**Error Messages**:
- Alert box: rounded-lg border-l-4 p-4
- Icon + message layout
- Dismissible option for non-critical

**Empty/Fallback States**:
- Centered content with icon
- Explanatory text: text-sm
- Action button if applicable
- Padding: py-8

---

## Specialized Financial UI Patterns

### Greeks Display (Delta, Gamma, Theta, Vega)

**Layout**: 2x2 grid on desktop, 2x1 on tablet, 1x1 on mobile
- Each Greek: Compact card or bordered section
- Greek name: text-xs uppercase tracking-wide
- Greek value: text-xl font-mono font-semibold
- Gap: gap-3

### Price Movement Indicators

**Directional Indicators**:
- Up/Down arrows or triangles (Heroicons)
- Position: Inline with price values
- Size: w-4 h-4 to w-5 h-5

### Ticker Symbol Display

**Ticker Badge**:
- Font: font-mono font-bold
- Size: text-sm to text-base
- Style: Bordered badge or plain text
- Position: Adjacent to company name

---

## Responsive Behavior

**Desktop (lg: 1024px+)**:
- 3-column grid for feature cards
- Side-by-side calculator input/output
- Full-width charts at optimal viewing height

**Tablet (md: 768px)**:
- 2-column grid for cards
- Calculator remains side-by-side if space allows
- Reduced chart height

**Mobile (base: <768px)**:
- Single column stack
- Calculator: Input form above results
- Charts: Reduced height (h-64)
- Greeks: 2-column grid maintained
- Sticky header reduces to compact version

---

## Icons

**Library**: Heroicons (via CDN)  
**Usage**:
- Chart icons for tab navigation
- Arrow indicators for price movement
- Information icons for tooltips
- Settings/gear icons
- Alert icons for errors
- Checkmark for successful calculations

**Size Standards**:
- Inline with text: w-4 h-4
- Section headers: w-5 h-5
- Feature icons: w-6 h-6
- Large empty states: w-12 h-12

---

## Images

**No hero images** - This is a data-focused dashboard where immediate access to calculator and charts takes priority.

---

## Accessibility & Interactions

**Focus States**: Visible outline on all interactive elements  
**ARIA Labels**: Comprehensive labeling for screen readers, especially on charts and data  
**Keyboard Navigation**: Full support, logical tab order through calculator fields  
**Touch Targets**: Minimum 44px height for all interactive elements  
**Contrast**: Ensure all text meets WCAG AA standards  

**Animations**: Minimal and purposeful only
- Chart data updates: Smooth transitions (300ms)
- Loading spinners: Subtle rotation
- Card hover: Gentle shadow increase
- **No** distracting animations on data updates

---

## Special Considerations

**Monospace Consistency**: All financial numbers must use monospace fonts for alignment and scannability  
**Data Hierarchy**: Most important metrics (current price, call/put prices) should be largest  
**Real-time Updates**: Design for smooth data refreshes without jarring layout shifts  
**Fallback Messaging**: Clear, non-technical language when APIs are unavailable  
**Progressive Enhancement**: Core calculator works immediately, enhanced features load progressively