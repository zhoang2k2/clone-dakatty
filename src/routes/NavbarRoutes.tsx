import { Route, Switch } from "react-router-dom";
import Shop from "../components/Shop/Shop";

import DefaultHome from "../components/DefaultHome/DefaultHome";

function NavbarRoutes() {
  return (
    <>
      <Switch>
        <Route exact path={"/"} component={DefaultHome} />
        <Route exact path={"/homepage"} component={DefaultHome} />
        <Route exact path={"/shop"} component={Shop} />
      </Switch>
    </>
  );
}

export default NavbarRoutes;
