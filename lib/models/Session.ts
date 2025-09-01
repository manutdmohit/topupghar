import { Schema, model, models, Document } from 'mongoose';

export interface ISession extends Document {
  sessionToken: string;
  userId: string;
  expires: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    sessionToken: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
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

const Session = models.Session || model<ISession>('Session', sessionSchema);

export default Session;

