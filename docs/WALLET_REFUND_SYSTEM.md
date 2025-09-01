# Wallet Refund System Documentation

## Overview

The wallet refund system automatically processes refunds when admin rejects orders that were paid using wallet balance. This ensures users don't lose money when their orders are rejected.

## How It Works

### 1. **Order Creation Flow**

- User pays with wallet → Balance deducted immediately
- Order status set to `pending` (not `approved`)
- Admin reviews the order
- If approved → Order proceeds normally
- If rejected → Automatic refund processed

### 2. **Refund Process**

When admin rejects a wallet-paid order:

1. **Detection**: System detects status change to 'rejected' for wallet payment
2. **Validation**: Checks if order was paid with wallet
3. **Refund Processing**:
   - Creates refund transaction record
   - Adds amount back to user's wallet balance
   - Updates wallet statistics
4. **Notification**: Sends confirmation to admin and logs

### 3. **User Experience**

- **Before Payment**: Clear warning about pending admin review
- **After Payment**: Order shows as pending
- **If Rejected**: Automatic refund with transaction record
- **Wallet History**: Refund transactions clearly marked

## Technical Implementation

### API Routes Modified

#### `app/api/orders/[id]/route.ts`

- **PATCH Method**: Enhanced to detect wallet payment rejections
- **Refund Function**: `processWalletRefund()` handles refund logic
- **Error Handling**: Comprehensive error handling with detailed logging

#### `app/api/orders/route.ts`

- **Order Creation**: Wallet payments set to 'pending' status
- **Admin Notes**: Added note about pending admin review

### Frontend Components Updated

#### `app/topup/payment/page.tsx`

- **Wallet Balance Check**: Real-time balance validation
- **Payment Warning**: Clear notification about admin review requirement
- **Submit Prevention**: Disabled when insufficient balance

#### `app/admin/dashboard/orders/page.tsx`

- **Refund Indicator**: Shows "💰 Refunded" badge for rejected wallet payments
- **Confirmation Modal**: Informs admin about automatic refunds
- **Visual Feedback**: Clear status indicators

#### `components/wallet/WalletBalance.tsx`

- **Refund Badge**: Shows "💰 Refund" badge for refund transactions
- **Transaction History**: Displays refund transactions clearly

## Database Schema

### WalletTransaction Types

- `topup`: User adds money to wallet
- `payment`: User spends wallet balance
- `refund`: System refunds money (new)
- `admin_adjustment`: Admin manually adjusts balance

### Refund Transaction Structure

```typescript
{
  transactionId: "TXN-20241201-143022-001",
  userId: "user123",
  type: "refund",
  amount: 500, // Positive amount
  balance: 1500, // New balance after refund
  description: "Refund for rejected order ORD-123",
  status: "completed",
  orderId: "ORD-123",
  notes: "Order rejected by admin - automatic refund processed"
}
```

## User Flow Examples

### Successful Order

1. User pays NPR 500 with wallet
2. Balance: NPR 1000 → NPR 500
3. Order status: `pending`
4. Admin approves order
5. Order status: `approved`
6. No refund needed

### Rejected Order

1. User pays NPR 500 with wallet
2. Balance: NPR 1000 → NPR 500
3. Order status: `pending`
4. Admin rejects order
5. **Automatic refund processed**
6. Balance: NPR 500 → NPR 1000
7. Order status: `rejected`
8. Refund transaction created

## Error Handling

### Refund Failures

- **Wallet Not Found**: Returns error with contact support message
- **Invalid Amount**: Validates refund amount > 0
- **Database Errors**: Comprehensive logging and error reporting
- **Partial Failures**: Transaction rollback to prevent data inconsistency

### Admin Notifications

- **Success**: Logs refund completion with transaction details
- **Failure**: Returns detailed error message to admin
- **Telegram**: Status updates sent to admin Telegram

## Security Features

### Validation

- **User Ownership**: Only processes refunds for order owner
- **Amount Validation**: Ensures refund amount matches order amount
- **Status Validation**: Only processes refunds for rejected orders
- **Payment Method**: Only processes wallet payment refunds

### Audit Trail

- **Transaction Records**: Complete refund transaction history
- **Admin Notes**: Tracks who rejected and when
- **Logging**: Comprehensive server-side logging
- **Balance Tracking**: Accurate balance updates

## Benefits

### For Users

- ✅ **No Money Loss**: Automatic refunds prevent financial loss
- ✅ **Transparency**: Clear transaction history with refund records
- ✅ **Trust**: Confidence in wallet payment system
- ✅ **Immediate Feedback**: Real-time balance updates

### For Admins

- ✅ **Automatic Processing**: No manual refund work required
- ✅ **Clear Indicators**: Visual feedback for refunded orders
- ✅ **Audit Trail**: Complete transaction history
- ✅ **Error Handling**: Robust error handling and logging

### For System

- ✅ **Data Integrity**: Consistent wallet balance tracking
- ✅ **Scalability**: Handles multiple concurrent refunds
- ✅ **Reliability**: Comprehensive error handling
- ✅ **Monitoring**: Detailed logging for debugging

## Testing Scenarios

### Test Cases

1. **Normal Refund**: Reject wallet payment → Verify refund
2. **Multiple Refunds**: Multiple rejected orders → Verify all refunds
3. **Error Handling**: Invalid wallet → Verify error response
4. **Concurrent Refunds**: Multiple simultaneous rejections
5. **Edge Cases**: Zero amount, negative amount, etc.

### Manual Testing

1. Create order with wallet payment
2. Check wallet balance before and after
3. Reject order as admin
4. Verify refund in wallet history
5. Check admin dashboard indicators

## Future Enhancements

### Potential Improvements

- **Email Notifications**: Send refund confirmation emails
- **SMS Notifications**: Text message refund confirmations
- **Refund Reasons**: Allow admins to specify rejection reasons
- **Partial Refunds**: Support for partial order refunds
- **Refund Analytics**: Dashboard for refund statistics

### Monitoring

- **Refund Metrics**: Track refund rates and amounts
- **Performance Monitoring**: Monitor refund processing times
- **Error Tracking**: Alert on refund failures
- **User Feedback**: Collect user satisfaction with refund process

## Conclusion

The wallet refund system provides a robust, automated solution for handling rejected wallet payments. It ensures user trust, reduces admin workload, and maintains data integrity throughout the refund process.
