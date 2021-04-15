import express from "express";
import { Preferences, User, Room } from "./Schemas";
import { nanoid, customAlphabet } from "nanoid";
const router = express.Router();

const generateRoomID = customAlphabet("ABCDEFGHJKMNOPQRSTUVWXYZ0123456789", 6);

// create a new room and add the host
// returns user credentials
router.post("/createRoom", async (req, res) => {
  const { location, numUsers, hostName } = req.body;
  const host = new User({
    name: hostName,
    credentials: nanoid(),
  });
  const room = new Room({
    roomID: generateRoomID(),
    location: location,
    numUsers: numUsers,
    users: [host],
  });

  try {
    const savedRoom = await room.save();
    const savedHost = await host.save();
    console.log(`✓ host ${savedHost.name} created room ${savedRoom.roomID}`);
    res.send(savedHost.credentials);
  } catch (err) {
    console.log(err);
    res.end();
  }
});

// join room
// ADD "room is full" and "room does not exist" errors
router.post("/joinRoom", async (req, res) => {
  const { roomID, userName } = req.body;
  const user = new User({
    name: userName,
    credentials: nanoid(),
  });

  try {
    const savedUser = await user.save();
    await Room.updateOne({ roomID: roomID }, { $push: { users: savedUser } });
    console.log(`☛ user ${savedUser.name} has joined room `);
    res.send(savedUser.credentials);
  } catch (err) {
    console.log(err);
    res.end();
  }
});

// clear out all rooms (i.e. empty all collections)
router.delete("/clearRooms", async (req, res) => {
  try {
    await Preferences.deleteMany({});
    await User.deleteMany({});
    await Room.deleteMany({});
    console.log("☠ cleared out collections");
    res.end();
  } catch (err) {
    console.log(err);
    res.end();
  }
});

module.exports = router;
