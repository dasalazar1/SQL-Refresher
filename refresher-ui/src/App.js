import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import Transfer from "./Transfer";
import Status from "./Status";

class App extends Component {
  
  
  render() {
    return (
      <HashRouter>
        <div>
            <h1>Transfer to RDN</h1>
            <ul className="header">
              <li><NavLink exact to="/">Transfer</NavLink></li>
              <li><NavLink to="/status" replace>Status</NavLink></li>
            </ul>
            <div className="content">
            <Route exact path="/" component={Transfer}/>
            <Route path="/status" component={Status}/>
            </div>
        </div>
      </HashRouter>

    );
  }
}

export default App;
