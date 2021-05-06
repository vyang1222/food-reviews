import React from "react";
import cx from "classnames";
import { nanoid } from "nanoid";

// import { getUsers } from "../../backend/dbAPI";

import styles from "./Lobby.module.scss";
import styles2 from "../Preferences/Preferences.module.scss";

const Lobby = (props) => {
  const { users, numUsers } = props;

  return (
    <>
      <div className={cx(styles2.title)}>waiting room</div>
      <div className={cx(styles.container)}>
        <div className={cx(styles.users)}>
          {users.map((user) => (
            <div key={nanoid()} className={cx(styles.user)}>
              <img className={cx(styles.icon)} src="/cool.png" alt="" />
              {user[0]}
            </div>
          ))}
        </div>
        <div className={cx(styles.label)}>
          {users.length}/{numUsers}
        </div>
      </div>
    </>
  );
};

export default Lobby;
