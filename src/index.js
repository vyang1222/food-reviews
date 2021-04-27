import React from "react";
import ReactDOM from "react-dom";

import Home from "./pages/Home/Home.js";
import cx from "classnames";

import "./index.scss";

const App = () => {
  return (
    <>
      <div className={cx("title")}>
        <img src="/logo.png" alt="logo" className={cx("logo")} />
        crunchcrew
      </div>
      <div className={cx("slogan")}>𝐧𝐨 𝐦𝐚𝐧 𝐥𝐞𝐟𝐭 𝐛𝐞𝐡𝐢𝐧𝐝.</div>
      <div className={cx("container")}>
        <Home />
      </div>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
