import { faEye, faEyeSlash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loading from "../../Loading/Loading";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCustomerData,
  selectCustomerState,
} from "../../../redux/reducer/CustomerSlide";
import { addAuthCustomer } from "../../../redux/reducer/AuthCustomerSlide";

type CustomerLoginProps = {
  onClose: () => void;
  onLoginSuccess: () => void;
  onChangeMode: () => void;
};

function CustomerLogin({
  onClose,
  onChangeMode,
  onLoginSuccess,
}: CustomerLoginProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dispatch = useDispatch<any>();
  const { customerInfo } = useSelector(selectCustomerState);
  useEffect(() => {
    dispatch(fetchCustomerData());
  }, [dispatch]);

  const [showForm, setShowForm] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setShowForm(true);
  }, []);

  const formik = useFormik({
    initialValues: {
      id: "",
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .matches(
          /^(?=.*[A-Z])(?=.*[0-9])(?!.*[^a-zA-Z0-9])/,
          "must contain at least 1 uppercase letter, 1 number, and no special icon"
        )
        .min(4, "at least 4 characters")
        .max(50, "less than 50 characters")
        .required("required"),

      password: Yup.string()
        .min(6, "at least 6 characters")
        .max(20, "less than 20 characters")
        .required("required"),
    }),
    onSubmit: (values) => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1200);

      setTimeout(() => {
        let found = false;
        for (let i = 0; i <= customerInfo.length - 1; i++) {
          const checkAccountByIndex = customerInfo[i];
          if (formik.values.username === checkAccountByIndex.username) {
            if (formik.values.password === checkAccountByIndex.password) {
              found = true;
              const updateValue = { ...values, id: checkAccountByIndex.id };
              dispatch(addAuthCustomer(updateValue));
              window.alert(
                `${checkAccountByIndex.username} login successfully`
              );
              onLoginSuccess();
              onClose();
              return;
            } else {
              window.alert("wrong password!");
              return;
            }
          }
        }
        if (!found) {
          window.alert("wrong username!");
        }
      }, 1200);
    },
  });

  const handleChangeMode = () => {
    onChangeMode();
  };

  const handleVisiblePassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setVisiblePassword(!visiblePassword);
  };

  const handleCloseModal = () => {
    setShowForm(false);
    setTimeout(() => {
      onClose();
    }, 450);
  };

  return (
    <div className="customer-container">
      <div
        className={showForm ? "customer-pop active" : "customer-pop inActive"}
      >
        <div className="customer-title">
          <h2>LOGIN</h2>
          <FontAwesomeIcon
            className="close-icon"
            icon={faXmark}
            onClick={handleCloseModal}
          />
        </div>

        <div className="customer-body">
          <form onSubmit={formik.handleSubmit}>
            <label htmlFor="username">
              Username:{" "}
              {formik.touched.username && formik.errors.username ? (
                <div className="error">{formik.errors.username}</div>
              ) : null}
              <input
                name="username"
                type="username"
                placeholder="Enter Username..."
                onChange={formik.handleChange}
                value={formik.values.username}
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

            <p>
              Not having accounts?{" "}
              <a onClick={handleChangeMode}>Register here</a>
            </p>

            <button className="submit-btn" type="submit">
              {loading ? <Loading /> : <>Login</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CustomerLogin;
