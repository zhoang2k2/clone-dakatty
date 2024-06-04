import "./navbar.scss";

import {
  faArrowRightFromBracket,
  faBars,
  faCartShopping,
  faGears,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useHistory } from "react-router-dom";
import Login from "../PopUp/LoginSignup/Login";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAuthAccount,
  selectAuthAccountState,
} from "../../redux/reducer/AuthAccountSlides";

import CustomerInfo from "../PopUp/Customer/CustomerInfo";
import CustomerLogin from "../PopUp/Customer/CustomerLogin";
import {
  fetchAuthCustomer,
  selectAuthCustomerState,
} from "../../redux/reducer/AuthCustomerSlide";
import ConfirmLogout from "../PopUp/Confirm/ConfirmLogout";
import SignUp from "../PopUp/LoginSignup/Signup";
import CartPop from "../PopUp/Cart/Cart";
import { fetchProductInCart } from "../../redux/reducer/CartSlide";
import { selectCustomerState } from "../../redux/reducer/CustomerSlide";

function Navbar() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dispatch = useDispatch<any>();
  const { currentAccount } = useSelector(selectAuthAccountState);
  const { currentCustomerAccount } = useSelector(selectAuthCustomerState);
  const { customerInfo } = useSelector(selectCustomerState);

  const history = useHistory();

  const [modal, setModal] = useState({
    login: false,
    signup: false,
  });
  const [customerModal, setCustomerModal] = useState({
    register: false,
    login: false,
    confirm: false,
  });
  const [customerStatus, setCustomerStatus] = useState(false);
  const [cartModal, setCartModal] = useState(false);
  const [countProductsInCart, setCountProductsInCart] = useState(0);
  const [cartStatus, setCartStatus] = useState(false);
  const [iconAfterLogin, setIconAfterLogin] = useState(false);

  const handleFirstLogin = () => {
    if (currentAccount.email === "" || currentAccount.password === "") {
      setModal({ ...modal, login: true });
    } else {
      history.push("/admin");
    }
  };

  const handleCloseLogin = () => {
    setModal({ ...modal, login: false });
  };
  const handleCloseSignup = () => {
    setModal({ ...modal, signup: false });
  };

  const handleSwitchToLogin = () => {
    setModal({ ...modal, signup: false, login: true });
  };
  const handleSwitchToSingup = () => {
    setModal({ ...modal, signup: true, login: false });
  };
  const handleRegisterSuccess = () => {
    setTimeout(() => {
      setModal({ ...modal, signup: false, login: true });
    }, 250);
  };

  const handleForAdmin = () => {
    handleCloseLogin();
    history.push("/admin");
  };

  useEffect(() => {
    dispatch(fetchAuthAccount());
  }, [dispatch]);

  useEffect(() => {
    if (currentAccount.email !== "" && currentAccount.password !== "") {
      setIconAfterLogin(true);
    } else {
      setIconAfterLogin(false);
    }
  }, [currentAccount]);

  // ============================ADDING TO CART============================
  const handleCustomerLogin = () => {
    setCustomerModal({ ...customerModal, login: true });
  };
  const handleCloseCustomerRegister = () => {
    setCustomerModal({ ...customerModal, register: false });
  };
  const handleCloseCustomerLogin = () => {
    setCustomerModal({ ...customerModal, login: false });
  };

  const handleCustomerSwitchToLogin = () => {
    setCustomerModal({ ...customerModal, register: false, login: true });
  };
  const handleCustomerSwitchToRegister = () => {
    setCustomerModal({ ...customerModal, register: true, login: false });
  };

  const handleLogoutConfirm = () => {
    setCustomerModal({ ...customerModal, confirm: true });
  };
  const handleCancleLogout = () => {
    setCustomerModal({ ...customerModal, confirm: false });
  };

  useEffect(() => {
    dispatch(fetchAuthCustomer());
  }, [dispatch, customerStatus]);

  useEffect(() => {
    if (
      currentCustomerAccount.username !== "" &&
      currentCustomerAccount.password !== ""
    ) {
      setCustomerStatus(true);
    } else {
      setCustomerStatus(false);
    }
  }, [currentCustomerAccount]);

  // HANDLING CART
  const handleOpenCart = () => {
    currentCustomerAccount.username !== "" &&
    currentCustomerAccount.password !== ""
      ? setCartModal(true)
      : handleCustomerLogin();
  };

  const handleCloseCart = () => {
    setCartModal(false);
  };

  const handleLogoutSuccess = () => {
    setCartStatus(false);
    setCustomerStatus(false);
    setCartModal(false);
  };

  useEffect(() => {
    if (currentCustomerAccount.id) {
      dispatch(fetchProductInCart(currentCustomerAccount.id));
    }
  }, [dispatch, currentCustomerAccount]);

  useEffect(() => {
    if (customerInfo.length > 0 && currentCustomerAccount.id) {
      const index = customerInfo.findIndex(
        (customer) => customer.id === currentCustomerAccount.id
      );
      if (index !== -1) {
        const lengthProductsInCart = customerInfo[index].products.length;
        setCountProductsInCart(lengthProductsInCart);
      } else {
        console.error("not found");
      }
    }
  }, [customerInfo, currentCustomerAccount.id]);

  useEffect(() => {
    if (countProductsInCart > 0) {
      setCartStatus(true);
    }
  }, [countProductsInCart]);

  const [showNavMenu, setShowNavMenu] = useState(false);
  const handleOpenNavMenu = () => {
    setShowNavMenu(!showNavMenu);
  };

  return (
    <>
      <div className="navbar-container">
        <nav>
          <div className="navbar-items">
            <div className="nav-link">
              <NavLink exact to={"/"} className="logo">
                DA KATTY
              </NavLink>
              <NavLink exact to={"/shop"}>
                Shop
              </NavLink>
              <Link to="/">About</Link>
            </div>

            <div className="nav-buttons">
              <button className="cart-btn" onClick={handleOpenCart}>
                <FontAwesomeIcon icon={faCartShopping} />
                {cartStatus ? <span>{countProductsInCart}</span> : ""}
              </button>
              <button className="admin-btn" onClick={handleFirstLogin}>
                {iconAfterLogin ? (
                  <FontAwesomeIcon icon={faGears} />
                ) : (
                  <FontAwesomeIcon icon={faUserShield} />
                )}
              </button>
              {customerStatus ? (
                <div className="customer-after-login">
                  <span>{currentCustomerAccount.username}</span>
                  <button onClick={handleLogoutConfirm}>
                    <FontAwesomeIcon icon={faArrowRightFromBracket} />
                  </button>
                </div>
              ) : (
                <button
                  className="customer-before-login"
                  onClick={handleCustomerLogin}
                >
                  Login
                </button>
              )}
            </div>

            <div className="nav-buttons-mobile" onClick={handleOpenNavMenu}>
              <FontAwesomeIcon icon={faBars} />
              {showNavMenu && (
                <div className="nav-menu">
                  <button className="cart-btn" onClick={handleOpenCart}>
                    <FontAwesomeIcon icon={faCartShopping} />
                    {cartStatus ? <span>{countProductsInCart}</span> : ""}
                  </button>
                  <button className="admin-btn" onClick={handleFirstLogin}>
                    {iconAfterLogin ? (
                      <FontAwesomeIcon icon={faGears} />
                    ) : (
                      <FontAwesomeIcon icon={faUserShield} />
                    )}
                  </button>
                  {customerStatus ? (
                    <div className="customer-after-login">
                      <span>{currentCustomerAccount.username}</span>
                      <button onClick={handleLogoutConfirm}>
                        <FontAwesomeIcon icon={faArrowRightFromBracket} />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="customer-before-login"
                      onClick={handleCustomerLogin}
                    >
                      Login
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>

      {modal.login &&
        createPortal(
          <Login
            mode="login"
            extraMode="off-admin"
            onCloseModal={handleCloseLogin}
            onChangeMode={handleSwitchToSingup}
            authChecked={handleForAdmin}
          />,
          document.body
        )}

      {modal.signup &&
        createPortal(
          <SignUp
            mode="off-admin"
            onChangeMode={handleSwitchToLogin}
            onSubmitSuccess={handleRegisterSuccess}
            onCloseModal={handleCloseSignup}
          />,
          document.body
        )}

      {customerModal.register &&
        createPortal(
          <CustomerInfo
            onClose={handleCloseCustomerRegister}
            onChangeMode={handleCustomerSwitchToLogin}
            onCustomerRegisterSuccess={handleCustomerSwitchToLogin}
          />,
          document.body
        )}

      {customerModal.login &&
        createPortal(
          <CustomerLogin
            onClose={handleCloseCustomerLogin}
            onChangeMode={handleCustomerSwitchToRegister}
            onLoginSuccess={() => setCustomerStatus(true)}
          />,
          document.body
        )}

      {customerModal.confirm &&
        createPortal(
          <ConfirmLogout
            onCancle={handleCancleLogout}
            onLogoutSuccess={handleLogoutSuccess}
            mode="customer"
          />,
          document.body
        )}

      {cartModal &&
        createPortal(<CartPop onClose={handleCloseCart} />, document.body)}
    </>
  );
}

export default Navbar;
