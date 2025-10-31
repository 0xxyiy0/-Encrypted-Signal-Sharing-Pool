# 📖 User Manual

**Encrypted Signal Sharing Pool** - Complete User Guide

A comprehensive guide to using the privacy-preserving trading signal aggregation platform built on Zama FHEVM.

---

## 📋 Table of Contents

1. [Quick Start](#-quick-start)
2. [Wallet Connection](#-wallet-connection)
3. [Signal Input](#-signal-input)
4. [Aggregation Dashboard](#-aggregation-dashboard)
5. [Contribution Tracking](#-contribution-tracking)
6. [Revenue Distribution](#-revenue-distribution)
7. [Settings](#-settings)
8. [Troubleshooting](#-troubleshooting)
9. [Privacy & Security](#-privacy--security)
10. [FAQ](#-faq)

---

## 🚀 Quick Start

### Prerequisites

Before using the Encrypted Signal Sharing Pool, ensure you have:

1. **Web Browser**
   - Modern browser with JavaScript enabled (Chrome, Firefox, Edge, Safari)
   - Recommended: Chrome or Firefox for best compatibility

2. **Crypto Wallet**
   - [MetaMask](https://metamask.io/) or [OKX Wallet](https://www.okx.com/web3)
   - Wallet extension installed and configured
   - At least one account set up

3. **Test Network ETH**
   - Switch to **Sepolia Test Network**
   - Obtain test ETH from a [Sepolia Faucet](https://sepoliafaucet.com/)
   - Recommended: At least 0.1 Sepolia ETH for testing

4. **Application Access**
   - Access to the deployed application URL
   - Internet connection

### First-Time Setup

1. **Install Wallet Extension**
   - Download and install MetaMask or OKX Wallet from their official websites
   - Follow the wallet setup wizard to create or import an account
   - ⚠️ **Important**: Save your recovery phrase in a secure location

2. **Add Sepolia Test Network**
   
   **MetaMask:**
   - Click the network selector (top right)
   - Click "Add Network" → "Add a network manually"
   - Enter Sepolia details:
     - Network Name: `Sepolia`
     - RPC URL: `https://eth-sepolia.public.blastapi.io`
     - Chain ID: `11155111`
     - Currency Symbol: `ETH`
     - Block Explorer: `https://sepolia.etherscan.io`

   **OKX Wallet:**
   - Network is usually pre-configured
   - Simply switch to "Sepolia Testnet" from the network selector

3. **Get Test ETH**
   - Visit [Sepolia Faucet](https://sepoliafaucet.com/)
   - Enter your wallet address
   - Complete any required verification
   - Wait for ETH to arrive (usually within minutes)

4. **Access the Application**
   - Open the application URL in your browser
   - The application will automatically detect your wallet
   - You're ready to start!

---

## 🔌 Wallet Connection

### Step 1: Initiate Connection

1. Look for the **"Connect Wallet"** button in the top-right corner of the page
2. Click the button
3. Your wallet extension should open automatically

### Step 2: Select Your Wallet

- If you have **MetaMask** installed, it will be the primary option
- **OKX Wallet** and other EIP-1193 compatible wallets will also appear
- Click on your preferred wallet

### Step 3: Authorize Connection

1. In the wallet popup, select the account you want to connect
2. Review the connection request
3. Click **"Connect"** or **"Next"** to authorize
4. Approve any signature requests (these are for verification only, no funds are moved)

### Step 4: Network Verification

The application automatically checks if you're on the Sepolia network:

- ✅ **If you're already on Sepolia**: Connection completes immediately
- ⚠️ **If you're on a different network**: You'll see a prompt to switch

**To switch networks:**
1. Click **"Switch Network"** in the prompt
2. Confirm the network switch in your wallet
3. Wait for the network to change (usually instant)

### Connection Success Indicators

Once connected, you'll see:
- ✅ Your wallet address displayed in the top bar (shortened format: `0x1234...5678`)
- ✅ The "Connect Wallet" button changes to "Disconnect"
- ✅ All features become available and interactive
- ✅ A success notification may appear briefly

### Disconnecting

To disconnect your wallet:
1. Click on your wallet address in the top bar, or
2. Click the **"Disconnect"** button
3. Confirm disconnection if prompted

**Note**: Disconnecting does not affect your wallet or funds. You can reconnect anytime.

---

## 📊 Signal Input

### Overview

The Signal Input page allows you to contribute encrypted trading signals to the pool. Your signals are encrypted on your device before being sent to the blockchain, ensuring complete privacy.

### Accessing Signal Input

1. Click **"Signal Input"** in the left sidebar (🔒 icon)
2. You'll see a form card titled "Contribute Encrypted Signal"

### Filling Out the Form

#### 1. Select Signal Type

Choose from the dropdown menu:

- **Price Prediction** (`0`)
  - Use for: Predicting future asset prices
  - Example values: `100`, `1500`, `0.05`
  - Best for: Price forecasting signals

- **Volatility Estimate** (`1`)
  - Use for: Estimating market volatility
  - Example values: `0.15`, `0.25`, `0.5`
  - Best for: Risk assessment signals

- **Buy/Sell Vote** (`2`)
  - Use for: Buy/sell recommendations
  - Example values: `1` (buy), `0` (sell), `2` (hold)
  - Best for: Trading decision signals

**Tip**: Select the type that best matches your signal's purpose.

#### 2. Enter Signal Value

- Click the **"Signal Value"** input field
- Enter your numerical value
- Range: `0` to `1,000,000`
- **Examples**:
  - Price prediction: `150`
  - Volatility: `0.25`
  - Buy/Sell vote: `1`

**Important**: 
- Only numeric values are accepted
- Decimal values are supported (e.g., `0.5`)
- Very large numbers may have precision limits

#### 3. Set Weight (Optional)

Weight determines how much influence your signal has in weighted aggregation:

- **Default**: `1`
- **Range**: `1` - `100`
- **Higher weight**: Your signal contributes more to weighted averages
- **Lower weight**: Your signal contributes less

**Recommendations**:
- Set weight `1` for normal signals
- Set weight `5-10` for high-confidence signals
- Set weight `10+` for expert-level signals

### Submitting Your Signal

#### Before Submission Checklist

- ✅ Wallet is connected
- ✅ You're on Sepolia network
- ✅ Form fields are filled correctly
- ✅ You have sufficient ETH for gas fees

#### Submission Process

1. **Click "Contribute Encrypted Signal"**
   - The button shows a lock icon (🔒)
   - Button text changes to "Encrypting & Submitting..." during processing

2. **Encryption Phase** (FHE Mode only)
   - A progress indicator appears: "Encrypting..."
   - Your signal is encrypted on your device
   - This happens automatically - no action needed
   - Encryption typically takes 2-5 seconds

3. **Transaction Confirmation**
   - Your wallet popup appears
   - Review the transaction details:
     - **Contract**: Signal Pool contract address
     - **Gas Fee**: Estimated cost (usually minimal on testnet)
     - **Transaction Type**: Contract interaction
   - Click **"Confirm"** or **"Approve"** in your wallet

4. **Waiting for Confirmation**
   - A loading message appears: "Submitting signal..."
   - Transaction is being processed on the blockchain
   - Wait time: Usually 5-15 seconds on Sepolia
   - Don't close the browser during this time

#### Success Indicators

Upon successful submission:

- ✅ Success message appears: `Signal #X contributed successfully! TX: 0x1234...`
- ✅ Signal ID is displayed (e.g., `Signal #5`)
- ✅ Transaction hash is shown (clickable link to view on Etherscan)
- ✅ Form automatically resets
- ✅ You can submit another signal immediately

#### Error Handling

**Common Errors and Solutions**:

- **"Wallet not connected"**
  - Solution: Connect your wallet first

- **"Wrong network"**
  - Solution: Switch to Sepolia network

- **"Insufficient funds"**
  - Solution: Get more Sepolia ETH from faucet

- **"User rejected transaction"**
  - Solution: Click "Confirm" in your wallet when prompted

- **"Transaction failed"**
  - Solution: Check gas limit, try again, or check contract status

### Understanding Signal Encryption

**In FHE Mode**:
- Your signal is encrypted **before** it leaves your device
- Only encrypted data is sent to the blockchain
- Your original signal value is never revealed
- Even you cannot view your submitted signal value later (it's encrypted)

**In Mock Mode**:
- Signals are stored in plaintext for testing
- Useful for development and debugging
- Not recommended for production use

### After Submission

- Your signal is now part of the pool
- Other users can select it for aggregation
- You can track your contribution in the "Contribution Tracking" page
- You may earn revenue if your signal is used in profitable aggregations

---

## 📈 Aggregation Dashboard

### Overview

The Aggregation Dashboard is the main page of the application. It displays available signals, allows you to create aggregations, and visualizes aggregation results.

### Page Layout

The dashboard consists of:

1. **Signal Cards Section** (top)
   - Shows all available encrypted signals
   - Displays signal metadata

2. **Aggregation Controls** (middle)
   - Type selector
   - Signal selector
   - Revenue input
   - Create button

3. **Aggregation Chart** (below controls)
   - Visual representation of aggregation results
   - Interactive line chart

4. **Aggregation List** (bottom)
   - History of all aggregations
   - Detailed information

### Viewing Available Signals

#### Signal Cards

Each signal appears as a card with:

- 🔒 **Lock Icon**: Indicates encrypted state
- **Signal ID**: Unique identifier (e.g., `#1`, `#2`)
- **Type**: Price Prediction, Volatility, or Buy/Sell Vote
- **Contributor**: Wallet address (shortened)
- **Timestamp**: When the signal was submitted
- **Weight**: Signal weight value

#### Your Signals

Signals you contributed are highlighted:
- Purple border or special indicator
- Easier to identify in the list

#### Refreshing Signals

Click the **"Refresh"** button (🔄) to:
- Reload all signals from the blockchain
- Update signal metadata
- See newly submitted signals

**Note**: There may be a small delay before new signals appear on-chain.

### Creating an Aggregation

#### Step 1: Select Aggregation Type

Choose from the dropdown:

- **Mean** (`0`)
  - Calculates the average of all selected signals
  - Formula: `(signal1 + signal2 + ...) / count`
  - Best for: Simple averaging of signals

- **Weighted Mean** (`1`)
  - Calculates weighted average based on signal weights
  - Formula: `(signal1 × weight1 + signal2 × weight2 + ...) / (weight1 + weight2 + ...)`
  - Best for: Signals with different confidence levels

#### Step 2: Select Signals

1. Click the **"Select signals"** multi-select dropdown
2. Available signals appear in the dropdown
3. Select multiple signals by clicking on them
4. Selected signals show a checkmark (✓)
5. You can deselect by clicking again

**Recommendations**:
- Select at least 2 signals for meaningful aggregation
- Select signals of the same type for consistent results
- Consider signal weights when selecting for weighted mean

#### Step 3: Set Revenue Amount (Optional)

1. Find the **"Revenue (ETH)"** input field
2. Enter the amount of ETH to attach to this aggregation
3. This ETH becomes the revenue pool for the aggregation
4. Revenue is distributed among contributors after aggregation

**Examples**:
- `0.001` ETH for testing
- `0.01` ETH for small aggregations
- `0.1` ETH or more for significant aggregations

**Note**: 
- You must have sufficient ETH in your wallet
- The amount will be transferred to the contract
- Revenue is distributed automatically based on contribution

#### Step 4: Create Aggregation

1. Review your selections:
   - Aggregation type is correct
   - Signals are selected
   - Revenue amount (if any) is set

2. Click **"Create Aggregation"** button
   - Button shows a plus icon (+)
   - Button may show loading state during processing

3. **Confirm Transaction**
   - Wallet popup appears
   - Review transaction details
   - Check gas fee estimate
   - If sending revenue, verify the ETH amount
   - Click **"Confirm"**

4. **Wait for Confirmation**
   - Loading indicator shows progress
   - Transaction is processed on-chain
   - Usually takes 10-20 seconds

### Viewing Aggregation Results

#### For Mock Mode

Results appear immediately after transaction confirmation:
- Decrypted values shown directly
- Chart updates automatically
- Aggregation appears in the list below

#### For FHE Mode

Results require Gateway decryption:

1. **Transaction Confirms**
   - Aggregation is created
   - Result is encrypted on-chain

2. **Gateway Decryption Starts**
   - System automatically requests decryption
   - Status indicator shows "Decrypting..."
   - Progress may be shown

3. **Decryption Completes**
   - Result is decrypted by Zama Gateway
   - Decrypted value appears in chart
   - Status changes to "Decrypted"

**Note**: Gateway decryption can take 1-5 minutes. Be patient!

### Understanding the Chart

The aggregation chart displays:

- **X-Axis**: Aggregation ID or time
- **Y-Axis**: Aggregated signal value
- **Lines**:
  - Blue line: Mean aggregations
  - Purple line: Weighted mean aggregations
- **Points**: Clickable markers showing exact values
- **Tooltips**: Hover to see detailed information

**Interactions**:
- Hover over points to see values
- Click to focus on specific aggregations
- Zoom if available (browser-dependent)

### Aggregation List

Below the chart, you'll see a list of all aggregations:

**Columns**:
- **ID**: Aggregation number
- **Type**: Mean or Weighted Mean
- **Result**: Decrypted aggregated value (or "Encrypted" if pending)
- **Signals**: Number of signals used
- **Revenue**: ETH amount (if any)
- **Time**: Creation timestamp

**Actions**:
- Click on an aggregation ID to see details
- View transaction hash for blockchain verification
- Check decryption status

### Refreshing Data

Click the **"Refresh"** button periodically to:
- Update aggregation results
- Check decryption status
- See new aggregations

---

## 🏆 Contribution Tracking

### Overview

The Contribution Tracking page shows your participation statistics and compares your contributions to the overall pool.

### Accessing Contribution Tracking

1. Click **"Contribution Tracking"** in the left sidebar (🏆 icon)
2. Page loads your contribution data automatically

### Key Statistics

At the top of the page, you'll see four key metrics:

#### 1. Your Signals

- **Format**: `X / Y`
  - X = Your signal count
  - Y = Total signals in pool
- **Example**: `5 / 20` means you've contributed 5 out of 20 total signals
- **Percentage**: Automatically calculated and displayed

#### 2. Contribution Percentage

- Shows your share of total signals
- **Formula**: `(Your Signals / Total Signals) × 100`
- **Example**: `25%` means you contributed 25% of all signals
- Used for revenue distribution calculations

#### 3. Your Revenue

- **Total earned**: Sum of all revenue you've received
- **Format**: ETH amount (e.g., `0.05 ETH`)
- **Source**: Revenue from aggregations where your signals were used
- **Updated**: Automatically when revenue is distributed

#### 4. Total Pool Revenue

- **Total revenue**: All revenue in the entire pool
- **Format**: ETH amount
- **Includes**: Revenue from all aggregations ever created
- **Note**: Some may be distributed, some may be pending

### Visualizations

#### Contribution Radar Chart

A radar chart shows your performance across dimensions:

**Axes**:
- **Signal Count**: Number of signals you've contributed
- **Accuracy**: Signal accuracy rating (if tracked)
- **Contribution %**: Your percentage of total contributions
- **Revenue Share**: Your share of total revenue

**How to Read**:
- Larger area = better overall contribution
- Compare your shape to the "Average" shape
- Each axis represents a different contribution dimension

#### Contribution Bar Chart

A bar chart comparing you vs. the pool:

**Bars**:
- **Left bars**: Your metrics
- **Right bars**: Pool totals/averages
- **Metrics**:
  - Signal count comparison
  - Revenue comparison

**Colors**:
- Your contributions: Highlighted color (e.g., purple)
- Pool totals: Gray or secondary color

**Scaling**: Revenue values may be scaled for better visualization (check tooltips for actual values)

### Refreshing Data

Click the **"Refresh Data"** button to:
- Reload latest statistics
- Update contribution percentages
- Fetch new revenue information
- Refresh all charts

**When to Refresh**:
- After submitting new signals
- After revenue distributions
- Periodically to see updates

### Understanding Your Contribution

**What Counts as Contribution**:
- Every signal you submit counts as 1 contribution
- Signal weight affects weighted aggregations
- Your signals being selected for aggregations increases your value

**Revenue Calculation**:
- Revenue is distributed based on:
  - Number of your signals used in aggregation
  - Weight of your signals
  - Total contributions to that aggregation
- Formula: `Your Share = (Your Signals × Weight) / (Total Signals × Average Weight) × Total Revenue`

**Increasing Your Contribution**:
- Submit more signals
- Use higher weights for high-confidence signals
- Participate in aggregations with revenue

---

## 💰 Revenue Distribution

### Overview

The Revenue Distribution page allows you to view your earnings and distribute revenue from aggregations to all contributors.

### Accessing Revenue Distribution

1. Click **"Revenue Distribution"** in the left sidebar (💵 icon)
2. Page loads your revenue information

### Revenue Overview

At the top, you'll see summary cards:

#### 1. Total Revenue Earned

- **Your lifetime earnings**: All revenue you've ever received
- **Format**: ETH amount with 4 decimal places
- **Example**: `0.0523 ETH`
- **Includes**: All distributed revenue from past aggregations

#### 2. Participant Share

- **Your estimated share**: Expected participant portion (95% of total)
- **Format**: ETH amount
- **Note**: 5% goes to platform fee
- **Formula**: `Total Revenue × 0.95`

#### 3. Platform Fee

- **Platform portion**: 5% fee for maintaining the system
- **Format**: ETH amount
- **Auto-calculated**: Based on total revenue

### Revenue History Table

Below the summary, you'll see a table of revenue history:

**Columns**:
- **Signal ID**: The signal that generated revenue
- **Revenue**: ETH amount earned
- **Date**: When the revenue was distributed

**Note**: Currently shows mock data structure. Real revenue history will be populated from on-chain events.

### Distributing Revenue

#### When to Distribute

Revenue can be distributed when:
- An aggregation has been completed
- The aggregation has revenue (ETH was sent when created)
- The aggregation hasn't been distributed yet
- You have permission to trigger distribution

#### Distribution Process

**Step 1: Click "Distribute Revenue"**

1. Find the **"Distribute Revenue"** button (top right of the card)
2. Click the button
3. A modal dialog appears

**Step 2: Select Aggregation**

In the modal:
- **Dropdown**: Shows all available aggregations
- **Format**: `Aggregation #X` with status indicators
- **Status indicators**:
  - ✅ **"Available"**: Has revenue and can be distributed
  - ⚠️ **"No Revenue"**: Aggregation has 0 ETH
  - ❌ **"Already Distributed"**: Revenue already distributed

**Step 3: Review Aggregation Info**

For each aggregation, you'll see:
- **Aggregation ID**: The aggregation number
- **Total Revenue**: ETH amount available
- **Status**: Whether it can be distributed
- **Revenue Distributed**: Amount already distributed (if any)

**Step 4: Confirm Distribution**

1. Select an aggregation with "Available" status
2. Review the revenue amount
3. Click **"Distribute Revenue"** button in the modal
4. **Wallet confirmation**: Approve the transaction
5. Wait for transaction confirmation

**Step 5: Distribution Complete**

After confirmation:
- ✅ Success message appears
- ✅ Revenue is automatically distributed to all contributors
- ✅ Your share is calculated based on your contribution
- ✅ Your "Total Revenue Earned" updates automatically
- ✅ Modal closes automatically

### Understanding Distribution

**How Distribution Works**:

1. **Trigger**: Someone clicks "Distribute Revenue" for an aggregation
2. **Calculation**: Contract calculates each participant's share:
   - Based on signals used in aggregation
   - Weighted by signal weights
   - Proportional to total contributions
3. **Distribution**: ETH is sent to each contributor's wallet
4. **Platform Fee**: 5% goes to platform address
5. **Recording**: Distribution is recorded on-chain

**Your Share Calculation**:
```
Your Share = (Your Signals Used × Your Signal Weight) / 
             (Total Signals Used × Average Weight) × 
             (Total Revenue × 0.95)
```

**Example**:
- Aggregation used 4 signals total
- You contributed 2 signals (weight: 1 each)
- Total revenue: 0.1 ETH
- Your share: `(2 × 1) / (4 × 1) × (0.1 × 0.95) = 0.0475 ETH`

### Distribution Messages

**Success Messages**:
- ✅ `"Revenue distributed successfully! Total: X ETH (Participants: Y ETH, Platform: Z ETH)"`
- Shows breakdown of distribution

**Warning Messages**:
- ⚠️ `"Distribution completed for Aggregation #X, but it had no revenue (0 ETH)"`
- Indicates the aggregation was created without sending ETH

**Error Messages**:
- ❌ `"Failed to distribute revenue: [error reason]"`
- Common reasons: Already distributed, invalid aggregation, contract error

### After Distribution

- Your revenue balance updates immediately
- You can see the distribution transaction on Etherscan
- Revenue appears in your wallet
- History table updates (when implemented)

---

## ⚙️ Settings

### Overview

The Settings page displays configuration information and allows you to adjust application settings.

### Accessing Settings

1. Click **"Settings"** in the left sidebar (⚙️ icon)
2. Settings page opens

### Wallet Connection Card

#### Connection Status

- **Connected**: Green indicator showing wallet is connected
- **Disconnected**: Red indicator - click "Connect Wallet" to connect

#### Connected Address

- **Format**: Full address with copy button
- **Example**: `0xFa6a3f29719A72cE35175D2AB8030DffD6e2A6Da`
- **Actions**:
  - Click address to copy to clipboard
  - Use copied address for transactions or verification

#### Current Network

- **Network Name**: Sepolia Testnet (expected)
- **Chain ID**: `11155111`
- **Status Indicators**:
  - ✅ **Correct Network**: Green checkmark
  - ⚠️ **Wrong Network**: Warning with instructions to switch

**If Wrong Network**:
1. Click the warning
2. Follow instructions to switch
3. Or manually switch in your wallet

### Network Settings Card

Displays network configuration:

#### Sepolia Chain ID

- **Value**: `11155111`
- **Copyable**: Click to copy
- **Use**: For manual network configuration

#### RPC URL

- **Value**: Sepolia RPC endpoint
- **Example**: `https://eth-sepolia.public.blastapi.io`
- **Copyable**: Click to copy
- **Use**: For wallet or dApp configuration

#### Zama Gateway URL

- **Value**: Zama Gateway endpoint for FHE decryption
- **Example**: `https://gateway.sepolia.zama.ai`
- **Copyable**: Click to copy
- **Use**: For Gateway integration or verification

### Contract Configuration Card

Shows smart contract information:

#### Current Mode

- **Mock Mode**: Plaintext mode for testing
  - Signals stored in plaintext
  - No encryption overhead
  - Fast aggregation results
  - ⚠️ Not for production use

- **FHE Mode**: Encrypted mode for production
  - Signals encrypted end-to-end
  - Requires Gateway for decryption
  - True privacy protection
  - ✅ Recommended for production

#### Contract Addresses

- **Mock Contract**: Address of Mock contract
  - Format: `0x...` (42 characters)
  - Copyable
  - Tagged as "Active" if currently used

- **FHE Contract**: Address of FHE contract
  - Format: `0x...` (42 characters)
  - Copyable
  - Tagged as "Active" if currently used

- **Current Contract**: Which address is currently active
  - Highlighted or tagged
  - Changes based on mode

**Note**: Contract addresses are configured via environment variables. Contact administrator to change.

### Feature Settings Card

#### FHE Encryption Mode Switch

- **Toggle**: Switch between Mock and FHE modes
- **State**: Shows current mode (ON = FHE, OFF = Mock)

**How to Switch**:

1. **Click the switch**
2. **Confirmation modal appears**:
   - Explains the mode change
   - Warns that page will reload
   - Shows current and target mode
3. **Confirm**: Click "OK" to proceed
4. **Page reloads**: Automatically refreshes with new mode
5. **Mode active**: New mode is now active

**Important Notes**:
- Switching modes requires page reload
- Unsaved data may be lost
- Mode preference is saved in browser storage
- Different modes use different contracts

**When Switch is Disabled**:
- FHE contract not deployed
- FHE mode not available
- Check contract configuration

### Understanding Mode Differences

| Feature | Mock Mode | FHE Mode |
|---------|-----------|----------|
| **Encryption** | ❌ None | ✅ End-to-end |
| **Privacy** | ❌ Low | ✅ High |
| **Speed** | ✅ Fast | ⚠️ Slower |
| **Gateway** | ❌ Not needed | ✅ Required |
| **Use Case** | Testing | Production |
| **Data Storage** | Plaintext | Encrypted |

### Copying Information

Most values in Settings are copyable:
- Click on any address or URL
- Text is copied to clipboard
- Brief confirmation appears
- Paste wherever needed

### Refreshing Settings

Settings auto-update when:
- Wallet connection changes
- Network switches
- Mode changes

Manual refresh: Reload the page (F5 or Ctrl+R)

---

## 🔧 Troubleshooting

### Connection Issues

#### "Wallet not detected"

**Symptoms**:
- "Connect Wallet" button doesn't respond
- No wallet popup appears

**Solutions**:
1. **Check wallet extension**:
   - Ensure MetaMask/OKX Wallet is installed
   - Extension should be enabled in browser
   - Try refreshing the extension

2. **Check browser compatibility**:
   - Use Chrome, Firefox, or Edge
   - Update browser to latest version
   - Clear browser cache

3. **Check extension permissions**:
   - Wallet extension needs access to current site
   - Grant permissions if prompted

#### "Wrong network"

**Symptoms**:
- Warning message about network mismatch
- Features disabled

**Solutions**:
1. **Auto-switch**:
   - Click "Switch Network" in the prompt
   - Confirm in wallet

2. **Manual switch**:
   - Open wallet extension
   - Select "Sepolia Testnet" from network dropdown
   - Return to application

3. **Add Sepolia** (if not available):
   - See "Quick Start" section for network details
   - Add manually in wallet settings

#### "Connection rejected"

**Symptoms**:
- Wallet popup appears but connection fails
- Error message about rejection

**Solutions**:
1. **Try again**: Click "Connect Wallet" again
2. **Check wallet**: Ensure wallet is unlocked
3. **Approval**: Click "Connect" or "Approve" in wallet popup
4. **Permissions**: Check if wallet blocked the site

### Transaction Issues

#### "Transaction failed"

**Symptoms**:
- Transaction submission fails
- Error in wallet or console

**Common Causes & Solutions**:

1. **Insufficient Gas**:
   - **Solution**: Get more Sepolia ETH from faucet
   - **Check**: Wallet balance in top bar

2. **Nonce Error**:
   - **Solution**: Wait for pending transactions to confirm
   - **Check**: Wallet transaction history

3. **Contract Error**:
   - **Solution**: Verify inputs are valid
   - **Check**: Signal IDs exist, amounts are correct

4. **Network Congestion**:
   - **Solution**: Wait and retry
   - **Check**: Sepolia network status

#### "Transaction pending too long"

**Symptoms**:
- Transaction submitted but not confirming
- Stuck in "pending" state

**Solutions**:
1. **Wait**: Sepolia can be slow (up to 2 minutes)
2. **Check Etherscan**: View transaction status
3. **Replace**: Increase gas in wallet and resubmit
4. **Cancel**: If possible, cancel and retry

#### "User rejected transaction"

**Symptoms**:
- Wallet popup closed without confirming
- No transaction submitted

**Solution**:
- This is normal user behavior
- Simply try again when ready
- Ensure you click "Confirm" in wallet

### Signal Issues

#### "Signal not appearing"

**Symptoms**:
- Submitted signal doesn't show in list
- Signal cards not updating

**Solutions**:
1. **Wait**: Blockchain confirmation takes time (10-30 seconds)
2. **Refresh**: Click "Refresh" button on dashboard
3. **Check transaction**: Verify transaction confirmed on Etherscan
4. **Cache**: Clear browser cache and refresh

#### "Encryption failed"

**Symptoms**:
- "Encrypting..." stuck or error
- FHE encryption process fails

**Solutions**:
1. **Check FHE mode**: Verify FHE mode is enabled and contract deployed
2. **SDK issues**: Check browser console for errors
3. **Switch to Mock**: Use Mock mode for testing
4. **Refresh**: Reload page and try again

### Aggregation Issues

#### "No aggregation results"

**Symptoms**:
- Created aggregation but no results shown
- Chart is empty

**Solutions**:

**For Mock Mode**:
1. **Wait**: Results appear after transaction confirms
2. **Refresh**: Click refresh button
3. **Check transaction**: Verify aggregation was created

**For FHE Mode**:
1. **Wait for Gateway**: Decryption takes 1-5 minutes
2. **Check status**: Look for "Decrypting..." indicator
3. **Be patient**: Gateway decryption is asynchronous
4. **Refresh**: Periodically refresh to check status

#### "Aggregation failed to create"

**Symptoms**:
- Transaction fails when creating aggregation
- Error message appears

**Solutions**:
1. **Check signals**: Ensure at least 2 signals selected
2. **Check signal IDs**: Verify signals exist and are valid
3. **Check gas**: Ensure sufficient ETH for gas
4. **Retry**: Try again with different signals

### Revenue Issues

#### "No revenue to distribute"

**Symptoms**:
- Aggregation shows 0 ETH revenue
- Cannot distribute revenue

**Cause**: Aggregation was created without sending ETH

**Solution**: 
- Create new aggregation with revenue amount
- Send ETH when creating aggregation
- Existing aggregations without revenue cannot generate revenue

#### "Revenue already distributed"

**Symptoms**:
- Cannot distribute revenue for aggregation
- Status shows "Already Distributed"

**Solution**:
- This aggregation's revenue was already distributed
- Check your wallet for previous distribution
- Create new aggregation for new revenue

#### "Distribution failed"

**Symptoms**:
- Distribution transaction fails
- Error message appears

**Solutions**:
1. **Check aggregation**: Verify aggregation is valid and has revenue
2. **Check permissions**: Ensure you can trigger distribution
3. **Check gas**: Ensure sufficient ETH
4. **Retry**: Try again

### Display Issues

#### "Page blank or not loading"

**Symptoms**:
- Page doesn't load
- White screen or error

**Solutions**:
1. **Refresh**: Hard refresh (Ctrl+F5 or Cmd+Shift+R)
2. **Clear cache**: Clear browser cache and cookies
3. **Check console**: Open DevTools (F12) and check for errors
4. **Network**: Check internet connection
5. **Update browser**: Use latest browser version

#### "Charts not displaying"

**Symptoms**:
- Aggregation chart is empty
- Charts show loading forever

**Solutions**:
1. **Check data**: Ensure aggregations exist
2. **Wait**: Charts load after data is fetched
3. **Refresh**: Refresh the page
4. **JavaScript**: Ensure JavaScript is enabled
5. **Console**: Check for chart library errors

### General Tips

1. **Always check browser console** (F12) for detailed error messages
2. **Verify network**: Always ensure you're on Sepolia
3. **Check wallet balance**: Maintain sufficient ETH for gas
4. **Be patient**: Blockchain operations take time
5. **Refresh when needed**: Many issues resolve with a simple refresh

---

## 🔒 Privacy & Security

### How Your Data is Protected

#### End-to-End Encryption

- **Client-Side Encryption**: Signals encrypted **before** leaving your device
- **Encryption Library**: Uses Zama Relayer SDK (browser-based)
- **No Plaintext Transmission**: Only encrypted data travels over the network
- **Your Control**: You control the encryption keys (managed by SDK)

#### On-Chain Storage

- **Encrypted Data Only**: Blockchain stores only encrypted signals
- **Immutable**: Once encrypted, signal values cannot be changed
- **Verifiable**: Encryption proofs are stored for verification
- **Transparent**: Encryption process is auditable on-chain

#### Homomorphic Computation

- **Encrypted Processing**: Aggregations happen **without** decryption
- **Zero-Knowledge**: Individual values never revealed during computation
- **FHE Operations**: Addition, multiplication, division on encrypted data
- **Result Only**: Only final aggregation result is decrypted

#### Selective Decryption

- **Aggregation Results**: Only final results are decrypted by Gateway
- **Individual Signals**: Remain encrypted forever
- **Gateway Service**: Trusted Zama Gateway handles decryption
- **Public Decryption**: Anyone can request result decryption (but not individual signals)

### Who Can See Your Signals?

#### ❌ Cannot See Your Signal Values

- **Other Users**: Cannot decrypt or view your individual signals
- **Blockchain Explorers**: Can only see encrypted data (hex strings)
- **Smart Contracts**: Process encrypted data without decryption
- **Network Observers**: Cannot interpret encrypted transmissions
- **Application Developers**: Cannot access your signal values

#### ✅ Only You Can See (Before Submission)

- **Your Original Value**: You see it before encryption in the form
- **After Encryption**: Even you cannot see the value once encrypted
- **This is by Design**: Privacy protection includes protection from yourself viewing past signals

### Revenue Distribution Fairness

#### Automatic Calculation

- **Based on Contribution**: Your share = your signals / total signals × revenue
- **Weight Consideration**: Weighted signals count more in weighted aggregations
- **Transparent Formula**: Calculation logic is in smart contract (public)
- **On-Chain Verification**: Anyone can verify distribution fairness

#### No Manual Intervention

- **Smart Contract**: Handles all calculations automatically
- **No Admin Control**: No central authority can manipulate distributions
- **Immutable Rules**: Distribution rules cannot be changed after deployment
- **Fair by Default**: Designed to be fair to all participants

### Security Best Practices

#### For Users

1. **Secure Your Wallet**:
   - Never share your private key or recovery phrase
   - Use hardware wallet for large amounts
   - Keep wallet software updated

2. **Verify Transactions**:
   - Always review transaction details before confirming
   - Check contract addresses match expected values
   - Verify gas fees are reasonable

3. **Network Security**:
   - Always use official Sepolia network settings
   - Verify application URL is correct
   - Use HTTPS connections only

4. **Signal Privacy**:
   - Understand that signals are encrypted and private
   - Don't share signal values outside the platform
   - Trust the encryption process

#### For Developers

- Contract code is open source and auditable
- Encryption uses industry-standard FHE algorithms
- Gateway service is operated by Zama (trusted provider)
- No backdoors or secret decryption methods

### Privacy Guarantees

1. **Individual Signal Privacy**: ✅ Guaranteed encrypted forever
2. **Aggregation Privacy**: ✅ Individual signals never revealed in aggregation
3. **Result Transparency**: ✅ Aggregation results are public (by design)
4. **No Tracking**: ✅ No personal information collected
5. **Decentralized**: ✅ No central server storing your data

---

## ❓ FAQ

### General Questions

#### Q1: What is the Encrypted Signal Sharing Pool?

**A**: It's a decentralized platform that allows traders to share and aggregate trading signals while maintaining complete privacy using Fully Homomorphic Encryption (FHE). Signals are encrypted before leaving your device and remain encrypted throughout the aggregation process.

#### Q2: Why should I use this instead of regular signal sharing?

**A**: Traditional signal sharing exposes your trading strategy. This platform uses FHE to aggregate signals without revealing individual values, protecting your competitive advantage while still benefiting from collective intelligence.

#### Q3: Is this for production use or just testing?

**A**: Currently optimized for Sepolia testnet (testing). The technology is production-ready, but mainnet deployment requires additional configuration. Mock mode is for development/testing, while FHE mode demonstrates production capabilities.

### Technical Questions

#### Q4: Why do my signals show as encrypted (🔒)?

**A**: This is normal and expected! In FHE mode, signals are encrypted before being sent to the blockchain. The lock icon indicates your signal is protected. Only aggregation results are decrypted.

#### Q5: Can I view my submitted signal values later?

**A**: No. Once encrypted and submitted, individual signal values remain encrypted forever—even you cannot view them. This is by design to ensure privacy. Only aggregation results are decrypted.

#### Q6: What's the difference between Mock and FHE mode?

**A**:
- **Mock Mode**: Signals stored in plaintext, fast, for testing only
- **FHE Mode**: Signals encrypted end-to-end, requires Gateway decryption, true privacy protection

#### Q7: How does Gateway decryption work?

**A**: When aggregations complete in FHE mode, results are encrypted. The Zama Gateway service decrypts the results asynchronously. You'll see a "Decrypting..." status until completion (usually 1-5 minutes).

### Usage Questions

#### Q8: How do I earn revenue?

**A**:
1. Submit high-quality signals
2. Your signals get selected for aggregations
3. When aggregations include revenue (ETH), you receive a share
4. Revenue is distributed automatically based on your contribution

#### Q9: How is my revenue share calculated?

**A**: Your share = (Your signals used × Your signal weight) / (Total signals × Average weight) × (Total revenue × 0.95). The remaining 5% goes to platform maintenance.

#### Q10: Can I use this on Ethereum mainnet?

**A**: Currently only Sepolia testnet is supported. Mainnet deployment requires:
- Deploying contracts to mainnet
- Configuring mainnet Gateway (if available)
- Updating frontend configuration
- More ETH for gas fees

### Problem Questions

#### Q11: Why isn't my aggregation showing results?

**A**: 
- **FHE Mode**: Wait for Gateway decryption (1-5 minutes)
- **Mock Mode**: Refresh the page or check transaction status
- **No signals selected**: Ensure you selected signals when creating aggregation
- **Network issues**: Check RPC connection

#### Q12: Why did my transaction fail?

**A**: Common reasons:
- **Insufficient gas**: Get more Sepolia ETH
- **Wrong network**: Switch to Sepolia
- **Invalid input**: Check signal IDs and values
- **Contract error**: Verify aggregation requirements are met

#### Q13: The page is blank/not loading

**A**:
1. Hard refresh (Ctrl+F5)
2. Clear browser cache
3. Check browser console (F12) for errors
4. Ensure JavaScript is enabled
5. Try different browser

### Privacy Questions

#### Q14: Who can see my trading signals?

**A**: Nobody. Signals are encrypted before leaving your device and remain encrypted on-chain. Only aggregation results (combinations of multiple signals) are decrypted, and even then, individual contributions cannot be determined.

#### Q15: Is my data stored on a server?

**A**: No. All data is stored on the Sepolia blockchain (decentralized). The application frontend runs in your browser, and encryption happens locally. No central server stores your signal values.

#### Q16: Can the platform administrators see my signals?

**A**: No. There are no administrators with special access. The smart contract processes encrypted data without decryption capability. Even if someone had admin access, they cannot decrypt your signals.

### Advanced Questions

#### Q17: How does FHE encryption work technically?

**A**: FHE (Fully Homomorphic Encryption) allows computation on encrypted data without decryption. When you submit a signal, it's encrypted using Zama's FHE scheme. The smart contract performs arithmetic operations (addition, multiplication) on encrypted values. Only the final result is decrypted by Zama Gateway.

#### Q18: What happens if Zama Gateway is down?

**A**: Aggregation results will remain encrypted until Gateway is available. The data is safe on-chain. Once Gateway recovers, decryption requests are processed. For critical use cases, consider Gateway reliability or use Mock mode for immediate results.

#### Q19: Can I verify the encryption and aggregation myself?

**A**: Yes. Everything is on-chain and verifiable:
- Encryption proofs are stored with each signal
- Aggregation transactions are public
- Smart contract code is open source
- You can verify using blockchain explorers and contract ABIs

#### Q20: How do I switch between Mock and FHE modes?

**A**:
1. Go to Settings page
2. Find "FHE Encryption Mode" switch
3. Toggle the switch
4. Confirm in the modal
5. Page reloads with new mode

---

## 📞 Getting Help

### Documentation Resources

- **This User Manual**: Comprehensive guide (you're reading it!)
- **README**: Project overview and technical details
- **Architecture Docs**: Technical architecture explanations
- **Demo Script**: Video demonstration guide

### Community Support

- **GitHub Issues**: Report bugs or request features
  - Repository: `https://github.com/0xxyiy0/-Encrypted-Signal-Sharing-Pool`
  - Use issue templates for best results
- **Discussions**: Ask questions and share ideas
- **Documentation**: Check docs folder for detailed guides

### Debugging Tips

1. **Browser Console** (F12):
   - Check for JavaScript errors
   - View network requests
   - Inspect transaction details
   - See encryption progress logs

2. **Transaction Explorer**:
   - View transactions on [Sepolia Etherscan](https://sepolia.etherscan.io)
   - Verify transaction status
   - Check contract interactions

3. **Wallet Debugging**:
   - Check wallet transaction history
   - Verify network connection
   - Review gas estimates

### Reporting Issues

When reporting issues, include:
- **Steps to reproduce**: What you did
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happened
- **Error messages**: Copy exact error text
- **Browser/OS**: Your environment details
- **Screenshots**: Visual evidence helps

---

## 📝 Version History

### v1.0.0 (2025-01)

**Initial Release Features**:
- ✅ Wallet connection (MetaMask, OKX Wallet)
- ✅ Signal submission with FHE encryption
- ✅ Signal aggregation (Mean, Weighted Mean)
- ✅ Mock and FHE dual modes
- ✅ Revenue distribution system
- ✅ Contribution tracking
- ✅ Real-time dashboard
- ✅ Complete user interface
- ✅ Sepolia testnet support

**Known Limitations**:
- Testnet only (Sepolia)
- Gateway decryption requires patience (1-5 min)
- Revenue history display pending implementation
- Some advanced features in development

---

## 🎯 Quick Reference

### Keyboard Shortcuts

- **F12**: Open browser console
- **Ctrl+F5**: Hard refresh
- **Ctrl+R**: Refresh page
- **Esc**: Close modals

### Important Addresses

- **Sepolia Chain ID**: `11155111`
- **Sepolia RPC**: `https://eth-sepolia.public.blastapi.io`
- **Zama Gateway**: `https://gateway.sepolia.zama.ai`
- **Etherscan**: `https://sepolia.etherscan.io`

### Workflow Checklist

**First Time**:
- [ ] Install wallet extension
- [ ] Add Sepolia network
- [ ] Get test ETH
- [ ] Connect wallet
- [ ] Verify network

**Daily Use**:
- [ ] Connect wallet
- [ ] Submit signals
- [ ] Create aggregations
- [ ] Check results
- [ ] Distribute revenue (if applicable)

---

**Last Updated**: 2025-01-XX  
**Version**: 1.0.0  
**Documentation Version**: 1.0

---

<div align="center">

**Enjoy your privacy-preserving trading signal aggregation experience!** 🔐📊

**Built with ❤️ using Zama FHEVM**

For technical details, visit: [GitHub Repository](https://github.com/0xxyiy0/-Encrypted-Signal-Sharing-Pool)

</div>
