import { Schema, model, models, Document } from 'mongoose';

export interface IVerificationToken extends Document {
  identifier: string;
  token: string;
  expires: Date;
}

const verificationTokenSchema = new Schema<IVerificationToken>(
  {
    identifier: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expires: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const VerificationToken =
  models.VerificationToken ||
  model<IVerificationToken>('VerificationToken', verificationTokenSchema);

export default VerificationToken;




