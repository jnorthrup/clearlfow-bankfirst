# Product Context: ClearFlow Application

## Why ClearFlow Exists

ClearFlow is a financial management platform that enables users to manage entities, link bank accounts via Plaid, process payments, and maintain governance compliance. It provides a unified interface for financial operations with built-in governance tracking.

## Problems It Solves

1. **Fragmented Financial Data**: Centralize entity management and financial tracking
2. **Banking Integration**: Seamless Plaid integration for account linking
3. **Governance Compliance**: Built-in governance documentation and Q&A
4. **Payment Processing**: Internal transfers and payment workflows
5. **User Onboarding**: Structured onboarding paths for new users

## How It Should Work (User Flow)

1. User signs up and completes profile setup
2. User selects onboarding path
3. User links bank accounts via Plaid
4. User manages entities and processes payments
5. User accesses governance documentation and Q&A

## Key User Experience Goals

- **Intuitive Dashboard**: Central hub for all financial activities
- **Secure Banking**: Plaid-powered secure account linking
- **Governance Built-In**: Track policies and compliance
- **Smooth Onboarding**: Guided path for new users

## Features

1. **Dashboard**: Overview of entities, payments, and system status
2. **Entity Management**: Create and manage financial entities
3. **Bank Account Linking**: Plaid integration for account connections
4. **Payments**: Internal transfers and payment processing
5. **Governance**: Documentation and Q&A for compliance
6. **Reserves Management**: Track reserve accounts
7. **Accounting**: Basic accounting dashboard

## Integration Points

- **Plaid API**: Bank account linking and transaction data
- **Database**: SQLite with Drizzle ORM
- **Backend**: Express.js API server
