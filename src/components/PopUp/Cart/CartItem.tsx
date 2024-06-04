import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Product } from "../../../types/ProductType";
import { faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import type { CustomerInfo } from "../../../redux/reducer/CustomerSlide";
import {
  deleteProductsFromCart,
  fetchProductInCart,
} from "../../../redux/reducer/CartSlide";
import { useDispatch } from "react-redux";

type CartItemProps = {
  formatCurrence: string;
  item: Product;
  customerOnline: CustomerInfo;
  handleDecrease: (e: string) => void;
  handleIncrease: (e: string) => void;
  onRemoveSuccess: () => void;
  quantity: number;
};

function CartItem({
  formatCurrence,
  item,
  customerOnline,
  handleIncrease,
  handleDecrease,
  quantity,
  onRemoveSuccess
}: CartItemProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dispatch = useDispatch<any>();

  const handleDeleteItemFromCart = (productId: string) => {
    const updateProducts = customerOnline.products.filter(
      (item) => item.id !== productId
    );
    const customer = { ...customerOnline, products: updateProducts };
    dispatch(deleteProductsFromCart({ productId, customer })).then(() => {
      onRemoveSuccess()
      dispatch(fetchProductInCart(customerOnline.id));
    });
  };

  return (
    <li key={item.id}>
      <div className="sub-card-img">
        <img src={item.image} alt="product-img" />
      </div>

      <div className="sub-card-title">
        <h3>{item.name}</h3>
        <p className="price">{formatCurrence}</p>
        <p className="age">Age: {item.age} months</p>
        <p className="color">Color: {item.color}</p>
        <p className="cat-breed">Kind: {item.catBreed}</p>
      </div>

      <button
        className="delete-btn"
        onClick={() => handleDeleteItemFromCart(item.id)}
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
      <div className="sub-card-action">
        <button
          className="decrease-btn"
          onClick={() => {
            handleDecrease(item.id);
          }}
        >
          <FontAwesomeIcon icon={faMinus} />
        </button>
        <p>x{quantity}</p>
        <button
          className="increase-btn"
          onClick={() => {
            handleIncrease(item.id);
          }}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
    </li>
  );
}

export default CartItem;
