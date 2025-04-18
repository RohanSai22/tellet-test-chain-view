
# Tellet-Test Wallet

<p align="center">
  <img src="public/favicon.png" alt="Tellet-Test Wallet Logo" width="80" height="80">
</p>

<p align="center">
  A multi-chain cryptocurrency wallet for testing and development purposes
</p>

## Overview

Tellet-Test Wallet is a demonstration application that showcases blockchain wallet functionality across multiple chains. It is designed for educational and testing purposes, providing a sandbox environment to understand how cryptocurrency wallets work.

### Features

- **Mnemonic Generation**: Create BIP39 compliant 12-word seed phrases
- **Multi-Chain Support**: Derive addresses for 14+ different blockchains from a single mnemonic
- **Message Signing**: Sign and verify messages using Ethereum keys
- **Balance Simulation**: View simulated token balances across chains
- **QR Code Generation**: Generate QR codes for any wallet address

### Supported Blockchains

- Ethereum (ETH)
- Bitcoin (BTC) - Segwit & Taproot
- Polygon (MATIC)
- Binance Chain (BNB)
- Avalanche (AVAX)
- Fantom (FTM)
- Dogecoin (DOGE)
- Cosmos (ATOM)
- Near Protocol (NEAR)
- Sui (SUI)
- Sei (SEI)
- Tron (TRX)
- Solana (SOL)
- Mantra (OM)

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/RohanSai22/tellet-test-chain-view.git

# Navigate to the project directory
cd tellet-test-chain-view

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Technical Architecture

Tellet-Test Wallet is built with:

- **React**: Frontend UI framework
- **Typescript**: Type-safe JavaScript
- **Vite**: Fast, modern build tool
- **TailwindCSS**: Utility-first CSS framework
- **React Query**: Data fetching and state management
- **shadcn/ui**: Component library

### Implementation Notes

- All cryptographic operations in this demo app are simulated, as it's designed for educational purposes.
- In a production environment, real implementations would use Trust Wallet Core's WASM modules for cryptographic operations.
- No seed phrases or private keys are ever stored persistently - everything remains in memory only.

## Security Notice

⚠️ **IMPORTANT**: This is a TEST wallet for educational and development purposes only. 

- **NEVER** use this wallet for real cryptocurrency transactions
- **NEVER** enter real seed phrases or private keys
- All cryptographic operations are simulated

## Development

### Project Structure

```
/src
  /components        # UI components
  /hooks             # Custom React hooks
  /lib               # Utility functions
  /pages             # Application pages
```

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<p align="center">Created for educational and testing purposes only.</p>
