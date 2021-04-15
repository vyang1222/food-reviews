import axios from "axios";

/* REST API (wrapper functions) to interact with MongoDB from frontend + interact with sessionStorage for user "authentication"
    - see routes.js for documentation */

export const createRoom = async (numUsers, location, hostName) => {
  try {
    const res = await axios.post("/createRoom", { numUsers: numUsers, location: location, hostName: hostName });
    sessionStorage.setItem("credentials", res.data);
    console.log("🔒 stored user credentials");
  } catch (err) {
    console.log(err);
  }
};

export const joinRoom = async (roomID, userName) => {
  try {
    const res = await axios.post("/joinRoom", { roomID: roomID, userName: userName });
    sessionStorage.setItem("credentials", res.data);
    console.log("🔒 stored user credentials");
  } catch (err) {
    console.log(err);
  }
};

// (eventually will be automatic)
export const clearRooms = async () => {
  try {
    await axios.delete("/clearRooms");
    sessionStorage.clear();
    console.log("🗑️ cleared user credentials");
  } catch (err) {
    console.log(err);
  }
};
