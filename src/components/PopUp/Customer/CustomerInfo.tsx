import "./customer.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import Loading from "../../Loading/Loading";
import { useDispatch, useSelector } from "react-redux";
import {
  addCustomerData,
  fetchCustomerData,
  selectCustomerState,
  type CustomerInfo,
} from "../../../redux/reducer/CustomerSlide";
import { createPortal } from "react-dom";
import ConfirmClose from "../Confirm/ConfirmClose";

type CustomerAccountProps = {
  onClose: () => void;
  onCustomerRegisterSuccess: () => void;
  onChangeMode: () => void;
};

function CustomerAccount({
  onClose,
  onChangeMode,
  onCustomerRegisterSuccess,
}: CustomerAccountProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dispatch = useDispatch<any>();
  const { customerInfo } = useSelector(selectCustomerState);
  useEffect(() => {
    dispatch(fetchCustomerData());
  }, [dispatch]);

  const [customerAccount, setCustomerAccount] = useState<string[]>([]);
  const [confirmCloseModal, setConfirmCloseModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState(false);
  
  useEffect(() => {
    const usernames = customerInfo.map((account) => account.username);
    setCustomerAccount(usernames);
  }, [customerInfo]);

  const handleVisiblePassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setVisiblePassword(!visiblePassword);
  };

  const handleConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue("confirm", e.target.value);
  };


  const formik = useFormik({
    initialValues: {
      id: "",
      username: "",
      password: "",
      confirm: "",
      products: [],
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .matches(
          /^(?=.*[A-Z])(?=.*[0-9])(?!.*[^a-zA-Z0-9])/,
          "must contain 1 uppercase, 1 number, and without special icon"
        )
        .min(4, "at least 4 characters")
        .max(50, "less than 50 characters")
        .required("required"),

      password: Yup.string()
        .matches(
          /^(?=.*[A-Z])(?=.*[0-9])/,
          "must contain at least 1 uppercase letter and 1 number"
        )
        .min(6, "at least 6 characters")
        .max(20, "less than 20 characters")
        .required("required"),

      confirm: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Please confirm related to your password"),
    }),
    onSubmit: (values) => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 2400);

      const isExisted = customerAccount.includes(values.username);
      if (isExisted) {
        setLoading(false);
        window.alert("This user has already been used!");
        return;
      } else {
        setTimeout(() => {
          const randomID = Math.floor(Math.random() * 10000);
          const { confirm, ...userData } = values;
          console.log(confirm);
          const updatedVal: CustomerInfo = {
            ...userData,
            id: randomID.toString(),
          };
          dispatch(addCustomerData(updatedVal));
          onClose();
          alert("Register Successfully");
          onCustomerRegisterSuccess();
        }, 2400);
      }
    },
  });

  const handleChangeMode = () => {
    onChangeMode();
  };

  useEffect(() => {
    setShowForm(true);
  }, []);

  const handleCloseModal = () => {
    if (formik.values.username !== "" || formik.values.password !== "") {
      setConfirmCloseModal(true);
    } else {
      handleConfirmClose();
    }
  };

  const handleCancleCloseConfirm = () => {
    setConfirmCloseModal(false);
  };

  const handleConfirmClose = () => {
    setShowForm(false);
    setTimeout(() => {
      onClose();
    }, 450);
  };

  return (
    <>
      <div className="customer-container">
        <div
          className={showForm ? "customer-pop active" : "customer-pop inActive"}
        >
          <div className="customer-title">
            <h2>CUSTOMER INFORMATION</h2>
            <FontAwesomeIcon icon={faXmark} onClick={handleCloseModal} />
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
                  type="text"
                  placeholder="Enter your username..."
                  value={formik.values.username}
                  onChange={formik.handleChange}
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
                  placeholder="Enter your password..."
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
                <button onClick={handleVisiblePassword}>
                  {visiblePassword ? (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  ) : (
                    <FontAwesomeIcon icon={faEye} />
                  )}
                </button>
              </label>

              <label htmlFor="confirm">
                Confirm:
                <input
                  name="confirm"
                  type="password"
                  placeholder="Confirm password..."
                  value={formik.values.confirm}
                  onChange={handleConfirm}
                />
                {formik.touched.confirm && formik.errors.confirm ? (
                  <div className="error">{formik.errors.confirm}</div>
                ) : null}
              </label>

              <p>
                Already have account?{" "}
                <a onClick={handleChangeMode}>login here</a>
              </p>

              <button type="submit" className="submit-btn">
                {loading ? <Loading /> : <>Register</>}
              </button>
            </form>
          </div>
        </div>
      </div>
      {confirmCloseModal &&
        createPortal(
          <ConfirmClose
            onCancle={handleCancleCloseConfirm}
            onConfirm={handleConfirmClose}
          />,
          document.body
        )}
    </>
  );
}

export default CustomerAccount;
