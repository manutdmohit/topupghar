import { Schema, model, models, Document } from 'mongoose';

export interface IAccount extends Document {
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
}

const accountSchema = new Schema<IAccount>(
  {
    userId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
    providerAccountId: {
      type: String,
      required: true,
    },
    refresh_token: String,
    access_token: String,
    expires_at: Number,
    token_type: String,
    scope: String,
    id_token: String,
    session_state: String,
  },
  {
    timestamps: true,
  }
);

// Create compound index for OAuth accounts
accountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

const Account = models.Account || model<IAccount>('Account', accountSchema);

export default Account;

