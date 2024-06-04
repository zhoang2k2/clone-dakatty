import "./login-signup.scss";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightLong,
  faEye,
  faEyeSlash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  addAccount,
  fetchAccounts,
  selectAccountState,
} from "../../../redux/reducer/AccountsSlide";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import Loading from "../../Loading/Loading";

type SignupProps = {
  mode: "on-admin" | "off-admin";
  onCloseModal: () => void;
  onChangeMode: () => void;
  onSubmitSuccess: () => void;
};

function SignUp({
  mode,
  onCloseModal,
  onChangeMode,
  onSubmitSuccess,
}: SignupProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dispatch = useDispatch<any>();
  const { adminAccounts } = useSelector(selectAccountState);
  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  const [adminEmails, setAdminEmails] = useState<string[]>([]);
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [signupStages, setSignupStages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emails = adminAccounts.map((account) => account.email);
    setAdminEmails(emails);
  }, [adminAccounts]);

  // HANDLING CONFIRM PASSWORD
  const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue("confirmPassword", e.target.value);
  };

  const handleMode = () => {
    onChangeMode();
  };

  const handleVisiblePassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setVisiblePassword(!visiblePassword);
  };

  const handleNextStage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSignupStages(signupStages + 1);
  };
  const handlePrevStage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    signupStages === 1 ? setSignupStages(1) : setSignupStages(signupStages - 1);
  };

  useEffect(() => {
    setShowForm(true);
  }, []);

  //====================== VALIDATION======================

  const formik = useFormik({
    initialValues: {
      fullname: "",
      email: "",
      gender: "",
      password: "",
      confirmPassword: "",
      phone: "",
      birthday: "",
      address: "",
    },
    validationSchema: Yup.object({
      fullname: Yup.string()
        .min(2, "at least 2 characters")
        .max(50, "less than 50 characters")
        .required("required"),

      email: Yup.string()
        .email("Invalid email address")
        .min(2, "at least 2 characters")
        .max(50, "less than 50 characters")
        .required("required"),

      gender: Yup.string().required("Required"),

      password: Yup.string()
        .matches(
          /^(?=.*[A-Z])(?=.*[0-9])/,
          "must contain at least 1 uppercase letter and 1 number"
        )
        .min(6, "at least 6 characters")
        .max(20, "less than 20 characters")
        .required("required"),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Please confirm related to your password"),

      phone: Yup.string()
        .min(10, "at least 10 characters")
        .max(12, "less than 12 characters")
        .required("required"),

      birthday: Yup.date().required("Required"),

      address: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 2400);

      const isExisted = adminEmails.includes(values.email);
      if (isExisted) {
        setLoading(false);
        window.alert("This email has already been used!");
        setSignupStages(1);
        return;
      } else {
        setTimeout(() => {
          const randomID = Math.floor(Math.random() * 10000);
          const updatedVal = { ...values, id: randomID.toString() };
          dispatch(addAccount(updatedVal));
          alert("Register Successfully");
          onSubmitSuccess();
          onCloseModal();
        }, 2400);
      }
    },
  });

  const handleCloseModal = () => {
    setShowForm(false);
    setTimeout(() => {
      onCloseModal();
    }, 450);
  };

  return (
    <div className="form-container">
      <form
        className={showForm ? "active" : "inActive"}
        onSubmit={formik.handleSubmit}
      >
        <FontAwesomeIcon
          className="close-icon"
          icon={faXmark}
          onClick={handleCloseModal}
        />
        <h2>Register</h2>

        <div className="stages">
          <div className="stage1">
            <div className={signupStages === 1 ? "active-stage" : ""}></div>
          </div>
          <div className="stage2">
            <FontAwesomeIcon
              icon={faArrowRightLong}
              className={signupStages === 2 ? "active-svg" : ""}
            />
            <div className={signupStages === 2 ? "active-stage" : ""}></div>
          </div>
          <div className="stage3">
            <FontAwesomeIcon
              icon={faArrowRightLong}
              className={signupStages === 3 ? "active-svg" : ""}
            />
            <div className={signupStages === 3 ? "active-stage" : ""}></div>
          </div>
        </div>

        {signupStages === 1 && (
          <div className="form-content">
            <label htmlFor="fullname">
              fullname:{" "}
              {formik.touched.fullname && formik.errors.fullname ? (
                <div className="error">{formik.errors.fullname}</div>
              ) : null}
              <input
                name="fullname"
                type="text"
                placeholder="Enter fullname..."
                value={formik.values.fullname}
                onChange={formik.handleChange}
              />
            </label>

            <label htmlFor="email">
              email:{" "}
              {formik.touched.email && formik.errors.email ? (
                <div className="error">{formik.errors.email}</div>
              ) : null}
              <input
                name="email"
                type="email"
                placeholder="Enter email..."
                value={formik.values.email}
                onChange={formik.handleChange}
              />
            </label>

            <label htmlFor="phone">
              phone:{" "}
              {formik.touched.phone && formik.errors.phone ? (
                <div className="error">{formik.errors.phone}</div>
              ) : null}
              <input
                name="phone"
                type="text"
                placeholder="Enter your phone number..."
                value={formik.values.phone}
                onChange={formik.handleChange}
              />
            </label>
          </div>
        )}

        {signupStages === 2 && (
          <div className="form-content">
            <label htmlFor="gender">
              Gender:{" "}
              {formik.touched.gender && formik.errors.gender ? (
                <div className="error">{formik.errors.gender}</div>
              ) : null}
              <select
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
              >
                <option value="prefer not to say">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>

            <label htmlFor="birthday">
              birthday:{" "}
              {formik.touched.birthday && formik.errors.birthday ? (
                <div className="error">{formik.errors.birthday}</div>
              ) : null}
              <input
                name="birthday"
                type="date"
                value={formik.values.birthday}
                onChange={formik.handleChange}
              />
            </label>

            <label htmlFor="address">
              address:{" "}
              {formik.touched.address && formik.errors.address ? (
                <div className="error">{formik.errors.address}</div>
              ) : null}
              <input
                name="address"
                type="text"
                placeholder="Enter address..."
                value={formik.values.address}
                onChange={formik.handleChange}
              />
            </label>
          </div>
        )}

        {signupStages === 3 && (
          <div className="form-content">
            <label htmlFor="password">
              password:{" "}
              {formik.touched.password && formik.errors.password ? (
                <div className="error">{formik.errors.password}</div>
              ) : null}
              <input
                name="password"
                type={visiblePassword ? "text" : "password"}
                placeholder="Enter password..."
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

            <label htmlFor="confirm-password">
              confirm:{" "}
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <div className="error">{formik.errors.confirmPassword}</div>
              ) : null}
              <input
                name="confirm-password"
                type="password"
                placeholder="Confirm password..."
                value={formik.values.confirmPassword}
                onChange={handleConfirmPassword}
              />
            </label>
          </div>
        )}

        {mode === "off-admin" && (
          <p>
            Already have account? <a onClick={handleMode}>login here</a>
          </p>
        )}
        {signupStages === 3 ? (
          <div className="form-btns">
            <button
              className="prev-btn"
              onClick={handlePrevStage}
              type="submit"
            >
              Move back
            </button>
            <button className="submit-btn" type="submit">
              {loading ? <Loading /> : <>Register</>}
            </button>
          </div>
        ) : (
          <div className="form-btns">
            <button
              className="prev-btn"
              onClick={handlePrevStage}
              type="submit"
            >
              Move back
            </button>
            <button
              className="next-btn"
              onClick={handleNextStage}
              type="submit"
            >
              Forward
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default SignUp;
