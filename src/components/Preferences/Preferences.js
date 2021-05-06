import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import cx from "classnames";
import { nanoid } from "nanoid";

import { submitPrefs } from "../../backend/dbAPI";
import { prices, cuisines, accomodations } from "../../utilities/misc";

import styles from "./Preferences.module.scss";
import styles2 from "../../pages/Home/Home.module.scss";

const submit = async () => {
  const categories = [...document.getElementsByName("categories")[0].options]
    .filter((option) => option.selected)
    .map((option) => option.value);
  const attributes = [...document.getElementsByName("attributes")[0].options]
    .filter((option) => option.selected)
    .map((option) => accomodations[option.value][1]);

  await submitPrefs(
    parseInt(document.getElementsByName("radius")[0].value),
    document.getElementsByName("price")[0].value,
    categories,
    attributes
  );
};

const Preferences = (props) => {
  const { setStage } = props;

  return (
    <>
      <div className={cx(styles.title)}>select preferences</div>
      <div className={cx(styles.container)}>
        <div className={cx(styles.header)}>
          distance (in miles): <span className={cx(styles.label)}>20</span>
        </div>
        <input
          className={cx(styles.input, styles.slider)}
          name="radius"
          type="range"
          min="0"
          max="20"
          step="0.5"
          onInput={() => {
            document.getElementsByClassName(styles.label)[0].innerHTML = document.getElementsByName("radius")[0].value;
          }}
        />
        <div className={cx(styles.header)}>
          price: <span className={cx(styles.label)}>{prices[prices.length - 1]}</span>
        </div>
        <input
          className={cx(styles.input, styles.slider)}
          name="price"
          type="range"
          min="1"
          max="4"
          step="1"
          onInput={() => {
            document.getElementsByClassName(styles.label)[1].innerHTML =
              prices[document.getElementsByName("price")[0].value];
          }}
        />
        <div className={cx(styles.header)}>cuisine(s)</div>
        <select className={cx(styles.options)} name="categories" multiple>
          {cuisines.map((cuisine) => (
            <option key={nanoid()} value={cuisine[1]}>
              {cuisine[0]}
            </option>
          ))}
        </select>
        <div className={cx(styles.header)}>accomodation(s)</div>
        <select className={cx(styles.options)} name="attributes" multiple>
          {/* value = index because the array is a mix of categories and attributes */}
          {accomodations.map((accomodation, i) => (
            <option key={nanoid()} value={i}>
              {accomodation[0]}
            </option>
          ))}
        </select>
        <button
          className={cx(styles2.button2)}
          onClick={async () => {
            await submit();
            setStage(2);
          }}
        >
          <FontAwesomeIcon icon={faSignInAlt} />
        </button>
      </div>
    </>
  );
};

export default Preferences;
