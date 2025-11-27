# 🌿 Carbon-Ledger

> Blockchain-Powered Carbon Credit Marketplace

[![Deployment Status](https://img.shields.io/badge/deployment-active-success)](https://carbon-ledger-ui.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-98.7%25-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Status](https://img.shields.io/badge/status-in%20development-yellow)]()

A decentralized marketplace for transparent and efficient carbon credit trading built on Ethereum blockchain. Carbon-Ledger leverages blockchain technology to ensure immutability, prevent double-counting, and democratize access to carbon markets.

🔗 **Live Demo:** [carbon-ledger-ui.vercel.app](https://carbon-ledger-ui.vercel.app)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Smart Contracts](#smart-contracts)
---

## 🌍 Overview

Carbon-Ledger addresses critical challenges in traditional carbon credit markets by providing a transparent, secure, and accessible platform for buying, selling, and trading carbon credits. The platform uses blockchain's distributed ledger technology to create an immutable record of all transactions, ensuring authenticity and preventing fraud [web:4].

### Why Blockchain for Carbon Credits?

- **Transparency**: Distributed ledger ensures all transactions are publicly verifiable
- **Immutability**: Prevents tampering and double-counting of carbon credits
- **Accessibility**: Reduces entry barriers for small and medium-sized enterprises
- **Efficiency**: Automates processes through smart contracts, reducing intermediary costs
- **Trust**: Cryptographic security ensures genuine carbon credit issuance and tracking

---

## ✨ Features

### Current Features
- 🔐 **Web3 Wallet Integration**: Connect with MetaMask and other popular wallets
- 🪙 **ERC-20 Carbon Credit Tokens**: Standardized tokenized carbon credits
- 📊 **Real-time Token Data**: View total supply, balances, and transaction history
- 🌐 **Sepolia Testnet Integration**: Test environment for safe development

### Planned Features
- 🛒 **Secondary Marketplace**: Peer-to-peer trading of carbon credits [web:6]
- 📝 **Smart Contract Automation**: Automated minting, burning, and distribution
- 🎯 **Carbon Credit Retirement**: Permanent removal from circulation
- 📈 **Analytics Dashboard**: Track market trends and personal carbon offset impact
- ✅ **Project Certification**: Automated validation of green project certifications [web:4]
- 🔍 **Transparent Tracking**: Complete lifecycle tracking of carbon credits

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16+ (TypeScript)
- **Styling**: Tailwind CSS
- **Web3 Integration**: 
  - Wagmi
  - RainbowKit
  - Viem

### Backend & Blockchain
- **Smart Contracts**: Solidity
- **Development Framework**: Foundry
- **Blockchain**: Ethereum (Sepolia Testnet)
- **Token Standards**: ERC-20, ERC-721 (planned)

### DevOps & Tools
- **Deployment**: Vercel
- **Version Control**: Git & GitHub
- **Testing**: Foundry Test Suite
- **Contract Verification**: Etherscan

---

## 🚀 Getting Started

### Prerequisites

```

node >= 18.0.0
npm >= 9.0.0
git
foundry (for smart contracts)

```

### Installation

1. **Clone the repository**
```

git clone https://github.com/Satya-Sherkar/Carbon-Ledger.git
cd Carbon-Ledger

```

2. **Install dependencies**
```

npm install

```

3. **Set up environment variables**
```

.env.example .env.local

```

Add your environment variables:
```

NEXT_PUBLIC_ALCHEMY_ID=your_alchemy_api_key
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

```

4. **Run development server**
```

npm run dev

```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Smart Contract Development

1. **Navigate to contracts directory**
```

cd contracts

```

2. **Install Foundry dependencies**
```

forge install

```

3. **Compile contracts**
```

forge build

```

4. **Run tests**
```

forge test

```

5. **Deploy to Sepolia**
```

forge script script/Deploy.s.sol --rpc-url sepolia --broadcast --verify

```

---

## 📜 Smart Contracts

### Architecture

The platform uses a modular smart contract architecture:

- **CarbonCreditToken.sol**: ERC-20 implementation for fungible carbon credits
- **Marketplace.sol**: Handles buying, selling, and trading logic

### Contract Addresses (Sepolia Testnet)

| Contract | Address | Explorer |
|----------|---------|----------|
| Carbon Credit Token | `0x07eC860dB41185c16545d2508161A6e575258412` | [View on Etherscan](https://sepolia.etherscan.io/address/0x07eC860dB41185c16545d2508161A6e575258412) |
| Marketplace | `0xfb74944f29Cd09cCF7cd1e4F9DD1BE09553fbb2f` | [View on Etherscan](https://sepolia.etherscan.io/address/0xfb74944f29Cd09cCF7cd1e4F9DD1BE09553fbb2f) |

---


## 📞 Contact

**Developer**: Satyam Sherkar

**Project Link**: [https://github.com/Satya-Sherkar/Carbon-Ledger](https://github.com/Satya-Sherkar/Carbon-Ledger)

**Live Demo**: [https://carbon-ledger-ui.vercel.app](https://carbon-ledger-ui.vercel.app)

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

</div>
<div align="center">⁂</div>


