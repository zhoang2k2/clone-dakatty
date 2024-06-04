/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch } from "react-redux";
import "./confirmPop.scss";
import {
  deleteAccount,
  editAccount,
  fetchAccounts,
} from "../../../redux/reducer/AccountsSlide";
import type { AccountEditedType } from "../../../types/AccountType";
import { useState } from "react";
import Loading from "../../Loading/Loading";

type ConfirmmAccount = {
  onCancle: () => void;
  onSubmitSuccess: () => void;
  mode: "delete" | "edit";
  selectedAccount?: AccountEditedType;
  selectedID?: string;
};

function ConfirmAccount({
  onCancle,
  onSubmitSuccess,
  selectedID,
  selectedAccount,
  mode,
}: ConfirmmAccount) {
  const dispatch = useDispatch<any>();
  const [loading, setLoading] = useState(false);

  const handleAcceptDelete = (id: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    setTimeout(() => {
      if (id) {
        dispatch(deleteAccount(id))
          .then(() => {
            dispatch(fetchAccounts());
            onSubmitSuccess();
            onCancle();
          })
          .catch((error: any) => {
            console.error("Error deleting account:", error);
          });
      } else {
        console.log("fail to accept delete");
      }
    }, 1000);
  };

  const handleAcceptEdit = (selectedAccount: AccountEditedType) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1200);

    setTimeout(() => {
      if (selectedAccount) {
        console.log(selectedAccount);
        dispatch(editAccount(selectedAccount))
          .then(() => {
            dispatch(fetchAccounts());
            onSubmitSuccess();
            onCancle();
          })
          .catch((error: any) => {
            console.error("Error editing account:", error);
          });
      } else {
        console.log(
          "Failed to accept edit: Selected account is null or undefined."
        );
      }
    }, 1200);
  };

  const handleClick = () => {
    mode === "delete"
      ? selectedID && handleAcceptDelete(selectedID)
      : selectedAccount && handleAcceptEdit(selectedAccount);
  };

  return (
    <div className="popup">
      <div className="wrapper">
        <div className="title">Warning!!</div>
        <div className="body">
          {mode === "delete" ? (
            <p>
              Are you sure to
              <br />
              <span> {mode}</span> item's ID: <span>{selectedID}</span>?
            </p>
          ) : (
            <p>Are you sure about saving this change?</p>
          )}
        </div>
        <div className="footer">
          <button className="confirm-btn" onClick={handleClick}>
            {loading ? <Loading /> : <>Confirm</>}
          </button>
          <button className="deny-btn" onClick={onCancle}>
            Cancle
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmAccount;
