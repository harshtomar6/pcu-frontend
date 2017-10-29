import React, { Component } from 'react';
import './App.css';
import Header from './components/header.component/header';
import Content from './components/content.component/content';
let config = require('./config');

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Content />
      </div>
    );
  }
}

export default App;
