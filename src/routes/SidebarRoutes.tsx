/* eslint-disable @typescript-eslint/no-explicit-any */
import { Route, Switch, useRouteMatch } from "react-router-dom";
import ProductsTable from "../components/ProductTable/ProductsTable";
import AdminAccounts from "../components/Accounts/Accounts";
import Orders from "../components/Orders/Orders";

function SidebarRoutes() {
  const { path } = useRouteMatch();

  return (
    <>
      <Switch>
        <Route exact path={`${path}/`} component={ProductsTable} />
        <Route exact path={`${path}/accounts`} component={AdminAccounts} />
        <Route exact path={`${path}/orders`} component={Orders} />
      </Switch>
    </>
  );
}

export default SidebarRoutes;
