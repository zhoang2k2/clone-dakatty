import { useState } from "react";
import Loading from "../../Loading/Loading";

type ConfirmCloseProps = {
  onCancle: () => void;
  onConfirm: () => void;
};

function ConfirmClose({ onCancle, onConfirm }: ConfirmCloseProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onCancle();
      onConfirm();
    }, 500);
  };

  return (
    <div className="popup">
      <div className="wrapper">
        <div className="title">Warning!!</div>
        <div className="body">
          <p>
            This action causes losing any change. Are you sure to close this
            modal?
          </p>
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

export default ConfirmClose;
