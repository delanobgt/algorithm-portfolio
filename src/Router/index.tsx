import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import styled from "styled-components";

const CenterItAll = styled.div`
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
`;

const routes = [
  {
    routePath: RoutePath.Maze,
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
