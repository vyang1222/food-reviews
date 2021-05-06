import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt as faStarHalf, faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { faStar as faEmptyStar } from "@fortawesome/free-regular-svg-icons";
import cx from "classnames";

import styles from "./Restaurant.module.scss";

const ratingMapping = [
  <FontAwesomeIcon icon={faEmptyStar} />,
  <FontAwesomeIcon icon={faStarHalf} />,
  <FontAwesomeIcon icon={faStar} />,
];

const getStars = (rating) => {
  let arr = [0, 0, 0, 0, 0];
  for (let i = 0; i < rating; i += 0.5) {
    arr[Math.floor(i)] += 1;
  }
  return arr.map((i) => ratingMapping[i]);
};

const table = (info) => (
  <table className={cx(styles.table)}>
    <tr>
      <td>Price:</td>
      <td>
        {Array.from(Array(info.price.length).keys()).map((num) => (
          <FontAwesomeIcon icon={faDollarSign} />
        ))}
      </td>
    </tr>
    <tr>
      <td>Type:</td>
      <td>{info.categories.map((category) => category.title).join()}</td>
    </tr>
    <tr>
      <td>Address:</td>
      <td>{info.location.display_address.join(" ")}</td>
    </tr>
    <tr>
      <td>Distance:</td>
      <td>{Math.round((info.distance / 1609) * 10) / 10} mi</td>
    </tr>
    <tr>
      <td>Phone #:</td>
      <td>{info.display_phone}</td>
    </tr>
  </table>
);

const back = (info) => (
  <>
    <div className={cx(styles.row2)}>
      <div className={cx(styles.rating)}>{getStars(info.rating)}</div>
      <span className={cx(styles.reviewCount)}>{info.review_count + " Yelp reviews"}</span>
    </div>
    <div className={cx(styles.subcontainer)}>{table(info)}</div>
  </>
);

const Restaurant = (props) => {
  const { isResults, info } = props;
  const [flipped, flip] = useState(false);

  useEffect(() => {
    flip(false);
  }, [info]);

  return (
    <div className={cx(styles.container, { [styles.results]: isResults })} onClick={() => flip(!flipped)}>
      <div className={cx(styles.row)}>
        <span className={cx(styles.name)}>{info.name}</span>
      </div>
      {flipped ? back(info) : <img className={cx(styles.image)} src={info.image_url} alt="" />}
    </div>
  );
};

export default Restaurant;
