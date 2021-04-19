import React from "react";

import { createRoom, joinRoom, submitPrefs, clearRooms, getRestaurants } from "../../backend/db/dbAPI";
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
          const roomID = "V9T7QO";
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
          getRestaurants();
        }}
      >
        get restaurants
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
