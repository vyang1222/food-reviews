import mongoose from "mongoose";

const maxUsers = 32; // a reasonable number
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  imageURL: { type: String },
});

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
  preferences: { type: Schema.Types.ObjectId, ref: "preferences", default: null },
  restaurantsPick: { type: [{ type: Schema.Types.ObjectId, ref: "restaurants" }], default: null },
});

const RoomSchema = new Schema({
  roomID: { type: String, required: true, unique: true, minLength: 6, maxLength: 6 },
  location: { type: String, required: true },
  numUsers: {
    type: Number,
    required: true,
    min: 0,
    max: maxUsers,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },
  users: [{ type: Schema.Types.ObjectId, ref: "users" }],
  restaurantPick: { type: Schema.Types.ObjectId, ref: "restaurants" },
});

export const Restaurant = mongoose.model("restaurants", RestaurantSchema, "restaurants");
export const Preferences = mongoose.model("preferences", PreferencesSchema, "preferences");
export const User = mongoose.model("users", UserSchema, "users");
export const Room = mongoose.model("rooms", RoomSchema, "rooms");
