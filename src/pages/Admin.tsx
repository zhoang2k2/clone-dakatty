import Sidebar from "../components/Sidebar/Sidebar";
import SidebarRoutes from "../routes/SidebarRoutes";
import "../components/Body/body.scss";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  fetchAuthAccount,
  selectAuthAccountState,
} from "../redux/reducer/AuthAccountSlides";
import { useEffect, useState } from "react";

function Admin() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dispatch = useDispatch<any>();
  const history = useHistory();
  const { currentAccount } = useSelector(selectAuthAccountState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentAccount.email === "" && currentAccount.password === "") {
      dispatch(fetchAuthAccount()).then(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [currentAccount, dispatch]);

  useEffect(() => {
    if (
      !isLoading &&
      (currentAccount.email === "" || currentAccount.password === "")
    ) {
      history.push("/");
    }
  }, [currentAccount, history, isLoading]);

  return (
    <>
      <Sidebar />
      <div className="body-container">
        <div className="body">
          <SidebarRoutes />
        </div>
      </div>
    </>
  );
}

export default Admin;
