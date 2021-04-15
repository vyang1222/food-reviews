import React from "react";

import { createRoom, joinRoom, clearRooms } from "../../backend/db/dbAPI";
import { getSearchResults } from "../../backend/YelpAPI";
import "./Home.module.scss";

const Home = (props) => {
  return (
    <div>
      <button
        onClick={() => {
          createRoom(6, "UT Austin", "Victor");
        }}
      >
        create room
      </button>
      <button
        onClick={() => {
          const roomID = "H6YEQC";
          joinRoom(roomID, "Bob");
        }}
      >
        join room
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
