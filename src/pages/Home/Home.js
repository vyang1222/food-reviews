import React, { useEffect } from "react";

import { getSearchResults } from "../../api";
import "./Home.module.scss";

const Home = (props) => {
  useEffect(() => {
    // getSearchResults("UT Austin", 1000, "1", "", "").then((res) => console.log(res));
  }, []);
  return <div>Hello Team!</div>;
};

export default Home;
