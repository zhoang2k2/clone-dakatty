import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import "./purchaseOrder.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrder,
  selectOrderState,
  type CustomerOrder,
} from "../../../redux/reducer/OrdersSlide";
import { selectAuthCustomerState } from "../../../redux/reducer/AuthCustomerSlide";

type PurchaseOrder = {
  onClose: () => void;
  addingSuccess: number;
};

function PurchaseOrder({ onClose, addingSuccess }: PurchaseOrder) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dispatch = useDispatch<any>();
  const { orders } = useSelector(selectOrderState);
  const { currentCustomerAccount } = useSelector(selectAuthCustomerState);

  const [authOrder, setAuthOrder] = useState<CustomerOrder[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [sortOrder, setSortOrder] = useState<CustomerOrder[]>([]);

  useEffect(() => {
    setShowForm(true);
  }, []);

  const handleCloseModal = () => {
    setShowForm(false);
    setTimeout(() => {
      onClose();
    }, 350);
  };

  useEffect(() => {
    const matchOrders = orders.filter((auth) =>
      auth.customerId.includes(currentCustomerAccount.id)
    );
    setAuthOrder(matchOrders);
  }, [currentCustomerAccount.id, orders]);

  useEffect(() => {
    dispatch(fetchOrder());
  }, [dispatch, addingSuccess]);

  useEffect(() => {
    setSortOrder(authOrder.slice().reverse());
  }, [authOrder]);

  // ACTION
  const handleFilterDone = () => {
    setSortOrder(authOrder.filter((item) => item.status === "done"));
  };
  const handleFilterPending = () => {
    setSortOrder(authOrder.filter((item) => item.status === "pending"));
  };
  const handleRenderAll = () => {
    setSortOrder(authOrder.slice().reverse());
  };

  return (
    <>
      <div className="purchase-order-container">
        <div
          className={showForm ? "purchase-wrapper active" : "purchase-wrapper"}
        >
          <h2>PURCHASE ORDER</h2>
          <FontAwesomeIcon
            icon={faXmark}
            className="close-btn"
            onClick={handleCloseModal}
          />
          <div className="purchase-action">
            <button onClick={handleRenderAll}>All</button>
            <button onClick={handleFilterDone}>Done</button>
            <button onClick={handleFilterPending}>Pending</button>
          </div>

          <div className="purchase-body">
            <ul>
              {sortOrder &&
                sortOrder.map((order) => {
                  const formatFinalPurchaseCurrence = new Intl.NumberFormat(
                    "vi-VN",
                    {
                      style: "currency",
                      currency: "VND",
                    }
                  ).format(parseInt(order.inTotal));

                  return (
                    <li key={order.id}>
                      <div className="final-purchase">
                        <div
                          className={
                            order.status === "done"
                              ? "status done"
                              : "status pending"
                          }
                        >
                          {order.status}
                        </div>
                        <div className="total-price">
                          In total: <b>{formatFinalPurchaseCurrence}</b>
                        </div>
                      </div>

                      {order.products.map((item) => {
                        const formatCurrence = new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(parseInt(item.price));

                        const quantity = order.detailQuantities.map(
                          (detail) => {
                            if (detail.productId === item.id) {
                              return detail.productQuantity;
                            }
                          }
                        );

                        const detailQuantity: { [key: number]: number } = {};
                        order.detailQuantities.forEach((detail) => {
                          detailQuantity[parseInt(detail.productId)] =
                            detail.productQuantity;
                        });

                        const totalPrice =
                          parseInt(item.price) *
                          detailQuantity[parseInt(item.id)];

                        const formatTotalPriceCurrence = new Intl.NumberFormat(
                          "vi-VN",
                          {
                            style: "currency",
                            currency: "VND",
                          }
                        ).format(totalPrice);

                        return (
                          <div className="purchase-card" key={item.id}>
                            <div className="purchase-content">
                              <div className="purchase-img">
                                <img src={item.image} alt="image" />
                              </div>
                              <div className="purchase-detail">
                                <h3>{item.name}</h3>
                                <p>Breed: {item.catBreed}</p>
                                <p>Age: {item.age}</p>
                                <p className="purchase-detail-price">
                                  {formatCurrence} x{quantity} ={" "}
                                  <b>{formatTotalPriceCurrence}</b>
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default PurchaseOrder;
