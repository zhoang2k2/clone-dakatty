import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./login-signup.scss";
import { useEffect, useState } from "react";
import { faEye, faEyeSlash, faXmark } from "@fortawesome/free-solid-svg-icons";
import type { AccountAuth, AccountType } from "../../../types/AccountType";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAccounts,
  selectAccountState,
} from "../../../redux/reducer/AccountsSlide";
import { addAuthAccount } from "../../../redux/reducer/AuthAccountSlides";
import { useFormik } from "formik";
import * as Yup from "yup";
import Loading from "../../Loading/Loading";

type LoginProps = {
  onCloseModal: () => void;
  onChangeMode: () => void;
  authChecked: () => void;
  mode: "login" | "auth";
  extraMode: "on-admin" | "off-admin";
  matchAccount?: AccountAuth;
};

function Login({
  onCloseModal,
  onChangeMode,
  authChecked,
  mode,
  extraMode,
  matchAccount,
}: LoginProps) {
  // ==========================LOGIN PART==========================
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dispatch = useDispatch<any>();
  const { adminAccounts } = useSelector(selectAccountState);

  const [accountList, setAccountList] = useState<Array<AccountType>>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState(false);

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  useEffect(() => {
    if (adminAccounts && adminAccounts.length > 0) {
      setAccountList(adminAccounts);
    }
  }, [adminAccounts]);

  const checkAuthorization = () => {
    if (
      matchAccount?.email === formik.values.email &&
      matchAccount.password === formik.values.password
    ) {
      authChecked();
      onCloseModal();
    } else {
      window.alert("Wrong email or password!");
    }
  };

  const checkAccountLogin = () => {
    let found = false;
    for (let i = 0; i <= accountList.length - 1; i++) {
      const checkAccountByIndex = accountList[i];
      if (formik.values.email === checkAccountByIndex.email) {
        if (formik.values.password === checkAccountByIndex.password) {
          found = true;
          onCloseModal();
          authChecked();
          const updateValues = {
            ...formik.values,
            id: checkAccountByIndex.id ?? "",
          };
          dispatch(addAuthAccount(updateValues));
          window.alert(`${checkAccountByIndex.email} login successfully`);
          return;
        } else {
          window.alert("wrong password!");
          return;
        }
      }
    }
    if (!found) {
      window.alert("wrong email!");
    }
  };

  // =========================COMMON=========================
  const handleMode = () => {
    onChangeMode();
  };

  useEffect(() => {
    setShowForm(true);
  }, []);

  // =======================VALIDATE=======================

  const formik = useFormik({
    initialValues: {
      id: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .min(2, "at least 2 characters")
        .max(50, "less than 50 characters")
        .required("required"),

      password: Yup.string()
        .min(6, "at least 6 characters")
        .max(20, "less than 20 characters")
        .required("required"),
    }),
    onSubmit: () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1200);

      setTimeout(() => {
        if (mode === "login") {
          checkAccountLogin();
        } else {
          checkAuthorization();
        }
      }, 1200);
    },
  });

  const handleVisiblePassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setVisiblePassword(!visiblePassword);
  };

  const handleCloseModal = () => {
    setShowForm(false);
    setTimeout(() => {
      onCloseModal();
    }, 450);
  };

  return (
    <div className="form-container">
      <form
        className={showForm ? "login-form active" : "login-form inActive"}
        onSubmit={formik.handleSubmit}
      >
        <FontAwesomeIcon
          className="close-icon"
          icon={faXmark}
          onClick={handleCloseModal}
        />
        <h2>Login</h2>
        <div className="form-content">
          <label htmlFor="email">
            Email:{" "}
            {formik.touched.email && formik.errors.email ? (
              <div className="error">{formik.errors.email}</div>
            ) : null}
            <input
              name="email"
              type="email"
              placeholder="Enter Email"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
          </label>

          <label htmlFor="password">
            Password:{" "}
            {formik.touched.password && formik.errors.password ? (
              <div className="error">{formik.errors.password}</div>
            ) : null}
            <input
              name="password"
              type={visiblePassword ? "text" : "password"}
              placeholder="Enter Password"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <button onClick={handleVisiblePassword}>
              {visiblePassword ? (
                <FontAwesomeIcon icon={faEyeSlash} />
              ) : (
                <FontAwesomeIcon icon={faEye} />
              )}
            </button>
          </label>
        </div>

        {mode === "login" && extraMode === "off-admin" && (
          <p>
            Not having accounts? <a onClick={handleMode}>Register here</a>
          </p>
        )}
        {mode === "auth" && extraMode === "off-admin" && (
          <p>
            For got password? <a>Click here</a>
          </p>
        )}
        <div className="form-btns">
          <button className="login-btn" type="submit">
            {loading ? <Loading /> : <>Login</>}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
