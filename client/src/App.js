import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";

const App = () => (
  <Router>
    <Fragment>
      <Navbar />
      <Route path="/" exact component={Landing} />
      <section className="container">
        <Switch>
          <Route path="/register" exact component={Register} />
          <Route path="/login" exact component={Login} />
        </Switch>
      </section>
    </Fragment>
  </Router>
);

export default App;
