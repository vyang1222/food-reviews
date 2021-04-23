import express from "express";
import { Restaurant, Preferences, User, Room } from "./Schemas";
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
    res.send({ credentials: savedHost.credentials, roomID: savedRoom.roomID });
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
  });

  try {
    const savedUser = await user.save();
    await Room.updateOne({ roomID: roomID }, { $push: { users: savedUser } });
    console.log(`☛ user ${savedUser.name} has joined room ${roomID}`);
    res.send({ credentials: savedUser.credentials, roomID: roomID });
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

// // returns list of restaurants if everyone has submitted their preferences
// // otherwise returns empty list
// router.get("/getRestaurants", async (req, res) => {
//   const { credentials, roomID } = req.body;

//   try {
//     const foundRoom = await Room.findOne({ room: roomID }).populate("users").exec();
//     const allUsers = foundRoom.users;
//     const doneUsers = allUsers.filter((user) => user.preferences !== null);
//     if (doneUsers.length !== allUsers.length) {
//       console.log("☒ waiting on " + (allUsers.length - doneUsers.length) + " users to submit their preferences...");
//       res.send([]);
//     } else {
//       console.log("☑ all users have submitted their preferences");
//       // *** call algorithm, which calls the YelpAPI (and populates user preferences to aggregate them) and returns the list of restaurants
//       const restaurants = getRestaurants();
//       // then, save the restaurants
//       restaurants.forEach(_restaurant => {const restaurant = new Restaurant{}; await restaurant.save()})
//       res.send(restaurants);
//     }
//   } catch (err) {
//     console.log(err);
//     res.end();
//   }
// });

router.post("/submitRestaurants", async (req, res) => {
  const { credentials, restaurantPicks } = req.body;
  try {
    console.log(`☆ user ${foundUser.name} has submitted their restaurant picks`);
    const foundUser = await User.findOneAndUpdate({ credentials: credentials }, { restaurantPicks: restaurantPicks });
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
