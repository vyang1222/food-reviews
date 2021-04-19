import axios from "axios";

/* REST API (wrapper functions) to interact with MongoDB from frontend + interact with sessionStorage for user "authentication" with tokens
    - see routes.js for documentation */

export const createRoom = async (numUsers, location, hostName) => {
  try {
    const res = await axios.post("/createRoom", { numUsers: numUsers, location: location, hostName: hostName });
    sessionStorage.setItem("credentials", res.data.credentials);
    sessionStorage.setItem("roomID", res.data.roomID);
    console.log("🔒 updated sessionStorage");
  } catch (err) {
    console.log(err);
  }
};

export const joinRoom = async (roomID, userName) => {
  try {
    const res = await axios.post("/joinRoom", { roomID: roomID, userName: userName });
    sessionStorage.setItem("credentials", res.data.credentials);
    sessionStorage.setItem("roomID", res.data.roomID);
    console.log("🔒 updated sessionStorage");
  } catch (err) {
    console.log(err);
  }
};

// preconditions: user has already joined room, and their credentials are already stored.
//                radius is in meters.
export const submitPrefs = async (radius, price, categories, attributes) => {
  try {
    await axios.post("/submitPrefs", {
      credentials: sessionStorage.getItem("credentials"),
      radius: radius,
      price: price,
      categories: categories,
      attributes: attributes,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getRestaurants = async () => {
  try {
    await axios.get("/getRestaurants", {
      credentials: sessionStorage.getItem("credentials"),
      roomID: sessionStorage.getItem("roomID"),
    });
  } catch (err) {
    console.log(err);
  }
};

// (eventually will be automatic)
export const clearRooms = async () => {
  try {
    await axios.delete("/clearRooms");
    sessionStorage.clear();
    console.log("🗑️ cleared sessionStorage");
  } catch (err) {
    console.log(err);
  }
};
