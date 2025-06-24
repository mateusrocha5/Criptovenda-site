# CriptoVenda - Cryptocurrency Token Pre-Sale Platform

## Overview
CriptoVenda is a comprehensive cryptocurrency token pre-sale platform created by Mateus Dias Rocha (same creator of ZumbiCoin). The platform features advanced KYC verification, multi-language news feed, Web3 wallet integration, interactive charts, and AI-powered WhatsApp support. Users can browse and purchase various cryptocurrency tokens including ZumbiCoin (ZUN), PixCoin, MetaPix, and others using multiple payment methods.

## Project Status
**Current Phase**: Complete Platform with Admin Panel
**Brand**: CriptoVenda by Mateus Dias Rocha

## Features Completed

### ✅ Core Infrastructure
- React + TypeScript frontend with Vite
- Express.js backend with JWT authentication
- In-memory storage with comprehensive CRUD operations
- User authentication system with admin roles
- Responsive design with Tailwind CSS and shadcn/ui

### ✅ User Authentication System
- User registration and login with JWT tokens
- Password hashing with bcrypt
- Admin role management
- Session management and protected routes

### ✅ KYC Verification System
- Personal information collection forms
- Document upload functionality
- KYC status tracking (pending, approved, rejected)
- Admin review capabilities

### ✅ Token Management
- Pre-loaded token data (PixCoin, MetaPix, BrasilToken)
- Token browsing with detailed information
- Purchase modal with payment method selection
- Progress tracking for token sales

### ✅ Wallet Integration
- Wallet connection modal with multiple options
- MetaMask, TrustWallet, WalletConnect support
- Mock wallet connection functionality

### ✅ News Feed System (COMPLETED)
- CryptoCompare API integration for real-time news
- Multi-language support (Portuguese, English, Spanish)
- News categorization and filtering
- Search functionality with query support
- Responsive news cards with fallback images
- Date formatting with regional locales
- Error handling and loading states

### ✅ Admin Panel (COMPLETED)
- Complete user management interface
- KYC approval/rejection workflow
- Token management and configuration with image upload
- Purchase transaction monitoring
- Analytics dashboard with stats cards
- Message management system
- Token creation with optional image URLs

### ✅ Web3 Wallet Integration (COMPLETED)
- Wallet connection page with MetaMask support
- Portfolio management and token balances
- Transaction history tracking
- Multi-wallet support (MetaMask, TrustWallet, WalletConnect)

### ✅ Interactive Charts & Analytics (COMPLETED)
- Real-time price charts with Recharts library
- Volume analysis and market cap tracking
- Multi-token comparison charts
- Responsive chart components
- Multiple timeframe support

### ✅ AI-Powered WhatsApp Support (COMPLETED)
- Floating chat widget on all pages
- AI assistant with cryptocurrency knowledge
- Direct WhatsApp integration (+55 11 97382-9459)
- Contextual responses about platform features
- Professional support escalation

## Features Planned

### 📋 Transaction History
- User purchase history
- Transaction status tracking
- Payment method details
- Export functionality

### 📋 Blockchain Integration
- Smart contract integration
- Real-time token price updates
- Blockchain transaction verification
- Wallet balance checking

### 📋 Notification System
- Email notifications for KYC status
- Purchase confirmations
- Price alerts and updates
- Admin notification dashboard

## Architecture

### Frontend (`client/`)
- **React 18** with TypeScript and Vite
- **Tailwind CSS** with shadcn/ui components
- **TanStack Query** for data fetching and caching
- **Wouter** for client-side routing
- **React Hook Form** with Zod validation

### Backend (`server/`)
- **Express.js** with TypeScript
- **JWT** authentication with bcrypt
- **In-memory storage** with complete CRUD interface
- **CryptoCompare API** integration for news

### Key Components
- `NewsSection.tsx` - Multi-language news feed with search and filtering
- `WalletContext.tsx` - Wallet connection management
- `PurchaseModal.tsx` - Token purchase interface
- `KYCSection.tsx` - KYC verification forms
- `storage.ts` - In-memory data management interface

## Admin Access
- **Email:** mateus@diasrocha
- **Senha:** mateus@0827

## Recent Changes

### January 24, 2025 - Security Update & Platform Launch
- **Security Patch**: Updated Vite from 5.4.14 to 5.4.15 to fix CVE-2025-30208 file system bypass vulnerability
- **CriptoVenda Platform Launch**
- **Complete Rebrand**: Changed from TokenCrypto to CriptoVenda
- **Creator Attribution**: Added Mateus Dias Rocha as creator (same creator of ZumCoin)
- **WhatsApp Support Integration**: Added AI chat widget with direct WhatsApp support (+55 11 97382-9459)
- **Web3 Wallet Page**: Complete wallet management with portfolio tracking
- **Interactive Charts**: Advanced charting system with price, volume, and market cap analytics
- **Admin Panel**: Full administrative interface for user and token management
- **Navigation Enhancement**: Added Carteira, Gráficos, and Suporte to main navigation
- **Recharts Integration**: Professional chart library for data visualization
- **Multi-language News Feed**: Complete i18n support for Portuguese, English, and Spanish
- **CryptoCompare Integration**: Real-time cryptocurrency news with categorization

## User Preferences
- Language: Portuguese (primary), with multi-language support
- Communication: Professional and concise responses
- Code Style: TypeScript with comprehensive type safety
- Architecture: Prefer frontend-heavy solutions with minimal backend complexity

## Environment
- **CryptoCompare API**: Integrated for real-time news data
- **Deployment**: Replit-ready with automatic workflows
- **Database**: In-memory storage (scalable to PostgreSQL if needed)

## Next Steps
1. Implement admin panel with user management
2. Add KYC approval workflow for administrators
3. Create transaction history tracking
4. Integrate blockchain functionality for real token transactions
5. Implement notification system for user updates