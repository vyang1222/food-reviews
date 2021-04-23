import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
import { EventEmitter } from "events";
import cors from "cors";
import { Room } from "./db/Schemas";

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

  eventEmitter.on(`${roomID}.choices`, (choices) => {
    res.write("data: choices are done!\n\n");
  });
});

// DB Connection
mongoose
  .connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("DB Connected!");
    Room.watch({ fullDocument: "updateLookup" }).on("change", (data) => {
      if (data.operationType === "update" && data.ns.coll === "rooms") {
        const {
          fullDocument: { roomID, numUsers, numPrefsDone, numPicksDone },
          documentKey: { _id },
          updateDescription: { updatedFields },
        } = data;
        if (updatedFields.hasOwnProperty("numPrefsDone") && numPrefsDone === numUsers) {
          console.log("EXECUTING THE ALGORITHM...\n");
          /* TODO: replace with roomID */
          eventEmitter.emit(`ABCDEF.choices`, [
            { name: "Restaurant X", address: "Address X" },
            { name: "Restaurant Y", address: "Address Y" },
            { name: "Restaurant Z", address: "Address Z" },
          ]);
        } else if (updatedFields.hasOwnProperty("numPickssDone") && numPicksDone === numUsers) {
          console.log("GETTING THE FINAL PICKS...\n");
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
