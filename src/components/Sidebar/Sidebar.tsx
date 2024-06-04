/* eslint-disable @typescript-eslint/no-explicit-any */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./sidebar.scss";
import { NavLink, useRouteMatch } from "react-router-dom";
import {
  faCartShopping,
  faHouse,
  faRightFromBracket,
  faTableList,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { selectAuthAccountState } from "../../redux/reducer/AuthAccountSlides";
import { useState } from "react";
import { selectAccountState } from "../../redux/reducer/AccountsSlide";
import { createPortal } from "react-dom";
import ConfirmLogout from "../PopUp/Confirm/ConfirmLogout";

function Sidebar() {
  const { url } = useRouteMatch();
  const { currentAccount } = useSelector(selectAuthAccountState);
  const { adminAccounts } = useSelector(selectAccountState);

  const matchAccount = adminAccounts.find(
    (account) => account.email === currentAccount.email
  );

  const [confirmLogout, setConfirmLogout] = useState(false);
  const handleConfirmLogout = () => {
    setConfirmLogout(true);
  };

  const handleCancle = () => {
    setConfirmLogout(false);
  };

  const styleNav = {
    backgroundColor: "#7631fe",
    color: "#fff",
  };

  return (
    <>
      <div className="sidebar">
        <div className="admin">
          <p>
            Welcome back!
            <span>{matchAccount ? matchAccount.fullname : ""}</span>
          </p>
          <img src="https://i.imgur.com/diCbLpf.jpeg" alt="default ava" />
        </div>

        <div className="for-admin">
          <h3>Admin Dashboard</h3>
          <ul>
            <li>
              <NavLink exact to="/" activeStyle={styleNav}>
                <FontAwesomeIcon icon={faHouse} />
                Back to Shop
              </NavLink>
            </li>
            <li>
              <NavLink exact to={`${url}`} activeStyle={styleNav}>
                <FontAwesomeIcon icon={faTableList} />
                Product List
              </NavLink>
            </li>
            <li>
              <NavLink exact to={`${url}/accounts`} activeStyle={styleNav}>
                <FontAwesomeIcon icon={faUsers} />
                admin account
              </NavLink>
            </li>
            <li>
              <NavLink exact to={`${url}/orders`} activeStyle={styleNav}>
                <FontAwesomeIcon icon={faCartShopping} />
                Manage orders
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="logout">
          <button onClick={handleConfirmLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} />
          </button>
        </div>
      </div>

      {confirmLogout &&
        createPortal(
          <ConfirmLogout
            onCancle={handleCancle}
            mode="admin"
            onLogoutSuccess={() => {}}
          />,
          document.body
        )}
    </>
  );
}

export default Sidebar;
