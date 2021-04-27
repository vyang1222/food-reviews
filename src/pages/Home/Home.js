import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faSignInAlt } from "@fortawesome/free-solid-svg-icons";

import { createRoom, joinRoom } from "../../backend/db/dbAPI";
import cx from "classnames";
import styles from "./Home.module.scss";

// const Home = (props) => {

//   return (
//     <div>
//       <button
//         onClick={() => {
//           createRoom(2, "UT Austin", "Victor");
//         }}
//       >
//         create room
//       </button>
//       <button
//         onClick={() => {
//           const roomID = "4R9OTX";
//           joinRoom(roomID, "Bob");
//         }}
//       >
//         join room
//       </button>
//       <button
//         onClick={() => {
//           submitPrefs("1000", "1", "", "");
//         }}
//       >
//         submit prefs
//       </button>
//       <button
//         onClick={() => {
//           getSearchResults("UT Austin", 1000, "1", "", "").then((res) => console.log(res));
//         }}
//       >
//         get results
//       </button>
//       <button
//         onClick={() => {
//           clearRooms();
//         }}
//       >
//         clear rooms
//       </button>
//     </div>
//   );
// };

const Home = (props) => {
  const [leftSel, selectLeft] = useState(true);
  const [location, setLocation] = useState(null); // [lat, long]

  const submit = () => {
    if (leftSel) {
      createRoom(
        document.getElementsByName("crewSize")[0].value,
        location ? location : document.getElementsByName("location")[0].value,
        document.getElementsByName("userName")[0].value
      );
    } else {
      joinRoom(document.getElementsByName("crewId")[0].value, document.getElementsByName("userName")[0].value);
    }
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
      <div className={cx(styles.header)}>crew id</div>
      <input className={cx(styles.input)} name="crewId" type="text" spellCheck="false" autoComplete="off" />
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
        className={cx(styles.button, { [styles.active]: location })}
        onClick={useMyLoc}
        disabled={!navigator.geolocation}
      >
        {location && location[0] !== "" ? "location found " : "use my location "}
        <FontAwesomeIcon icon={faMapMarkerAlt} />
      </button>
    </>
  );
  return (
    <>
      <div className={cx(styles.row)}>
        <div className={cx(styles.title, { [styles.titleActive]: leftSel })} onClick={() => selectLeft(true)}>
          create crew
        </div>
        <div
          className={cx(styles.title, { [styles.titleActive]: !leftSel })}
          onClick={() => {
            selectLeft(false);
          }}
        >
          join crew
        </div>
      </div>
      <div className={cx(styles.container)}>
        <div className={cx(styles.header)}>your name</div>
        <input className={cx(styles.input)} name="userName" type="text" spellCheck="false" autoComplete="none" />
        {leftSel ? createElems : joinElems}
        <button className={cx(styles.button2)} onClick={submit}>
          <FontAwesomeIcon icon={faSignInAlt} />
        </button>
      </div>
    </>
  );
};

export default Home;
