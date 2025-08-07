import mongoose, { Document, Schema, model, models } from 'mongoose';

// --- Order Interface ---
export interface IOrder extends Document {
  orderId: string; // Auto-generated unique order ID
  platform: string; // e.g. 'instagram', 'freefire'
  type: string; // e.g. 'followers', 'diamonds'
  amount?: number | string; // E.g. 1000 (followers) or '1 month' (subscription)
  price?: number; // Always in NPR
  duration?: string; // E.g. '1 month', '1 year'
  level?: string; // For level up
  diamonds?: number; // Freefire etc.
  storage?: string; // For Microsoft, etc.
  uid?: string; // User/game account id
  phone: string;
  referredBy?: string;
  paymentMethod?: string; // e.g. 'eSewa'
  receiptUrl: string; // CDN URL or S3 key
  uid_email?: string;
  password?: string;
  tiktokLoginId?: string;
  tiktokPassword?: string; // ENCRYPTED if stored
  tiktokLoginMethod?: string;
  facebookLink?: string;
  garenaPassword?: string; // ENCRYPTED if stored
  createdAt: Date;
  status: 'pending' | 'approved' | 'rejected';
}

// --- Schema Definition ---
const OrderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        // Generate order ID with format: ORD-YYYYMMDD-HHMMSS-RANDOM
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
        return `ORD-${dateStr}-${timeStr}-${random}`;
      },
    },
    platform: { type: String, required: true },
    uid_email: { type: String }, // Combined UID/Email for easier search
    type: { type: String, required: true },
    amount: { type: Schema.Types.Mixed },
    price: { type: Number },
    duration: { type: String },
    level: { type: String },
    diamonds: { type: Number },
    storage: { type: String },
    uid: { type: String },
    password: { type: String }, // Encrypt/hash if needed
    phone: { type: String, required: true },
    referredBy: { type: String },
    paymentMethod: { type: String },
    receiptUrl: { type: String, required: true },
    tiktokLoginId: { type: String },
    tiktokPassword: { type: String }, // Encrypt/hash if needed
    tiktokLoginMethod: { type: String },
    facebookLink: { type: String },
    garenaPassword: { type: String }, // Encrypt/hash if needed
    createdAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// --- Indexes for Fast Search ---
OrderSchema.index({ orderId: 1 }, { unique: true });
OrderSchema.index({ phone: 1 });
OrderSchema.index({ platform: 1 });
OrderSchema.index({ type: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

const Order = models.Order || model<IOrder>('Order', OrderSchema);
export default Order;
