# Wallet Feature Implementation

## Overview

The Wallet feature allows users to top up their account balance and use it for payments, providing a convenient alternative to traditional payment methods.

## Features

### 1. User Wallet Management

- **Top Up**: Users can add funds to their wallet using various payment methods
- **Balance View**: Real-time wallet balance and transaction history
- **Payment History**: Complete transaction log with status tracking

### 2. Admin Controls

- **Topup Approval**: Admins can approve or reject wallet topup requests
- **Transaction Management**: View and manage all wallet transactions
- **User Verification**: Verify payment receipts before approving topups

### 3. Payment Integration

- **Wallet Payment**: Users can pay for orders using wallet balance
- **Hybrid Payment**: Support for both wallet and traditional payment methods
- **Instant Processing**: Wallet payments are processed immediately

## Database Models

### Wallet Model

```typescript
interface IWallet {
  userId: string;
  balance: number;
  totalTopups: number;
  totalSpent: number;
  lastTransactionDate?: Date;
  isActive: boolean;
}
```

### Wallet Transaction Model

```typescript
interface IWalletTransaction {
  transactionId: string;
  userId: string;
  type: 'topup' | 'payment' | 'refund' | 'admin_adjustment';
  amount: number;
  balance: number;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentMethod?: string;
  receiptUrl?: string;
  orderId?: string;
  adminId?: string;
  notes?: string;
}
```

## API Endpoints

### User Endpoints

- `POST /api/wallet/topup` - Submit topup request
- `GET /api/wallet/topup` - Get topup history
- `GET /api/wallet/balance` - Get wallet balance and transactions
- `POST /api/wallet/pay` - Pay for order using wallet

### Admin Endpoints

- `GET /api/admin/wallet/pending` - Get pending topup requests
- `POST /api/admin/wallet/approve` - Approve/reject topup requests

## User Flow

### 1. Wallet Topup

1. User navigates to `/wallet` page
2. Selects "Top Up" tab
3. Enters amount and selects payment method
4. Uploads payment receipt
5. Submits request (status: pending)
6. Admin reviews and approves/rejects
7. If approved, balance is updated

### 2. Wallet Payment

1. User selects "Wallet Balance" as payment method
2. System checks wallet balance
3. If sufficient balance, order is created
4. Wallet balance is deducted immediately
5. Order status is set to "approved"

## Frontend Components

### WalletTopup Component

- Form for submitting topup requests
- Payment method selection
- Receipt upload functionality
- Validation and error handling

### WalletBalance Component

- Display current balance
- Transaction history with pagination
- Status indicators and filtering

### AdminWalletManagement Component

- Admin interface for managing topup requests
- Approval/rejection workflow
- Transaction filtering and search

## Security Features

- **Authentication Required**: All wallet operations require user login
- **Admin Authorization**: Topup approval requires admin privileges
- **Balance Validation**: Prevents overspending
- **Transaction Logging**: Complete audit trail of all operations

## Payment Methods Supported

- eSewa
- Khalti/IME
- ConnectIPS
- Bank Transfer

## Configuration

### Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/gameshop
NEXTAUTH_URL=http://localhost:3000
```

### Database Indexes

- Unique transaction IDs
- User-specific queries
- Status-based filtering
- Date-based sorting

## Usage Examples

### Topup Request

```typescript
const response = await fetch('/api/wallet/topup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 1000,
    paymentMethod: 'esewa',
    receiptUrl: 'https://example.com/receipt.jpg',
  }),
});
```

### Check Balance

```typescript
const response = await fetch('/api/wallet/balance');
const data = await response.json();
console.log('Balance:', data.wallet.balance);
```

### Admin Approval

```typescript
const response = await fetch('/api/admin/wallet/approve', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    transactionId: 'TXN-20241201-120000-001',
    action: 'approve',
    notes: 'Payment verified',
  }),
});
```

## Error Handling

- **Insufficient Balance**: Prevents wallet payments when balance is low
- **Invalid Transactions**: Validates all transaction data
- **Network Errors**: Graceful fallback for API failures
- **User Feedback**: Clear error messages and success notifications

## Future Enhancements

- **Auto-topup**: Scheduled automatic topups
- **Payment Plans**: Subscription-based topup options
- **Referral Rewards**: Bonus balance for referrals
- **Multi-currency**: Support for different currencies
- **API Integration**: Third-party payment gateway integration

## Testing

### Unit Tests

- Model validation
- API endpoint functionality
- Component rendering

### Integration Tests

- End-to-end payment flow
- Admin approval workflow
- Error scenarios

### Manual Testing

- User registration and login
- Topup request submission
- Admin approval process
- Wallet payment processing

## Deployment

1. **Database Migration**: Ensure Wallet models are created
2. **Environment Setup**: Configure required environment variables
3. **Component Registration**: Add wallet components to pages
4. **Admin Access**: Grant admin privileges to authorized users
5. **Monitoring**: Set up logging and error tracking

## Troubleshooting

### Common Issues

- **Balance Not Updated**: Check admin approval status
- **Payment Failed**: Verify wallet balance and transaction logs
- **Admin Access Denied**: Confirm user role and permissions

### Debug Steps

1. Check browser console for errors
2. Verify API endpoint responses
3. Review database transaction logs
4. Confirm user authentication status

## Support

For technical support or feature requests, please contact the development team or create an issue in the project repository.
