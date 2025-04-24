import {Schema, Document, ObjectId} from 'mongoose';

export const UserSchema = new Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  createdAt: {type: Date, default: Date.now},
});

export interface User extends Document {
  _id: ObjectId;
  email: string;
  password: string;
  createdAt: Date;
}
