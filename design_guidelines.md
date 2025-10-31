# Fintuition Design Guidelines

## Design Approach

**Selected Approach:** Hybrid Design System + Financial Platform References

Drawing inspiration from professional trading platforms (Bloomberg Terminal, Robinhood, TradingView, Interactive Brokers) combined with modern design system principles. This approach prioritizes **data density**, **scanning efficiency**, and **professional credibility** while maintaining a contemporary, accessible interface.

**Core Design Principles:**
1. Information hierarchy optimized for rapid decision-making
2. Data-dense layouts that maximize screen real estate
3. Clear visual separation between data types (live prices, forecasts, portfolio, alerts)
4. Professional aesthetic that builds user trust in AI-generated insights
5. Seamless light/dark mode transitions (dark mode as primary for reduced eye strain)

---

## Typography System

**Font Families:**
- **Primary (UI/Data):** Inter or IBM Plex Sans (via Google Fonts)
  - Clean, professional, excellent number legibility
  - Superior at small sizes for dense data displays
- **Monospace (Prices/Numbers):** JetBrains Mono or IBM Plex Mono
  - Critical for price alignment and tabular data
  - Use for all numerical values, tickers, timestamps

**Type Scale:**
- **Display Numbers (Prices):** text-4xl to text-6xl, font-bold, monospace
- **Section Headers:** text-2xl, font-semibold
- **Card Titles:** text-lg, font-medium
- **Body/Labels:** text-sm, font-normal
- **Captions/Timestamps:** text-xs, font-normal
- **Micro Data:** text-xs, monospace (for dense tables)

**Numeric Formatting:**
- All prices: monospace font, right-aligned
- Positive values: Use appropriate semantic styling
- Negative values: Use appropriate semantic styling
- Percentage changes: Include directional arrows (▲ ▼) as text characters

---

## Layout System

**Spacing Primitives:**
Use Tailwind units: **2, 3, 4, 6, 8, 12** for consistent rhythm
- Component padding: `p-4` to `p-6`
- Card spacing: `space-y-4`
- Section gaps: `gap-6` to `gap-8`
- Page padding: `p-6` to `p-8`

**Dashboard Grid Structure:**

**Desktop Layout (lg:):**
```
┌─────────────────────────────────────────┐
│  Navbar (full-width, sticky)            │
├───────────────┬─────────────────────────┤
│               │                         │
│  Sidebar      │  Main Content Area      │
│  (250px)      │  (fluid, max-w-7xl)     │
│               │                         │
│  - Overview   │  ┌─────────┬─────────┐ │
│  - Portfolio  │  │ Widget  │ Widget  │ │
│  - Forecast   │  └─────────┴─────────┘ │
│  - Alerts     │  ┌───────────────────┐ │
│  - Settings   │  │  Large Chart      │ │
│               │  └───────────────────┘ │
└───────────────┴─────────────────────────┘
```

**Mobile Layout (base):**
- Single column stack
- Collapsible sidebar (hamburger menu)
- Tabbed navigation for primary sections
- Scrollable card-based widgets

**Grid Patterns:**
- **2-column widgets:** `grid grid-cols-1 lg:grid-cols-2 gap-6`
- **3-column stats:** `grid grid-cols-1 md:grid-cols-3 gap-4`
- **4-column metrics:** `grid grid-cols-2 lg:grid-cols-4 gap-3`

**Container Constraints:**
- Main content: `max-w-7xl mx-auto`
- Modals/Forms: `max-w-2xl`
- Dense data tables: Full width with horizontal scroll on mobile

---

## Component Library

### Navigation Components

**Navbar:**
- Fixed top, full-width with backdrop blur
- Height: `h-16`
- Contains: Logo + Brand, Search bar (max-w-md), Theme toggle, User menu
- Shadow: `shadow-sm` in light mode, border in dark mode
- Layout: `flex items-center justify-between px-6`

**Sidebar:**
- Fixed left on desktop, drawer overlay on mobile
- Width: `w-64`
- Navigation items with icons (from Heroicons)
- Active state with subtle accent indicator (border-l-4)
- Padding: `py-2 px-3` per item
- Icons: `h-5 w-5` inline-start

### Data Display Components

**Price Card:**
- Compact card with `p-4`
- Large price display: text-3xl monospace, font-bold
- Change indicator: text-sm with directional arrow
- Sparkline chart (mini trend): height `h-12`
- Layout: Ticker symbol top-left, price center, change bottom-right

**Chart Panel:**
- Primary chart occupies 60% viewport height on desktop
- Toolbar above chart: timeframe selector (1D, 1W, 1M, 3M, 1Y, ALL)
- Integrated legend with indicator toggles
- Padding: `p-6`
- Chart area: `min-h-[400px]` on desktop, `min-h-[300px]` on mobile

**Portfolio Table:**
- Dense tabular layout with sticky header
- Row height: `h-12` minimum for touch targets
- Columns: Symbol | Quantity | Avg Price | Current | Change | Value | Actions
- Sortable headers (add sort icons)
- Hover state on rows
- Zebra striping optional for readability
- Monospace for all numeric columns
- Right-align numeric values

**Forecast Panel:**
- Split layout: Chart (70%) + Insights (30%)
- Prediction confidence displayed as horizontal bar
- Timeline slider for forecast range
- Key metrics in compact grid: `grid grid-cols-2 gap-3`

**Sentiment Gauge:**
- Semicircular gauge visualization or horizontal bar
- Three segments: Negative | Neutral | Positive
- Current score as large display number
- Recent trend indicator (▲ ▼)
- News headlines list below gauge (max 5 items, text-sm, truncated)

**Alert Card:**
- Compact notification style
- Icon + Message + Timestamp layout
- Action buttons: Dismiss (text-sm), View Details
- Confidence score badge (pill shape, text-xs)
- Stacked list with `space-y-2`

**Options Calculator:**
- Form layout with 2-column input grid
- Real-time calculation results panel
- Greeks display in metric grid (4 columns)
- Payoff diagram chart (height: h-64)

### Form Elements

**Inputs:**
- Height: `h-10` for text inputs, `h-12` for select
- Padding: `px-3 py-2`
- Border width: `border-2` for focus visibility
- Font: text-sm

**Buttons:**
- Primary CTA: `px-6 py-2.5`, text-sm, font-medium, rounded-lg
- Secondary: `px-4 py-2`, text-sm, font-medium, rounded-md
- Icon buttons: `h-9 w-9`, rounded-md
- Minimum touch target: 44px (h-11) on mobile

**Dropdowns/Selects:**
- Match input height and padding
- Chevron icon right-aligned
- Menu items: `py-2 px-3`, text-sm

### Cards & Containers

**Widget Card:**
- Rounded corners: `rounded-lg`
- Padding: `p-6`
- Border or shadow based on theme
- Header: `flex items-center justify-between mb-4`
- Title: text-lg, font-semibold
- Optional action icon/menu top-right

**Stat Card (Compact):**
- Smaller padding: `p-4`
- Label: text-xs, uppercase, tracking-wide
- Value: text-2xl, font-bold, monospace
- Change indicator: text-sm

**Modal/Dialog:**
- Max width: `max-w-2xl` for forms, `max-w-4xl` for charts
- Padding: `p-6`
- Header with close button: `pb-4 border-b`
- Footer with actions: `pt-4 border-t`

---

## Data Visualization

**Chart Types:**
- **Candlestick:** Primary for price action, with volume bars below
- **Line Charts:** For forecasts, moving averages, sentiment trends
- **Area Charts:** Portfolio value over time
- **Bar Charts:** Volume, comparison metrics
- **Gauge/Radial:** Sentiment score, risk indicators

**Chart Specifications:**
- Tooltip: rounded-md, shadow-lg, p-3, text-sm
- Grid lines: subtle, minimal visual weight
- Axis labels: text-xs
- Legend: horizontal layout above chart, inline items with gap-4
- Crosshair on hover for precision

---

## Responsive Behavior

**Breakpoints:**
- Mobile: < 768px (single column, stacked)
- Tablet: 768px - 1024px (2-column, sidebar drawer)
- Desktop: > 1024px (full layout with sidebar)

**Mobile Optimizations:**
- Collapsible sections with expand/collapse icons
- Horizontal scrolling for wide tables (with scroll hint shadows)
- Bottom navigation bar for primary actions (optional)
- Larger touch targets (minimum h-11)
- Reduced chart heights (min-h-[250px])

---

## Interaction Patterns

**Real-Time Updates:**
- Pulse animation on price changes (very subtle, duration-200)
- New alert badge with notification dot
- Auto-scroll to top of alert list on new item

**Loading States:**
- Skeleton screens for chart panels (shimmer effect)
- Spinner for data refresh (top-right of widget)
- Progressive loading: show cached data, then update

**Hover States:**
- Chart tooltips appear on crosshair
- Table row highlight
- Card subtle lift (shadow increase) on hover
- Button state transitions (duration-150)

**Theme Toggle:**
- Smooth transition: `transition-colors duration-200`
- Persistent via localStorage
- Icon changes: Sun (light mode) / Moon (dark mode)

---

## Accessibility

**Focus Management:**
- Visible focus rings on all interactive elements: `focus:ring-2 focus:ring-offset-2`
- Keyboard navigation through sidebar, tables, forms
- Skip to main content link

**Screen Reader:**
- ARIA labels on icon-only buttons
- Table headers with proper scope
- Live region for price updates (aria-live="polite")

**Contrast:**
- Ensure WCAG AA compliance minimum
- Text on charts has sufficient contrast
- Interactive elements clearly distinguishable

---

## Images

**No hero images required** - this is a dashboard application focused on data and functionality.

**Icon Usage:**
- Use **Heroicons** (outline for most UI, solid for filled states)
- Icon size: `h-5 w-5` for sidebar/buttons, `h-4 w-4` for inline text
- Logo: Simple wordmark or icon+text, height `h-8`

**Chart Backgrounds:**
- Transparent or subtle grid pattern
- No decorative images

**Empty States:**
- Simple illustration or icon (from Heroicons)
- Centered with message and CTA button
- Example: Empty portfolio shows chart icon + "Add your first holding"

---

This design system creates a **professional, data-dense financial dashboard** optimized for rapid information consumption, AI-powered insights, and seamless interaction across devices.