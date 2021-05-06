import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
import { EventEmitter } from "events";
import cors from "cors";

import { User, Room } from "./db/Schemas";
import { dummyRestaurants, winner } from "../utilities/misc";

const eventEmitter = new EventEmitter();
const routesHandler = require("./db/routes");
const app = express();
app.use(express.json());
app.use(cors());
app.use("/", routesHandler);

// SSE route
app.use("/:roomID/listen", async (req, res) => {
  const { roomID } = req.params;
  res.writeHead(200, {
    Connection: "keep-alive",
    "Content-Encoding": "none",
    "Cache-Control": "no-cache",
    "Content-Type": "text/event-stream",
  });

  eventEmitter.on(`${roomID}.users`, (name) => {
    res.write("event: newUser\n");
    res.write(`data: ${name}\n\n`);
  });

  eventEmitter.on(`${roomID}.choices`, (choices) => {
    res.write("event: choices\n");
    res.write(`data: ${choices}\n\n`);
  });

  eventEmitter.on(`${roomID}.results`, (winner) => {
    res.write("event: results\n");
    res.write(`data: ${winner}\n\n`);
  });
});

// DB Connection + Change Stream
mongoose
  .connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("DB Connected!");

    User.watch({ fullDocument: "updateLookup" }).on("change", (data) => {
      if (data.operationType === "insert") {
        const {
          fullDocument: { name, roomID },
        } = data;
        eventEmitter.emit(`${roomID}.users`, name);
      }
    });

    Room.watch({ fullDocument: "updateLookup" }).on("change", (data) => {
      if (data.operationType === "update" && data.ns.coll === "rooms") {
        const {
          fullDocument: { roomID, numUsers, numPrefsDone, numPicksDone },
          documentKey: { _id },
          updateDescription: { updatedFields },
        } = data;
        if (updatedFields.hasOwnProperty("numPrefsDone") && numPrefsDone === numUsers) {
          console.log("EXECUTING THE ALGORITHM...");
          /* TODO: replace with algorithm results */
          eventEmitter.emit(`${roomID}.choices`, JSON.stringify(dummyRestaurants));
        } else if (updatedFields.hasOwnProperty("numPicksDone") && numPicksDone === numUsers) {
          console.log("GETTING THE FINAL PICKS...");
          eventEmitter.emit(`${roomID}.results`, JSON.stringify(winner));
        }
      }
    });
  })
  .catch((err) => {
    console.log(err);
  });
// fix all deprecation warnings
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

/*
if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'frontend/build')));
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'frontend/build', routesHandler));
    });
}
*/

const PORT = process.env.PORT || 5000; // backend routing port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
