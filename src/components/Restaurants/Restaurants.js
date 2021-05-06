import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt as faTrash, faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeart2, faTrashAlt as faTrash2 } from "@fortawesome/free-regular-svg-icons";
import cx from "classnames";
import Restaurant from "../Restaurant/Restaurant";
import { submitPicks } from "../../backend/dbAPI";
import styles from "./Restaurants.module.scss";
import styles2 from "../Preferences/Preferences.module.scss";

const Restaurants = (props) => {
  const { setStage, choices } = props;
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState([]);

  const trySubmit = async () => {
    if (index === choices.length - 1) {
      await submitPicks(picks);
      setStage(4);
    } else {
      setIndex(index + 1);
    }
  };

  return (
    <>
      <div className={cx(styles2.title)}>select restaurants</div>
      <div className={cx(styles.container)}>
        <div
          className={cx(styles.heartContainer)}
          onClick={async () => {
            setPicks([...picks, choices[index].id]);
            await trySubmit();
          }}
        >
          <FontAwesomeIcon icon={faHeart2} className={cx(styles.icon, styles.heart2)} />
          <FontAwesomeIcon icon={faHeart} className={cx(styles.icon, styles.heart)} />
        </div>
        <Restaurant isResults={false} info={choices[index]} />
        <div
          className={cx(styles.trashContainer)}
          onClick={async () => {
            await trySubmit();
          }}
        >
          <FontAwesomeIcon icon={faTrash2} className={cx(styles.icon, styles.trash2)} />
          <FontAwesomeIcon icon={faTrash} className={cx(styles.icon, styles.trash)} />
        </div>
      </div>
    </>
  );
};

export default Restaurants;
