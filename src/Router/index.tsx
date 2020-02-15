import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Maze from "src/components/main/Maze";
import { RoutePath } from "./routes";

const routes = [
  {
    routePath: RoutePath.MAZE,
    component: <Maze />
  }
];

const App = () => {
  return (
    <Router>
      <Switch>
        {routes.map(route => (
          <Route key={route.routePath} path={route.routePath}>
            {route.component}
          </Route>
        ))}
        <Route path="*">{() => <Redirect to={RoutePath.MAZE} />}</Route>
      </Switch>
    </Router>
  );
};

export default App;
