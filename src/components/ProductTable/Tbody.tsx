/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch } from "react-redux";
import { fetchProducts } from "../../redux/reducer/ProductsSlide";
import type { Product } from "../../types/ProductType";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import AddingPop from "../PopUp/Adding/AddingPop";
import { createPortal } from "react-dom";
import ConfirmPop from "../PopUp/Confirm/ConfirmPop";

type TbodyProps = {
  currentItems: Product[];
  filterVal: string;
};

function Tbody({ currentItems, filterVal }: TbodyProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dispatch = useDispatch<any>();

  const [showPopup, setShowPopup] = useState({
    addingPop: false,
    confirmPop: false,
  });
  const [initialState, setInitialState] = useState<Product>();
  const [selectedID, setSelectedID] = useState("");
  const [reset, setReset] = useState(1);

  const randomKey = () => Math.floor(Math.random() * 100000);
  const columnSpan: number = 11;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [reset]);

  const handleConfirmDelete = (id: string) => {
    setShowPopup({ ...showPopup, confirmPop: true });
    setSelectedID(id);
  };

  const handleEditPop = (selectedProduct: Product) => {
    setShowPopup({ ...showPopup, addingPop: true });
    setInitialState(selectedProduct);
  };

  return (
    <>
      {currentItems.length === 0 ? (
        <tbody>
          <tr>
            <td colSpan={columnSpan}>
              Cannot find the item <span>{filterVal}</span>
            </td>
          </tr>
        </tbody>
      ) : (
        <tbody>
          {currentItems.map((product: Product) => {
            const key = randomKey();

            const formatCurrence = new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(parseInt(product.price));

            return (
              <tr key={key}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>
                  <img
                    loading="lazy"
                    src={product.image}
                    alt={`cat ${product.id}`}
                  />
                </td>
                <td>{formatCurrence}</td>
                <td>{product.quantity}</td>
                <td>{product.catBreed}</td>
                <td>{product.age} months</td>
                <td>{product.color}</td>
                <td>{product.sales} sales</td>
                <td>{product.status}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEditPop(product)}
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                  <button
                    className="del-btn"
                    onClick={() =>
                      product.id && handleConfirmDelete(product.id)
                    }
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      )}

      {showPopup.addingPop &&
        createPortal(
          <AddingPop
            mode="edit"
            initialState={initialState}
            onCancle={() => setShowPopup({ ...showPopup, addingPop: false })}
            onSubmitSuccess={() => setReset((prev) => prev + 1)}
            onClose={() => setShowPopup({ ...showPopup, addingPop: false })}
          />,
          document.body
        )}

      {showPopup.confirmPop &&
        createPortal(
          <ConfirmPop
            mode="delete"
            selectedID={selectedID}
            onCancle={() => setShowPopup({ ...showPopup, confirmPop: false })}
            onSubmitSuccess={() => setReset((prev) => prev + 1)}
          />,
          document.body
        )}
    </>
  );
}

export default Tbody;
