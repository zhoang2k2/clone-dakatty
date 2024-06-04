import { useState } from "react";
import Loading from "../../Loading/Loading";

type ConfirmUndoneOrderType = {
  onCancle: () => void;
  onConfirm: () => void;
};

function ConfirmUndoneOrder({ onCancle, onConfirm }: ConfirmUndoneOrderType) {
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
    <>
      <div className="popup">
        <div className="wrapper">
          <div className="title">Warning!!</div>
          <div className="body">
            <p>Are you sure about going to undone this order?</p>
          </div>
          <div className="footer">
            <button className="confirm-btn" onClick={handleClick}>
              {loading ? <Loading /> : <>Accept</>}
            </button>
            <button className="deny-btn" onClick={onCancle}>
              Cancle
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConfirmUndoneOrder;
