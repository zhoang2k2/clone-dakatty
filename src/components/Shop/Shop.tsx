import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./shop.scss";
import {
  faBoxOpen,
  faCartPlus,
  faClockRotateLeft,
  faComments,
  faCreditCard,
  faDollarSign,
  faMagnifyingGlass,
  faPlus,
  faRankingStar,
  faStar,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  selectProductState,
} from "../../redux/reducer/ProductsSlide";
import { useEffect, useState, type ChangeEvent } from "react";
import type { Product } from "../../types/ProductType";
import Pagination from "../Pagination/Pagination";
import {
  fetchAuthCustomer,
  selectAuthCustomerState,
} from "../../redux/reducer/AuthCustomerSlide";
import {
  fetchCustomerData,
  selectCustomerState,
} from "../../redux/reducer/CustomerSlide";
import { putProductsToCart } from "../../redux/reducer/CartSlide";
import { createPortal } from "react-dom";
import CustomerLogin from "../PopUp/Customer/CustomerLogin";

function Shop() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dispatch = useDispatch<any>();
  const { products } = useSelector(selectProductState);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // SORT HANDLING
  const [sortProducts, setSortProducts] = useState<Product[]>([]);
  const [sortStatus, setSortStatus] = useState("increase");

  const handleSort = (type: string) => {
    const sorted = [...products].sort((a, b) => {
      if (type === "price") {
        const priceA = parseInt(a.price);
        const priceB = parseInt(b.price);
        return sortStatus === "decrease" ? priceA - priceB : priceB - priceA;
      } else if (type === "rate") {
        const rateA = parseInt(a.rate);
        const rateB = parseInt(b.rate);
        return sortStatus === "decrease" ? rateA - rateB : rateB - rateA;
      }
      return 0;
    });
    setSortProducts(sorted);
    setSortStatus(sortStatus === "increase" ? "decrease" : "increase");
    setCurrentPage(1);
  };

  useEffect(() => {
    setSortProducts(products);
  }, [products]);

  // SEARCH HANDLIMG
  const [filterVal, setFilterVal] = useState("");
  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterVal(e.target.value);
  };
  const handleFilter = () => {
    const filterList = products.filter((filtered) => {
      return (
        filtered.name.toLowerCase().includes(filterVal.toLowerCase()) ||
        filtered.catBreed.toLowerCase().includes(filterVal.toLowerCase()) ||
        filtered.status.toLowerCase().includes(filterVal.toLowerCase())
      );
    });
    setSortProducts(filterList);
    setCurrentPage(1);
  };

  // HANDLE PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const [itemsPerPage] = useState(12);

  const totalItem: Product[] = [...sortProducts];
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const totalPage = Math.ceil(totalItem.length / itemsPerPage);

  const currentItems: Product[] = totalItem.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  useEffect(() => {
    window.scrollTo({
      top: 1050,
      behavior: "smooth",
    });
  }, [currentPage]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // HANDLE ADD TO CART
  const [showLogin, setShowLogin] = useState(false);
  const [reset, setReset] = useState(1);
  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  const { currentCustomerAccount } = useSelector(selectAuthCustomerState);
  const { customerInfo } = useSelector(selectCustomerState);

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
      <div className="shop-container">
        <div className="shop-banner">
          <div className="slides">
            <img src="https://i.imgur.com/w3vTUHj.jpeg" alt="banner 2" />
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

        <div className="shop-content">
          <h2>Da Katty Product</h2>
          <div className="shop-head">
            <div className="filter-btns">
              <button
                className="sort-by-price"
                onClick={() => handleSort("price")}
              >
                <FontAwesomeIcon icon={faDollarSign} /> Sort by Price
              </button>

              <button
                className="sort-by-rate"
                onClick={() => handleSort("rate")}
              >
                <FontAwesomeIcon icon={faRankingStar} /> Sort by Rate
              </button>
            </div>
            <div className="search-product">
              <label>
                <input
                  onChange={handleFilterChange}
                  value={filterVal}
                  type="text"
                  placeholder="search your kitty"
                />
                <button onClick={handleFilter}>
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
              </label>
            </div>
          </div>
          <div className="shop-body">
            <div className="shop-product-list">
              {currentItems.map((product) => {
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
                  <div className="product-card" key={product.id}>
                    <FontAwesomeIcon
                      icon={faCartPlus}
                      className="add-to-cart"
                    />
                    <div className="product-img">
                      <img loading="lazy" src={product.image} alt="img" />
                    </div>
                    <div className="product-title">
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
            <Pagination
              mode="full"
              totalPage={totalPage}
              onPageChange={handlePageChange}
              currentPage={currentPage}
            />
          </div>
        </div>

        <div className="shop-handbook">
          <h2>TIPS FOR "CON SEN"</h2>
          <div className="handbook-container">
            <a
              target="blank"
              href="https://www.facebook.com/permalink.php?story_fbid=pfbid025MHmB6sgGCRFJLsGRAk6f9yAvgLsYS2BEmuGFeJme1b8B1qcFdtATGtb3KoqWHQ6l&id=61554856859064&__cft__[0]=AZVywIiRC6gToiVwaAg6E5I97vBBwXLQuo5mPcd92UMuR7glTC7Nx47dkChlACHSSkjQVGpS-6cg9n7Mdp5wcBEukUpMU4Cro0nEfUdeQtKD1FRbhC2iprA_kSJBOuuCLbQNCszEEe8fIQK5aq_SzCokQSu1c29JPpwQP07hmxDRViMzaZeZo0-eNfoBAuZJs1msU9j4II591aJspYD96vTR&__tn__=%2CO%2CP-R"
              className="handbook-card"
            >
              <img src="https://i.imgur.com/gMqJm1Z.jpeg" alt="handbook 1" />
              <h3>What are kitty needs?</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua
              </p>
            </a>

            <a
              target="blank"
              href="https://www.facebook.com/mintmintspa.petshop/posts/pfbid0mpsTydv86749PihZhQP3TWG21G3LRbfNcc29y1DBNfjHUQGBJKqDLPnHMVL2WpMul"
              className="handbook-card"
            >
              <img src="https://i.imgur.com/NabhOtD.jpeg" alt="handbook 2" />
              <h3>Feeding from cat to pig</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua
              </p>
            </a>

            <a
              target="blank"
              href="https://www.facebook.com/permalink.php?story_fbid=pfbid0wByQ6jrSi9jWbyokA6AxE2hWQjsA9RBPjVLgCksQKa9Cjwo4TVxhRyMj5vQqZWfnl&id=61554856859064&__cft__[0]=AZVv8D0q0zRZWpXSyE03JAjqtaWfvoQ1nrrKAgyeussWWzUkhg5ZEo-Nl4w1cSMNOkTPWqO5iuz1Kvged-qUhPllr4lqiok78RjMrNo1U5hXsY7JcR17EUlNzEmf9YAvX7p6WQIcoMy3FZP-_jfI38OHYYO-XJeHGwK6pSwa0uar6dlYkbgHK4YDwYXQy_Q8j5QoD5FZo7qCPRRda-Ugz8Xc&__tn__=%2CO%2CP-Rl"
              className="handbook-card"
            >
              <img src="https://i.imgur.com/z3frUXb.jpeg" alt="handbook 1" />
              <h3>Avoding these from your "BOSS"</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua
              </p>
            </a>
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

export default Shop;
