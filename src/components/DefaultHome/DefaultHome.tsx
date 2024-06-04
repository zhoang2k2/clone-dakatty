import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faCartPlus,
  faClockRotateLeft,
  faComments,
  faCreditCard,
  faLeftLong,
  faPlus,
  faQuoteRight,
  faRightLong,
  faStar,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import "./carousel/carousel.scss";
import "./commitment/commitment.scss";
import "./contact/contact.scss";
import "./feedback/feedback.scss";
import "./newProduct/newProducts.scss";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  selectProductState,
} from "../../redux/reducer/ProductsSlide";
import type { Product } from "../../types/ProductType";
import { useStickyBox } from "react-sticky-box";
import Pagination from "../Pagination/Pagination";
import {
  fetchAuthCustomer,
  selectAuthCustomerState,
} from "../../redux/reducer/AuthCustomerSlide";
import { putProductsToCart } from "../../redux/reducer/CartSlide";
import {
  fetchCustomerData,
  selectCustomerState,
} from "../../redux/reducer/CustomerSlide";
import { createPortal } from "react-dom";
import CustomerLogin from "../PopUp/Customer/CustomerLogin";

function DefaultHome() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dispatch = useDispatch<any>();
  const { products } = useSelector(selectProductState);
  const { currentCustomerAccount } = useSelector(selectAuthCustomerState);
  const { customerInfo } = useSelector(selectCustomerState);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [current, setCurrent] = useState(1);
  const [reset, setReset] = useState(1);
  const [showLogin, setShowLogin] = useState(false);

  // ========================NEW PRODUCT========================
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const onlyNewProduct: Product[] = products.filter(
    (product) => product.status.toLocaleLowerCase() === "new"
  );

  const StickyBox = useStickyBox({ offsetTop: 100, offsetBottom: 20 });

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const totalItem: Product[] = [...onlyNewProduct];
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const totalPage = Math.ceil(totalItem.length / itemsPerPage);

  const currentItems: Product[] = totalItem.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  useEffect(() => {
    window.scrollTo({
      top: 1100,
      behavior: "smooth",
    });
  }, [currentPage]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // ========================CAROUSEL========================
  const slides = [
    {
      id: "1",
      image: "https://i.imgur.com/iJa5LLf.jpg",
    },
    {
      id: "2",
      image: "https://i.imgur.com/ZxXPNhR.jpg",
    },
  ];

  const toPrev = () => {
    current === 1 ? setCurrent(slides.length) : setCurrent(current - 1);
  };

  const toNext = () => {
    current === slides.length ? setCurrent(1) : setCurrent(current + 1);
  };

  // ==========================CART HANDLING==========================
  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  useEffect(() => {
    dispatch(fetchAuthCustomer());
    dispatch(fetchCustomerData());
  }, [dispatch, reset]);

  const matchCustomerAccount = customerInfo.find((account) => {
    return (
      currentCustomerAccount.username === account.username &&
      currentCustomerAccount.password === account.password
    );
  });

  const addToCart = (product: Product) => {
    if (
      currentCustomerAccount.username === "" ||
      currentCustomerAccount.password === ""
    ) {
      setShowLogin(true);
    } else {
      if (matchCustomerAccount) {
        const catchProductInCart = matchCustomerAccount.products;
        let found = false;
        for (let i = 0; i <= catchProductInCart.length - 1; i++) {
          if (catchProductInCart[i].id === product.id) {
            found = true;
            window.alert("You already have this kitty in cart!");
            break;
          }
        }
        if (found === false) {
          const updateStatus = {
            id: matchCustomerAccount.id,
            username: matchCustomerAccount.username,
            password: matchCustomerAccount.password,
            products: [...matchCustomerAccount.products, product],
          };

          dispatch(putProductsToCart(updateStatus)).then(() => {
            dispatch(fetchCustomerData());
          });
        }
      }
    }
  };

  return (
    <>
      <div className="carousel-container">
        {slides.map((slide) => {
          return (
            <div
              className={
                current.toString() === slide.id
                  ? "carousel-card carousel-card-active"
                  : "carousel-card"
              }
              key={slide.id}
            >
              <img src={slide.image} alt={`img ${slide.id}`} />
            </div>
          );
        })}
        <div className="carousel-btn">
          <button onClick={toPrev}>
            <FontAwesomeIcon icon={faLeftLong} />
          </button>
          <button onClick={toNext}>
            <FontAwesomeIcon icon={faRightLong} />
          </button>
        </div>
        <div className="carousel-title">
          <h2>DA KATTY</h2>
          <p>Looking for something beautiful?</p>
          <p>
            This is a right place where you find the cutest things in the world
            !!
          </p>
          <button>Explore now</button>
        </div>
      </div>

      <div className="commitment-container">
        <div className="commitment-card-wrapper">
          <div className="commitment-card">
            <FontAwesomeIcon icon={faTruck} />
            <h5>Fast & Free Delivery</h5>
            <p>Free delivery on all orders</p>
          </div>

          <div className="commitment-card">
            <FontAwesomeIcon icon={faClockRotateLeft} />
            <h5>Online Support</h5>
            <p>Full time support for customer</p>
          </div>

          <div className="commitment-card">
            <FontAwesomeIcon icon={faComments} />
            <h5>Full consultation</h5>
            <p>Meets all needs</p>
          </div>

          <div className="commitment-card">
            <FontAwesomeIcon icon={faCreditCard} />
            <h5>Secure Payment</h5>
            <p>Secure for all payment types</p>
          </div>
        </div>
      </div>

      <div className="new-product-container">
        <h2>New products released</h2>
        <div className="new-products-wrapper">
          <aside ref={StickyBox} className="sticky-container">
            <div className="sticky">
              <h3>Da Katty 2024 collections</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                justo ex, suscipit quis consequat in, interdum ullamcorper
                ligula. Nulla sed facilisis lectus, et consequat lorem. Sed eu
                sapien congue, sagittis tortor vel, fermentum urna. Nam
                hendrerit hendrerit tincidunt. Duis vestibulum eget purus non
                bibendum. Etiam mattis congue suscipit. Mauris tincidunt
                accumsan nunc, eu pellentesque ipsum tincidunt a. Praesent vel
                iaculis nibh. Mauris sed imperdiet enim. Nulla vel ornare dolor,
                ut dignissim lectus.
              </p>
              <div className="seasonal-img">
                <img src="https://i.imgur.com/lg3aVnE.jpeg" alt="1" />
                <img src="https://i.imgur.com/Ix8Ahgu.jpeg" alt="2" />
                <img src="https://i.imgur.com/9CIey9j.jpeg" alt="3" />
              </div>
            </div>
          </aside>
          <div className="new-products">
            {currentItems &&
              currentItems.map((product) => {
                const formatCurrence = new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(parseInt(product.price));

                const ratingStar = [];
                const unRatingStar = [];
                const unRating = 5 - parseInt(product.rate);
                for (let i = 0; i < parseInt(product.rate); i++) {
                  ratingStar.push(<FontAwesomeIcon icon={faStar} key={i} />);
                }
                for (let i = 0; i < unRating; i++) {
                  unRatingStar.push(
                    <FontAwesomeIcon icon={faStar} className="unrate" key={i} />
                  );
                }
                const productRating = ratingStar.concat(unRatingStar);

                return (
                  <div
                    className="new-product-card product-card"
                    key={product.id}
                    onClick={() => {}}
                  >
                    <FontAwesomeIcon icon={faCartPlus} className="cart-icon" />
                    <div className="product-img">
                      <img loading="lazy" src={product.image} alt="img" />
                    </div>
                    <div className="new-product-title product-title">
                      <h3>{product.name}</h3>
                      <div className="rate">{productRating}</div>

                      <div className="sales">({product.sales} rated)</div>

                      <div className="quantity">
                        <FontAwesomeIcon icon={faBoxOpen} />
                        {product.quantity} left
                      </div>

                      <div className="price">{formatCurrence}</div>

                      <button
                        className="add-to-cart-btn"
                        onClick={() => addToCart(product)}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
          <div></div>
          <Pagination
            mode="button-only"
            totalPage={totalPage}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
        </div>
      </div>

      <div className="contact-container">
        <h2>Contact us for a better kitty choice</h2>

        <div className="contact-body">
          <div className="contact-title">
            <h3>Let get in touch!</h3>
            <img src="https://i.imgur.com/RykY2FJ.gif" alt="contact img" />
            <div className="contact-info">
              <p>Email: dakatty@business.com</p>
              <p>Hotline: +84 905 000 000</p>
              <p>Address: Hai Chau, Da Nang</p>
            </div>
          </div>
          <div className="contact-form">
            <form>
              <label htmlFor="name">
                Your name:
                <input type="text" name="name" />
              </label>

              <label htmlFor="email">
                Email:
                <input type="text" name="email" />
              </label>

              <label htmlFor="phone">
                Phone:
                <input type="text" name="phone" />
              </label>

              <label htmlFor="more">
                We will be appreciated if you have any questions:
                <input type="text" />
              </label>
            </form>

            <button>submit</button>
          </div>
        </div>
      </div>

      <div className="feedback-container">
        <h2>What do customers think about us?</h2>
        <div className="customer-feedback">
          <div className="feedback-card">
            <div className="customer-img">
              <img src="https://i.imgur.com/64xI96q.jpeg" alt="customer" />
            </div>
            <div className="customer-text">
              <h3>Michael J.</h3>
              <p>
                "Love da kitty so much! just wanna YÉHEE whenever see them..."
              </p>
              <FontAwesomeIcon icon={faQuoteRight} />
            </div>
          </div>

          <div className="feedback-card">
            <div className="customer-img">
              <img src="https://i.imgur.com/HVBLzWd.jpeg" alt="customer" />
            </div>
            <div className="customer-text">
              <h3>Roar Singer</h3>
              <p>
                "What a nice brand name. Love the kitty more when they ROARR!!"
              </p>
              <FontAwesomeIcon icon={faQuoteRight} />
            </div>
          </div>

          <div className="feedback-card">
            <div className="customer-img">
              <img src="https://i.imgur.com/9sj2HJT.jpeg" alt="customer" />
            </div>
            <div className="customer-text">
              <h3>Rick Astley</h3>
              <p>"Never gonna give you up...Never gonna put kitty down..."</p>
              <FontAwesomeIcon icon={faQuoteRight} />
            </div>
          </div>
        </div>
      </div>

      {showLogin &&
        createPortal(
          <CustomerLogin
            onClose={handleCloseLogin}
            onChangeMode={() => {}}
            onLoginSuccess={() => {
              setReset((prev) => prev + 1);
            }}
          />,
          document.body
        )}
    </>
  );
}

export default DefaultHome;
