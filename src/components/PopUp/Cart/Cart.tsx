import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./cart.scss";
import {
  faCheck,
  faTruckArrowRight,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductInCart,
  putProductsToCart,
} from "../../../redux/reducer/CartSlide";
import {
  fetchAuthCustomer,
  selectAuthCustomerState,
} from "../../../redux/reducer/AuthCustomerSlide";
import { useEffect, useState } from "react";

import type { Product } from "../../../types/ProductType";
import {
  fetchCustomerData,
  selectCustomerState,
  type CustomerInfo,
} from "../../../redux/reducer/CustomerSlide";
import CartItem from "../../PopUp/Cart/CartItem";

import { useFormik } from "formik";
import * as Yup from "yup";
import Loading from "../../Loading/Loading";
import { addOrder } from "../../../redux/reducer/OrdersSlide";
import { createPortal } from "react-dom";
import PurchaseOrder from "./PurchaseOrder";

type CartPopProps = {
  onClose: () => void;
};

function CartPop({ onClose }: CartPopProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dispatch = useDispatch<any>();
  const { currentCustomerAccount } = useSelector(selectAuthCustomerState);
  const { customerInfo } = useSelector(selectCustomerState);

  const [productsInCart, setProductsInCart] = useState<Product[]>([]);
  const [customerOnline, setCustomerOnline] = useState<CustomerInfo>();
  const [productQuantities, setProductQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [showForm, setShowForm] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reset, setReset] = useState(1);

  useEffect(() => {
    dispatch(fetchAuthCustomer());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCustomerData());
  }, [dispatch, reset]);

  useEffect(() => {
    if (customerInfo.length > 0 && currentCustomerAccount) {
      const index = customerInfo.findIndex(
        (customer) => customer.id === currentCustomerAccount.id
      );
      if (index !== -1) {
        setProductsInCart(customerInfo[index].products);
        setCustomerOnline(customerInfo[index]);
        dispatch(fetchProductInCart(customerInfo[index].id));
      }
    }
  }, [customerInfo, currentCustomerAccount, dispatch]);

  // HANDLING QUANTITY
  useEffect(() => {
    const initialQuantities: { [key: string]: number } = {};
    productsInCart.forEach((product) => {
      initialQuantities[product.id] = 1;
    });
    setProductQuantities(initialQuantities);
  }, [productsInCart]);

  const handleIncrease = (productId: string) => {
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: (prevQuantities[productId] || 0) + 1,
    }));
  };

  const handleDecrease = (productId: string) => {
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: (prevQuantities[productId] || 1) - 1,
    }));
  };

  // HANDLING PURCHASE
  const totalPrice = productsInCart.reduce((total, product) => {
    const quantity = productQuantities[product.id] || 1;
    return total + parseInt(product.price) * quantity;
  }, 0);

  const totalPriceFormatCurrence = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(totalPrice);

  useEffect(() => {
    setShowForm(true);
  }, []);

  const formik = useFormik({
    initialValues: {
      phone: "",
      address: "",
    },
    validationSchema: Yup.object({
      phone: Yup.string()
        .min(10, "at least 10 characters")
        .max(12, "less than 12 characters")
        .required("required"),

      address: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 2400);

      setTimeout(() => {
        const orderId = Math.floor(Math.random() * 10000).toString();
        const inTotal = totalPrice.toString();
        const detailQuantityArray = Object.keys(productQuantities).map(
          (productId) => ({
            productId,
            productQuantity: productQuantities[productId],
          })
        );
        const order = {
          id: orderId,
          inTotal: inTotal,
          customerId: currentCustomerAccount.id,
          username: currentCustomerAccount.username,
          password: currentCustomerAccount.password,
          phone: values.phone,
          address: values.address,
          status: "pending",
          detailQuantities: detailQuantityArray,
          products: productsInCart,
        };
        dispatch(addOrder(order)).then(() => {
          const updateCart = {
            ...currentCustomerAccount,
            products: [],
          };
          dispatch(putProductsToCart(updateCart)).then(() => {
            dispatch(fetchCustomerData());
            handleAddSuccess();
            handleOpenPurchaseOrder();
          });
        });
      }, 2400);
    },
  });

  const handleOpenPurchaseOrder = () => {
    setOpenModal(true);
  };
  const handleClosePurchaseOrder = () => {
    setOpenModal(false);
  };

  const handleCloseModal = () => {
    setShowForm(false);
    handleClosePurchaseOrder();
    setTimeout(() => {
      onClose();
    }, 350);
  };

  const handleAddSuccess = () => {
    setReset((prev) => prev + 1);
  };

  const handleRemoveSuccess = () => {
    setReset((prev) => prev + 1);
  };

  return (
    <>
      <div className="cart-container">
        <div className={showForm ? "cart-wrapper active" : "cart-wrapper"}>
          <h2>CART</h2>
          <FontAwesomeIcon
            icon={faXmark}
            className="close-btn"
            onClick={handleCloseModal}
          />
          <span onClick={handleOpenPurchaseOrder}>
            <FontAwesomeIcon
              className="open-purchase-order"
              icon={faTruckArrowRight}
            />
            open purchase
          </span>
          <div className="cart-body">
            <div className="cart-info">
              <form onSubmit={formik.handleSubmit}>
                <label htmlFor="phone">
                  Phone:{" "}
                  {formik.touched.phone && formik.errors.phone ? (
                    <div className="error">{formik.errors.phone}</div>
                  ) : null}
                  <input
                    name="phone"
                    type="phone"
                    placeholder="Enter you phone number..."
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                  />
                </label>

                <label htmlFor="address">
                  Address:{" "}
                  {formik.touched.address && formik.errors.address ? (
                    <div className="error">{formik.errors.address}</div>
                  ) : null}
                  <input
                    name="address"
                    type="address"
                    placeholder="Enter you address..."
                    value={formik.values.address}
                    onChange={formik.handleChange}
                  />
                </label>

                <div className="purchase">
                  Total: {totalPriceFormatCurrence}
                </div>

                <button className="buy-btn" type="submit">
                  {loading ? (
                    <Loading />
                  ) : (
                    <>
                      Buy <FontAwesomeIcon icon={faCheck} />
                    </>
                  )}
                </button>
              </form>
            </div>
            <div className="cart-products">
              <ul>
                {productsInCart.map((item) => {
                  const formatCurrence = new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(parseInt(item.price));

                  return (
                    <CartItem
                      onRemoveSuccess={handleRemoveSuccess}
                      handleIncrease={handleIncrease}
                      handleDecrease={handleDecrease}
                      quantity={productQuantities[item.id] || 1}
                      key={item.id}
                      formatCurrence={formatCurrence}
                      item={item}
                      customerOnline={
                        customerOnline ?? {
                          id: "",
                          username: "",
                          password: "",
                          products: [],
                        }
                      }
                    />
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {openModal &&
        createPortal(
          <PurchaseOrder
            onClose={handleClosePurchaseOrder}
            addingSuccess={reset}
          />,
          document.body
        )}
    </>
  );
}

export default CartPop;
