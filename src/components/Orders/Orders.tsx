import { useDispatch, useSelector } from "react-redux";
import "./order.scss";
import {
  editOrder,
  fetchOrder,
  selectOrderState,
  type CustomerOrder,
} from "../../redux/reducer/OrdersSlide";
import { useEffect, useState, type ChangeEvent } from "react";
import Pagination from "../Pagination/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faMagnifyingGlass,
  faRotateLeft,
  faTrashArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { createPortal } from "react-dom";
import ConfirmUndoneOrder from "../PopUp/Confirm/ConfirmUndoneOrder";

function Orders() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dispatch = useDispatch<any>();
  const { orders } = useSelector(selectOrderState);
  useEffect(() => {
    dispatch(fetchOrder());
  }, [dispatch]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [status, setStatus] = useState<{ [key: string]: string }>({});
  const [confirmUndone, setConfirmUndone] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder>();

  // HANDLE SEARCH
  const [currentItems, setCurrentItems] = useState<CustomerOrder[]>([]);
  const [filterVal, setFilterVal] = useState("");

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterVal(e.target.value);
  };

  const handleFilter = () => {
    const filterList = orders.filter((filtered) => {
      return (
        filtered.username.toLowerCase().includes(filterVal.toLowerCase()) ||
        filtered.phone.toLowerCase().includes(filterVal.toLowerCase()) ||
        filtered.customerId.toLowerCase().includes(filterVal.toLowerCase()) ||
        filtered.id.toLowerCase().includes(filterVal.toLowerCase()) ||
        filtered.status.toLowerCase().includes(filterVal.toLowerCase())
      );
    });
    setCurrentItems(filterList);
    setCurrentPage(1);
  };

  // HANDLE PAGINATION
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const totalItem = [...currentItems];
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const totalPage = Math.ceil(totalItem.length / itemsPerPage);

  const renderItems = totalItem.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (orders.length > 0) {
      setCurrentItems(orders);
    }
  }, [orders]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  // HANDLE STATUS

  const handleStatus = (order: CustomerOrder) => {
    const updatedStatus = { ...status, [order.id]: "done" };
    setStatus(updatedStatus);

    const orderStatus = updatedStatus[order.id];
    if (orderStatus === "done") {
      const updateOrder = { ...order, status: orderStatus };
      dispatch(editOrder(updateOrder)).then(() => {
        dispatch(fetchOrder());
      });
    }
  };

  const handleUnDone = (order: CustomerOrder) => {
    setConfirmUndone(true);
    setSelectedOrder(order);
  };

  const undoneAction = () => {
    const order = selectedOrder;
    if (order) {
      const updatedStatus = { ...status, [order.id]: "pending" };
      setStatus(updatedStatus);

      const orderStatus = updatedStatus[order.id];
      if (orderStatus === "pending") {
        const updateOrder = { ...order, status: orderStatus };
        dispatch(editOrder(updateOrder)).then(() => {
          dispatch(fetchOrder());
        });
      }
    }
  };

  const handleCancleConfirm = () => {
    setConfirmUndone(false);
  };

  return (
    <>
      <div className="order-container">
        <div className="action-body">
          <div className="button-actions"></div>
          <div className="search-action">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <input
              type="text"
              placeholder="Search orders..."
              value={filterVal}
              onChange={handleFilterChange}
            />
            <button className="search-btn" onClick={handleFilter}>
              {filterVal === "" ? (
                <FontAwesomeIcon icon={faRotateLeft} />
              ) : (
                <>Search</>
              )}
            </button>
          </div>
        </div>

        <table className="products-table">
          <thead className="order-head">
            <tr>
              <th>Order ID</th>
              <th>Accounts</th>
              <th>Customer Info</th>
              <th>Orders</th>
              <th>In Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {renderItems.map((item) => {
              const totalPriceFormat = new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(parseInt(item.inTotal));

              return (
                <tr key={item.id} className="order-tr">
                  <td className="orderId-col">{item.id}</td>

                  <td className="customer-col">
                    <ul>
                      <li>Customer ID: {item.customerId}</li>
                      <li>Username: {item.username}</li>
                      <li>Password: {item.password}</li>
                    </ul>
                  </td>

                  <td className="customer-col">
                    <ul>
                      <li>Phone: {item.phone}</li>
                      <li>Address: {item.address}</li>
                    </ul>
                  </td>

                  <td className="purchase-col">
                    <div className="purchase-cards-list">
                      {item.products.map((product) => {
                        const priceFormat = new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(parseInt(product.price));

                        const purchaseQuantity =
                          item.detailQuantities &&
                          item.detailQuantities.find((detail) => {
                            if (detail.productId === product.id) {
                              return detail.productQuantity;
                            }
                          });

                        return (
                          <div className="purchase-card" key={product.id}>
                            <div className="purchase-img">
                              <img src={product.image} alt="img" />
                            </div>
                            <div className="purchase-content">
                              <p>ID: {product.id}</p>
                              <p>Name: {product.name}</p>
                              <p>Price per unit: {priceFormat}</p>
                              <span>
                                x{" "}
                                {purchaseQuantity &&
                                  purchaseQuantity.productQuantity}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </td>

                  <td className="total-purchase-col">{totalPriceFormat}</td>

                  <td className="status-col">
                    <span
                      className={item.status === "done" ? "done" : "pending"}
                    >
                      {status[item.id] === "done"
                        ? status[item.id]
                        : item.status}
                    </span>
                  </td>

                  <td className="action-col">
                    {item.status === "done" ? (
                      <button
                        className="undone-btn"
                        onClick={() => handleUnDone(item)}
                      >
                        <FontAwesomeIcon icon={faTrashArrowUp} />
                      </button>
                    ) : (
                      <button
                        className="done-btn"
                        onClick={() => handleStatus(item)}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <Pagination
          mode="full"
          totalPage={totalPage}
          onPageChange={handlePageChange}
          currentPage={currentPage}
        />
      </div>

      {confirmUndone &&
        createPortal(
          <ConfirmUndoneOrder
            onCancle={handleCancleConfirm}
            onConfirm={undoneAction}
          />,
          document.body
        )}
    </>
  );
}

export default Orders;
