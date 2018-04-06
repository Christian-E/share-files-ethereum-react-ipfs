import React, { Component } from 'react';
import './App.css';
import Main from './Main';
import NewMessageForm from './NewMessageForm';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class App extends Component {

  

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Main} />
          <Route path="/new" component={NewMessageForm} />
        </div>
      </Router>
    );
  }
}

export default App;
