import React, { useEffect } from "react";

import { createRoom, joinRoom, submitPrefs, clearRooms } from "../../backend/db/dbAPI";
import { getSearchResults } from "../../backend/YelpAPI";
import "./Home.module.scss";

const Home = (props) => {
  useEffect(() => {
    /* TODO: CHANGE TO ACTUAL ROOM ID */
    const eventSource = new EventSource("/ABCDEF/listen");
    eventSource.onmessage = (e) => {
      console.log(e);
    };
  }, []);

  return (
    <div>
      <button
        onClick={() => {
          createRoom(2, "UT Austin", "Victor");
        }}
      >
        create room
      </button>
      <button
        onClick={() => {
          const roomID = "4R9OTX";
          joinRoom(roomID, "Bob");
        }}
      >
        join room
      </button>
      <button
        onClick={() => {
          submitPrefs("1000", "1", "", "");
        }}
      >
        submit prefs
      </button>
      <button
        onClick={() => {
          getSearchResults("UT Austin", 1000, "1", "", "").then((res) => console.log(res));
        }}
      >
        get results
      </button>
      <button
        onClick={() => {
          clearRooms();
        }}
      >
        clear rooms
      </button>
    </div>
  );
};

export default Home;
