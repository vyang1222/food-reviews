import React, { useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch, useHistory } from "react-router-dom";
import cx from "classnames";

import Home from "./pages/Home/Home";
import Room from "./pages/Room/Room";
import ProgressBar from "./components/ProgressBar/ProgressBar";

import "./index.scss";

const App = () => {
  const history = useHistory();
  const [stage, setStage] = useState(0);

  return (
    <>
      <div className={cx("container")}>
        <Switch>
          <Route path="/room/:id">
            <Room history={history} stage={stage} setStage={setStage} />
          </Route>
          <Route path="/">
            <Home history={history} setStage={setStage} />
          </Route>
        </Switch>
      </div>
      <ProgressBar stage={stage} />
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
