import "./styles/resetStyle.css";
import "./App.css";
import store from "./redux/Store";
import { Provider } from "react-redux";
import { Route, Switch } from "react-router-dom";
import Admin from "./pages/Admin";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Provider store={store}>
      <Switch>
        <Route path="/admin" component={Admin} />
        <Route path="/" component={HomePage} />
        <Route path="*" component={NotFound} />
      </Switch>
    </Provider>
  );
}

export default App;
