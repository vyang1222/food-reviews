import React from "react";
import cx from "classnames";
import Restaurant from "../Restaurant/Restaurant";
import styles from "./Results.module.scss";
import styles2 from "../../pages/Home/Home.module.scss";

const Results = (props) => {
  const { result } = props;
  return (
    <>
      <div className={cx(styles2.title)}>
        <img className={styles2.logo} src="/logo2.png" alt="logo" />
        results
      </div>
      <Restaurant isResults={true} info={result} />
    </>
  );
};

export default Results;
