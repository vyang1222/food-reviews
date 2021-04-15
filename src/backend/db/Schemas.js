import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PreferencesSchema = new Schema({
  radius: {
    type: Number,
    required: true,
    min: 0,
    max: 40000,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },
  price: { type: String, required: true },
  categories: { type: String },
  attributes: { type: String },
});

const UserSchema = new Schema({
  name: { type: String, required: true, maxLength: 50 },
  credentials: { type: String, required: true },
  preference: { type: Schema.Types.ObjectId, ref: "preferences" },
});

const RoomSchema = new Schema({
  roomID: { type: String, required: true, unique: true, minLength: 6, maxLength: 6 },
  location: { type: String, required: true },
  numUsers: {
    type: Number,
    required: true,
    min: 0,
    max: 12,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },
  users: [UserSchema],
});

export const Preferences = mongoose.model("preferences", PreferencesSchema, "preferences");
export const User = mongoose.model("users", UserSchema, "users");
export const Room = mongoose.model("rooms", RoomSchema, "rooms");
