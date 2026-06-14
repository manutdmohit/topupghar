import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContactSettings extends Document {
  key: string;
  whatsapp: string;
  telegram: string;
  facebook: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSettingsSchema = new Schema<IContactSettings>(
  {
    key: { type: String, required: true, unique: true, default: 'default' },
    whatsapp: { type: String, required: true },
    telegram: { type: String, required: true },
    facebook: { type: String, required: true },
  },
  { timestamps: true },
);

export const ContactSettings: Model<IContactSettings> =
  mongoose.models.ContactSettings ||
  mongoose.model<IContactSettings>('ContactSettings', ContactSettingsSchema);
