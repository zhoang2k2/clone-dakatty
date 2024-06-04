import { useEffect, useState, type ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAccounts,
  selectAccountState,
} from "../../redux/reducer/AccountsSlide";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPlus,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import "./accounts.scss";
// import Login from "../popUp/LoginSignup/Login";
import { createPortal } from "react-dom";
import SignUp from "../PopUp/LoginSignup/Signup";

import AccountTbody from "./AccountTbody";
import Pagination from "../Pagination/Pagination";
import type { AccountType } from "../../types/AccountType";

function AdminAccounts() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dispatch = useDispatch<any>();
  const { adminAccounts } = useSelector(selectAccountState);

  const [showPopup, setShowPopup] = useState({
    auth: false,
    login: false,
    signup: false,
    confirm: false,
    edit: false,
  });
  const [filterVal, setFilterVal] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [currentItems, setCurrentItems] = useState<AccountType[]>([]);
  const [reset, setReset] = useState(1);

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [reset, dispatch]);

  const handleAddAccount = () => {
    setShowPopup({ ...showPopup, signup: true });
  };

  const handleCloseSignup = () => {
    setShowPopup({ ...showPopup, signup: false });
  };

  // HANDLE SEARCH
  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterVal(e.target.value);
  };
  const handleFilter = () => {
    const filterList = adminAccounts.filter((filtered) => {
      return (
        filtered.fullname.toLowerCase().includes(filterVal.toLowerCase()) ||
        filtered.email.toLowerCase().includes(filterVal.toLowerCase()) ||
        filtered.phone.toLowerCase().includes(filterVal.toLowerCase())
      );
    });
    setCurrentItems(filterList);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (adminAccounts.length > 0) {
      setCurrentItems(adminAccounts);
    }
  }, [adminAccounts]);

  // HANDLE PAGINATION
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const totalItem = [...currentItems];
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPage = Math.ceil(totalItem.length / itemsPerPage);
  const renderItems = totalItem.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <div className="accounts-container">
        <button className="add-btn" onClick={handleAddAccount}>
          <FontAwesomeIcon icon={faPlus} />
          Adding
        </button>

        <div className="search-action">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <input
            type="text"
            placeholder="Search Accounts..."
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

        <table className="accounts-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fullname</th>
              <th>Gender</th>
              <th>Birthday</th>
              <th>Email</th>
              <th>Password</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <AccountTbody currentItems={renderItems} />
        </table>

        <Pagination
          mode="full"
          totalPage={totalPage}
          onPageChange={handlePageChange}
          currentPage={currentPage}
        />
      </div>

      {showPopup.signup &&
        createPortal(
          <SignUp
            mode="on-admin"
            onSubmitSuccess={() => setReset(reset + 1)}
            onCloseModal={handleCloseSignup}
            onChangeMode={() => {}}
          />,
          document.body
        )}
    </>
  );
}

export default AdminAccounts;
