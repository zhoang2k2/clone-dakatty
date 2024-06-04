import { useSelector } from "react-redux";
import "./table.scss";
import type { Product } from "../../types/ProductType";
import { useEffect, useState, type ChangeEvent } from "react";
import AddingPop from "../PopUp/Adding/AddingPop";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpShortWide,
  faArrowUpWideShort,
  faMagnifyingGlass,
  faPlus,
  faRotateLeft,
  faTableList,
} from "@fortawesome/free-solid-svg-icons";
import TitlePop from "../PopUp/Title/TitlePop";
import Tbody from "./Tbody";
import Pagination from "../Pagination/Pagination";
import { selectProductState } from "../../redux/reducer/ProductsSlide";

function ProductsTable() {
  const { products } = useSelector(selectProductState);

  const [addModalVisible, setAddModelVisible] = useState(false);
  const [sortProducts, setSortProducts] = useState<Product[]>([]);
  const [sortStatus, setSortStatus] = useState("increase");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemPerPage] = useState(5);
  const [newQuantity, setNewQuantity] = useState(5);

  const handleOpenAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setAddModelVisible(true);
  };

  const handleAfterSave = () => {
    totalItem.length % itemsPerPage !== 0
      ? setCurrentPage(totalPage)
      : setCurrentPage(totalPage + 1);
  };

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

  // HANDLE SORT
  const handleSort = () => {
    const sorted = [...products].sort((a, b) => {
      const quantityA = parseInt(a.quantity);
      const quantityB = parseInt(b.quantity);
      return sortStatus === "decrease"
        ? quantityA - quantityB
        : quantityB - quantityA;
    });
    setSortProducts(sorted);
    setSortStatus(sortStatus === "increase" ? "decrease" : "increase");
    setCurrentPage(1);
  };

  useEffect(() => {
    setSortProducts(products);
  }, [products]);

  // HANDLE PAGINATION
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const totalItem: Product[] = [...sortProducts];
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const totalPage = Math.ceil(totalItem.length / itemsPerPage);

  const currentItems: Product[] = totalItem.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // ----------------RESET ITEM PER PAGE----------------
  const handleItemPerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewQuantity(parseInt(e.target.value));
  };

  const handleUpdateItemPerPage = () => {
    setItemPerPage(newQuantity);
    setCurrentPage(1);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  return (
    <>
      <div className="action-body">
        {/* ==================OTHER FUNCTION================== */}
        <div className="action-buttons">
          <button className="add-btn" onClick={handleOpenAdd}>
            <FontAwesomeIcon icon={faPlus} />
            adding
          </button>
          <button className="sort-btn" onClick={handleSort}>
            {sortStatus === "increase" ? (
              <FontAwesomeIcon icon={faArrowUpShortWide} />
            ) : (
              <FontAwesomeIcon icon={faArrowUpWideShort} />
            )}
          </button>
          <TitlePop title="Sort list by quantity" className="sort-title" />

          <button
            className="set-total-item-btn"
            onClick={handleUpdateItemPerPage}
          >
            <FontAwesomeIcon icon={faTableList} />
          </button>
          <TitlePop
            title="Reset total visible items per page"
            className="visible-title"
          />
          <div className="select-quantity">
            <select
              name="rate"
              value={newQuantity}
              onChange={handleItemPerPage}
            >
              <option value="5">Visible 5 items</option>
              <option value="7">Visible 7 items</option>
              <option value="10">Visible 10 items</option>
              <option value="15">Visible 15 items</option>
            </select>
          </div>
        </div>

        {/* ==================SEARCH================== */}
        <div className="search-action">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <input
            type="text"
            placeholder="Search products..."
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

      {/* ==================TABLE================== */}
      <table className="products-table">
        <thead>
          <tr>
            <th>id</th>
            <th>name</th>
            <th>image</th>
            <th>price</th>
            <th>quantity</th>
            <th>cat breed</th>
            <th>age</th>
            <th>color</th>
            <th>sales</th>
            <th>status</th>
            <th>action</th>
          </tr>
        </thead>
        <Tbody currentItems={currentItems} filterVal={filterVal} />
      </table>

      <Pagination
        mode="full"
        totalPage={totalPage}
        onPageChange={handlePageChange}
        currentPage={currentPage}
      />

      {addModalVisible &&
        createPortal(
          <AddingPop
            onSubmitSuccess={handleAfterSave}
            mode="add"
            onCancle={() => setAddModelVisible(false)}
            onClose={() => {}}
          />,
          document.body
        )}
    </>
  );
}

export default ProductsTable;
