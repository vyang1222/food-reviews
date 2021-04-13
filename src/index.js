import React from "react";
import ReactDOM from "react-dom";

import Home from "./pages/Home/Home.js";

import "./index.scss";

const App = () => {
  return (
    <div className="container">
      <Home />
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
