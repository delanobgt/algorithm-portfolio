import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { RoutePath } from "./routes";
import Convex from "src/components/main/Convex";
import Maze from "src/components/main/Maze";
import Menu from "src/components/main/Menu";

const routes = [
  {
    routePath: RoutePath.MAZE,
    component: <Maze />
  },
  {
    routePath: RoutePath.MENU,
    component: <Menu />
  },
  {
    routePath: RoutePath.CONVEX,
    component: <Convex />
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
        <Route path="*">{() => <Redirect to={RoutePath.MENU} />}</Route>
      </Switch>
    </Router>
  );
};

export default App;
