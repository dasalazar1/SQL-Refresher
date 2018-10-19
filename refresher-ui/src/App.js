import React, { Component } from "react";
import "./App.css";
import { Route, NavLink, HashRouter } from "react-router-dom";
import Transfer from "./Transfer";
import Status from "./Status";

class App extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <h1>Transfer to RDN</h1>
          <ul className="header">
            <li>
              <NavLink exact to="/">
                Transfer
              </NavLink>
            </li>
            <li>
              <NavLink to="/status/0" replace>
                Status
              </NavLink>
            </li>
          </ul>
          <div className="content">
            <Route exact path="/" component={Transfer} />
            <Route path="/status/:id" component={Status} />
          </div>
        </div>
      </HashRouter>
    );
  }
}

export default App;
