import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import cx from "classnames";

import { createRoom, joinRoom } from "../../backend/dbAPI";
// import { clearRooms } from "../../backend/dbAPI";
// import { getSearchResults } from "../../backend/YelpAPI";

import styles from "./Home.module.scss";

const Home = (props) => {
  const { setStage } = props;
  // clearRooms();

  const { history } = props;

  const [leftSel, selectLeft] = useState(true);
  const [location, setLocation] = useState(null); // [lat, long]

  const submit = async () => {
    if (leftSel) {
      await createRoom(
        document.getElementsByName("crewSize")[0].value,
        location ? location : document.getElementsByName("location")[0].value,
        document.getElementsByName("userName")[0].value
      );
    } else {
      await joinRoom(document.getElementsByName("roomID")[0].value, document.getElementsByName("userName")[0].value);
    }
    history.push("/room/" + sessionStorage.getItem("roomID"));
    setStage(1);
  };

  const useMyLoc = () => {
    document.getElementsByName("location")[0].value = "";
    setLocation(["", ""]); // pending
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setLocation([latitude, longitude]);
    });
  };

  const joinElems = (
    <>
      <div className={cx(styles.header)}>room id</div>
      <input className={cx(styles.input)} name="roomID" type="text" spellCheck="false" autoComplete="none" />
    </>
  );

  const createElems = (
    <>
      <div className={cx(styles.header)}>size of crew</div>
      <input className={cx(styles.input)} name="crewSize" type="number" min="1" max="100" />
      <div className={cx(styles.header)}>location</div>
      <input
        className={cx(styles.input)}
        name="location"
        type="text"
        spellCheck="false"
        autoComplete="none"
        disabled={location}
      />
      <div className={cx(styles.header2)}>or</div>
      <button
        className={cx(styles.button, { [styles.pending]: location, [styles.active]: location && location[0] !== "" })}
        onClick={useMyLoc}
        disabled={!navigator.geolocation}
      >
        {location && location[0] !== "" ? "location found " : location ? "finding location " : "use my location "}
        <FontAwesomeIcon icon={faMapMarkerAlt} />
      </button>
    </>
  );
  return (
    <>
      <div className={cx(styles.title)}>
        <img className={styles.logo} src="/logo.png" alt="logo" />
        crunchcrew
      </div>
      <div className={styles.slogan}>no (wo)man left behind.</div>
      <div className={cx(styles.row)}>
        <div className={cx(styles.subtitle, { [styles.subtitleActive]: leftSel })} onClick={() => selectLeft(true)}>
          create crew
        </div>
        <div
          className={cx(styles.subtitle, { [styles.subtitleActive]: !leftSel })}
          onClick={() => {
            selectLeft(false);
          }}
        >
          join crew
        </div>
      </div>
      <div className={cx(styles.container)}>
        <div className={cx(styles.header)}>your name</div>
        <input className={cx(styles.input)} name="userName" type="text" spellCheck="false" autoComplete="off" />
        {leftSel ? createElems : joinElems}
        <button className={cx(styles.button2)} onClick={submit}>
          <FontAwesomeIcon icon={faSignInAlt} />
        </button>
      </div>
    </>
  );
};

export default Home;
