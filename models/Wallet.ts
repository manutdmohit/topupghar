import mongoose, { Document, Schema, model, models } from 'mongoose';

// --- Wallet Transaction Interface ---
export interface IWalletTransaction extends Document {
  transactionId: string;
  userId: string;
  type: 'topup' | 'payment' | 'refund' | 'admin_adjustment';
  amount: number;
  balance: number; // Balance after transaction
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentMethod?: string; // For topups: 'esewa', 'khalti', etc.
  receiptUrl?: string; // For topup verification
  orderId?: string; // For payment transactions
  adminId?: string; // For admin adjustments
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// --- Wallet Interface ---
export interface IWallet extends Document {
  userId: string;
  balance: number;
  totalTopups: number;
  totalSpent: number;
  lastTransactionDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// --- Wallet Transaction Schema ---
const WalletTransactionSchema = new Schema<IWalletTransaction>(
  {
    transactionId: {
      type: String,
      required: true,
      default: function () {
        // Generate transaction ID with format: TXN-YYYYMMDD-HHMMSS-RANDOM
        const now = new Date();
        const dateStr =
          now.getFullYear().toString() +
          (now.getMonth() + 1).toString().padStart(2, '0') +
          now.getDate().toString().padStart(2, '0');
        const timeStr =
          now.getHours().toString().padStart(2, '0') +
          now.getMinutes().toString().padStart(2, '0') +
          now.getSeconds().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, '0');
        return `TXN-${dateStr}-${timeStr}-${random}`;
      },
    },
    userId: { type: String, required: true },
    type: {
      type: String,
      enum: ['topup', 'payment', 'refund', 'admin_adjustment'],
      required: true,
    },
    amount: { type: Number, required: true },
    balance: { type: Number, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: { type: String },
    receiptUrl: { type: String },
    orderId: { type: String },
    adminId: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

// --- Wallet Schema ---
const WalletSchema = new Schema<IWallet>(
  {
    userId: { type: String, required: true, unique: true },
    balance: { type: Number, default: 0, min: 0 },
    totalTopups: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastTransactionDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// --- Indexes for Fast Search ---
WalletTransactionSchema.index({ transactionId: 1 }, { unique: true });
WalletTransactionSchema.index({ userId: 1 });
WalletTransactionSchema.index({ type: 1 });
WalletTransactionSchema.index({ status: 1 });
WalletTransactionSchema.index({ createdAt: -1 });
WalletTransactionSchema.index({ orderId: 1 });

// Note: userId index is automatically created by unique: true constraint
WalletSchema.index({ isActive: 1 });

// --- Models ---
const WalletTransaction =
  models.WalletTransaction ||
  model<IWalletTransaction>('WalletTransaction', WalletTransactionSchema);
const Wallet = models.Wallet || model<IWallet>('Wallet', WalletSchema);

export { WalletTransaction, Wallet };
export default Wallet;
