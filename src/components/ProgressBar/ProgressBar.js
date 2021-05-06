import React, { useEffect } from "react";
import cx from "classnames";
import { nanoid } from "nanoid";

import styles from "./ProgressBar.module.scss";

const progress = (num) => {
  if (num < 4) {
    for (let i = num - 1; i >= 0; --i) {
      document.getElementById(`step${i}`).classList.add(styles.completed);
    }
    for (let i = Math.min(num, 3); i >= 0; --i) {
      document.getElementById(`step${i}`).classList.add(styles.selected);
    }
    document.getElementsByClassName(styles.percent)[0].style.width = `${30 * num}%`;
  }
};

const ProgressBar = (props) => {
  const { stage } = props;

  useEffect(() => {
    progress(stage);
  }, [stage]);

  return (
    <div className={cx(styles.container)}>
      <div className={cx(styles.progress)}>
        <div className={cx(styles.percent)}></div>
      </div>
      <div className={cx(styles.steps)}>
        {Array.from(Array(4).keys()).map((num) => (
          <div key={nanoid()} id={`step${num}`} className={cx(styles.step)}></div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
