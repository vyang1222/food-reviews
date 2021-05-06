import React, { useState, useRef, useEffect } from "react";
import cx from "classnames";
import Preferences from "../../components/Preferences/Preferences";
import Lobby from "../../components/Lobby/Lobby";
import Restaurants from "../../components/Restaurants/Restaurants";
import Results from "../../components/Results/Results";
import { getUsers } from "../../backend/dbAPI";

import styles from "./Room.module.scss";
import { winner } from "../../utilities/misc";

const Room = (props) => {
  const { stage, setStage } = props;
  const roomID = useRef(sessionStorage.getItem("roomID"));
  const numUsers = useRef(0);

  const [users, setUsers] = useState([]);
  const [rests, setRests] = useState([]);

  const stages = [
    "",
    <Preferences setStage={setStage} />,
    <Lobby users={users} numUsers={numUsers.current} />,
    <Restaurants setStage={setStage} choices={rests} />,
    <Lobby users={users} numUsers={numUsers.current} />,
    <Results result={rests[0]} />,
  ];

  useEffect(() => {
    async function setUp() {
      const data = await getUsers();
      setUsers(data[0]);
      numUsers.current = data[1];
      const eventSource = new EventSource(`/${sessionStorage.getItem("roomID")}/listen`);
      eventSource.addEventListener("newUser", (e) => {
        setUsers((users) => [...users, [e.data, 0]]);
      });
      eventSource.addEventListener("choices", (e) => {
        setRests(JSON.parse(e.data));
        setStage(3);
      });
      eventSource.addEventListener("results", (e) => {
        setRests(JSON.parse(e.data));
        setStage(5);
      });
    }
    setUp();
  }, [setStage]);

  return (
    <>
      {stages[stage]}
      <div className={cx(styles.idArea)}>
        room id:
        <div className={cx(styles.id)}>{roomID.current}</div>
      </div>
    </>
  );
};

export default Room;
