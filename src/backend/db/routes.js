import express from "express";
import { Preferences, User, Room } from "./Schemas";
import { nanoid, customAlphabet } from "nanoid";
const router = express.Router();

const generateRoomID = customAlphabet("ABCDEFGHJKMNOPQRSTUVWXYZ0123456789", 6);

// create a new room and add the host
// returns user credentials
router.post("/createRoom", async (req, res) => {
  const { location, numUsers, hostName } = req.body;
  const roomID = generateRoomID();
  const host = new User({
    name: hostName,
    credentials: nanoid(),
    roomID: roomID,
  });

  const _location = Array.isArray(location)
    ? { latitude: location[0], longitude: location[1] }
    : { location: location };

  const room = new Room({
    roomID: roomID,
    ..._location,
    numUsers: numUsers,
    users: [host],
  });

  try {
    await room.save();
    const savedHost = await host.save();
    console.log(`✓ host ${savedHost.name} created room ${savedHost.roomID}`);
    res.send({ credentials: savedHost.credentials, roomID: savedHost.roomID });
  } catch (err) {
    console.log(err);
    res.end();
  }
});

// join room
// *** ADD "room is full" and "room does not exist" errors ***
router.post("/joinRoom", async (req, res) => {
  const { roomID, userName } = req.body;
  const user = new User({
    name: userName,
    credentials: nanoid(),
    roomID: roomID,
  });

  try {
    const savedUser = await user.save();
    await Room.updateOne({ roomID: roomID }, { $push: { users: savedUser } });
    console.log(`☛ user ${savedUser.name} has joined room ${savedUser.roomID}`);
    res.send({ credentials: savedUser.credentials, roomID: savedUser.roomID });
  } catch (err) {
    console.log(err);
    res.end();
  }
});

// submit preferences
// *** ADD user authentication (i.e. can find user with credentials in user collection) ***
router.post("/submitPrefs", async (req, res) => {
  const { credentials, roomID, radius, price, categories, attributes } = req.body;
  const prefs = new Preferences({
    radius: radius,
    price: price,
    categories: categories,
    attributes: attributes,
  });

  try {
    const savedPrefs = await prefs.save();
    const foundUser = await User.findOneAndUpdate({ credentials: credentials }, { preferences: savedPrefs });
    console.log(`☆ user ${foundUser.name} has submitted their preferences`);
    await Room.updateOne({ roomID: roomID }, { $inc: { numPrefsDone: 1 } });
    res.end();
  } catch (err) {
    console.log(err);
    res.end();
  }
});

// returns [list of users and their state (1 if completed prefs, 0 otherwise), room size]
router.get("/getUsers", async (req, res) => {
  const { credentials, roomID } = req.query;

  try {
    const foundRoom = await Room.findOne({ roomID: roomID }).populate("users").exec();
    const users = foundRoom.users.map((user) => [user.name, user.preferences !== null ? 1 : 0]);
    res.send([users, foundRoom.numUsers]);
  } catch (err) {
    console.log(err);
    res.end();
  }
});

router.post("/submitPicks", async (req, res) => {
  const { credentials, roomID, picks } = req.body;
  try {
    const foundUser = await User.findOneAndUpdate({ credentials: credentials }, { picks: picks });
    console.log(`☆ user ${foundUser.name} has submitted their picks`);
    await Room.updateOne({ roomID: roomID }, { $inc: { numPicksDone: 1 } });
    res.end();
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
