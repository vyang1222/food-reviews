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
//                radius is in miles. _categories and _attributes have at least 1 item.
export const submitPrefs = async (_radius, price, _categories, _attributes) => {
  const radius = _radius * 1609; // convert to meters
  let categories = "";
  _categories.forEach((category) => (categories += category + ","));
  let attributes = "";
  _attributes.forEach((attribute) => (attributes += attribute + ","));

  try {
    await axios.post("/submitPrefs", {
      credentials: sessionStorage.getItem("credentials"),
      roomID: sessionStorage.getItem("roomID"),
      radius: radius,
      price: price,
      categories: categories.slice(0, -1),
      attributes: attributes.slice(0, -1),
    });
  } catch (err) {
    console.log(err);
  }
};

export const submitPicks = async (picks) => {
  try {
    await axios.post("/submitPicks", {
      credentials: sessionStorage.getItem("credentials"),
      roomID: sessionStorage.getItem("roomID"),
      picks: picks,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getUsers = async () => {
  try {
    const res = await axios.get("/getUsers", {
      params: {
        credentials: sessionStorage.getItem("credentials"),
        roomID: sessionStorage.getItem("roomID"),
      },
    });
    return res.data;
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
