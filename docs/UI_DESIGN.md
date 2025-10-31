# 🎨 UI Design: Dashboard-Centric Layout

## 📐 Layout Structure

### Desktop Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Top Bar (100% width)                                        │
│  [Wallet Connect] [Notifications] [Settings]                │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                   │
│ Sidebar  │              Main Panel (80%)                    │
│ (20%)    │                                                   │
│          │  ┌───────────────────────────────────────────┐  │
│ • Signal │  │  Encrypted Signal Cards                    │  │
│   Input  │  │  🔒 + Encryption Animation                 │  │
│          │  └───────────────────────────────────────────┘  │
│ • Agg    │                                                   │
│   Dash   │  ┌───────────────────────────────────────────┐  │
│          │  │  Aggregation Result Chart                 │  │
│ • Contri │  │  📈 Echarts Line Chart                     │  │
│   Track  │  │  (Mean / Weighted Average)                 │  │
│          │  └───────────────────────────────────────────┘  │
│ • Revenue│                                                   │
│          │  ┌───────────────────────────────────────────┐  │
│ • Settings│  Contribution Radar Chart                   │  │
│          │  📊 Personal vs Total Contribution          │  │
│          │  └───────────────────────────────────────────┘  │
└──────────┴──────────────────────────────────────────────────┘
```

### Mobile Layout (Responsive)

```
┌───────────────────────────────────┐
│ [☰] [Wallet] [🔔]                │  ← Hamburger Menu
├───────────────────────────────────┤
│                                   │
│        Main Panel (100%)          │
│                                   │
│  ┌───────────────────────────┐  │
│  │ Encrypted Signal Cards     │  │
│  └───────────────────────────┘  │
│                                   │
│  ┌───────────────────────────┐  │
│  │ Aggregation Chart         │  │
│  └───────────────────────────┘  │
│                                   │
└───────────────────────────────────┘
```

---

## 🧩 Component Structure

### Sidebar Components (Left 20%)

1. **Signal Input**
   - Form for signal contribution
   - Encryption progress indicator
   - "Encrypting..." loading animation
   - Lock icon 🔒

2. **Aggregation Dashboard**
   - Real-time Gateway polling status
   - Decryption progress indicator
   - Aggregation result display

3. **Contribution Tracking**
   - Personal contribution bar chart
   - Total contribution comparison
   - Contribution percentage

4. **Revenue Distribution**
   - Total revenue earned
   - Revenue per signal
   - Platform fee breakdown

5. **Settings**
   - Network selection
   - FHE/Mock mode toggle
   - Theme settings

### Main Panel Components (Center 80%)

1. **Encrypted Signal Cards**
   - Lock icon + encryption animation
   - Signal metadata (timestamp, type)
   - Signal value: 🔒 Encrypted (not displayed)
   - Contributor address

2. **Aggregation Result Chart**
   - **Library**: Echarts (折线图 - Line Chart)
   - X-axis: Time
   - Y-axis: Aggregated signal value
   - Multiple series: Mean, Weighted Average
   - Real-time updates from Gateway

3. **Contribution Radar Chart**
   - **Library**: Ant Design Charts (雷达图 - Radar Chart)
   - Personal contribution vs Total
   - Multiple dimensions:
     - Signal accuracy
     - Signal frequency
     - Contribution percentage
     - Revenue share

### Top Bar Components

1. **Wallet Connect Button**
   - Uses ethers.js for signing
   - Shows connected address
   - Network indicator

2. **Notification Bell** 🔔
   - Decryption progress notifications
   - Aggregation completion alerts
   - Revenue distribution updates

3. **Settings Menu**
   - Quick settings access

---

## 🎨 Design Specifications

### Color Scheme
- **Primary**: Zama brand colors (check official)
- **Encryption Indicator**: Purple/Lavender
- **Success**: Green
- **Warning**: Yellow/Orange
- **Error**: Red

### Icons
- 🔒 Lock icon for encrypted data
- 📈 Chart icon for aggregation
- 🔔 Bell icon for notifications
- ☰ Hamburger menu for mobile

### Animations
- **Encryption Animation**: Pulsing lock icon or spinner
- **Decryption Progress**: Progress bar with percentage
- **Chart Updates**: Smooth transitions

---

## 📱 Responsive Breakpoints

- **Desktop**: > 1024px (Sidebar 20% + Main 80%)
- **Tablet**: 768px - 1024px (Collapsible sidebar)
- **Mobile**: < 768px (Hamburger menu, full-width main)

---

## 🔧 Technology Stack

### UI Framework
- **React**: ^18.2.0
- **Vite**: ^5.4.21

### Component Library
- **Ant Design**: UI components, charts
- **Echarts**: Advanced charts (line chart for aggregation)

### Styling
- **CSS Modules** or **Tailwind CSS**
- **Ant Design Theme** customization

### State Management
- **React Hooks**: useState, useContext
- **Custom Hooks**: useSignalPool, useEncryption, useDecryption

---

## 🚀 User Flow

### Flow 1: Signal Contribution

```
1. Connect Wallet
   └─> Top bar: Click "Connect Wallet"
       └─> MetaMask/OKX popup
           └─> Connected ✅

2. Sidebar: Click "Signal Input"
   └─> Main panel shows signal form
       └─> Input signal value
           └─> Click "Contribute"
               └─> Show "🔒 Encrypting..." animation
                   └─> createEncryptedInput() processing
                       └─> Submit to contract
                           └─> Success notification 🔔

3. Signal card appears in main panel
   └─> Shows: 🔒 Encrypted, timestamp, type
```

### Flow 2: Aggregation & Decryption

```
1. Sidebar: Click "Aggregation Dashboard"
   └─> Main panel shows aggregation view
       └─> Click "Create Aggregation"
           └─> Select signals to aggregate
               └─> Select aggregation type (Mean/Weighted)
                   └─> Submit request

2. Gateway polling starts
   └─> Notification: "🔔 Decryption in progress..."
       └─> Progress bar in top bar
           └─> Polling Gateway every 5 seconds

3. Decryption completes
   └─> Notification: "🔔 Aggregation completed!"
       └─> Chart updates with new data point
           └─> Result displayed on card
```

### Flow 3: Contribution Tracking

```
1. Sidebar: Click "Contribution Tracking"
   └─> Main panel shows contribution view
       └─> Radar chart displays:
           - Personal contribution (blue)
           - Total pool contribution (gray)
           └─> Bar chart shows:
               - Personal signals count
               - Revenue share percentage
```

---

## 📦 Component Files Structure

```
frontend/src/
├── components/
│   ├── Layout/
│   │   ├── Sidebar.jsx          # Left sidebar (20%)
│   │   ├── TopBar.jsx           # Top bar (wallet, notifications)
│   │   └── MainPanel.jsx        # Main content area (80%)
│   │
│   ├── SignalInput/
│   │   ├── SignalForm.jsx       # Input form
│   │   └── EncryptionProgress.jsx # 🔒 Encryption animation
│   │
│   ├── Dashboard/
│   │   ├── AggregationChart.jsx  # Echarts line chart
│   │   ├── SignalCards.jsx      # Encrypted signal cards
│   │   └── DecryptionStatus.jsx # Gateway polling UI
│   │
│   ├── Contribution/
│   │   ├── ContributionRadar.jsx # Ant Design radar chart
│   │   └── ContributionBar.jsx  # Personal vs total bar chart
│   │
│   ├── Revenue/
│   │   └── RevenueDistribution.jsx
│   │
│   └── Common/
│       ├── WalletConnect.jsx
│       └── NotificationBell.jsx
│
├── hooks/
│   ├── useSignalPool.js
│   ├── useEncryption.js
│   └── useDecryption.js
│
└── utils/
    └── charts.js              # Chart configuration helpers
```

---

**Last Updated**: 2025-01-XX  
**Status**: UI Design Documented  
**Implementation**: Pending

