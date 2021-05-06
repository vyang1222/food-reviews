import mongoose from "mongoose";

const maxUsers = 100; // a reasonable number
const Schema = mongoose.Schema;

const PreferencesSchema = new Schema({
  radius: { type: Number, required: true, min: 0, max: 40000 },
  price: { type: String, required: true },
  categories: { type: String },
  attributes: { type: String },
});

const UserSchema = new Schema({
  name: { type: String, required: true, maxLength: 50 },
  credentials: { type: String, required: true },
  roomID: { type: String, required: true, minLength: 6, maxLength: 6 },
  preferences: { type: Schema.Types.ObjectId, ref: "preferences", default: null },
  picks: { type: [String], default: null },
});

const RoomSchema = new Schema({
  roomID: { type: String, required: true, unique: true, minLength: 6, maxLength: 6 },
  location: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  numUsers: { type: Number, required: true, min: 0, max: maxUsers },
  users: [{ type: Schema.Types.ObjectId, ref: "users" }],
  numPrefsDone: { type: Number, default: 0, min: 0, max: maxUsers },
  numPicksDone: { type: Number, default: 0, min: 0, max: maxUsers },
});

export const Preferences = mongoose.model("preferences", PreferencesSchema, "preferences");
export const User = mongoose.model("users", UserSchema, "users");
export const Room = mongoose.model("rooms", RoomSchema, "rooms");
