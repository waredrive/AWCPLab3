import React, { Component } from 'react';
import {Alert} from 'react-bootstrap';

export default class App extends Component {
  displayName = App.name

  render() {
    return (
      <React.Fragment>
      <Alert bsStyle="danger">THIS IS A HEADER!!!!</Alert>
      </React.Fragment>
    );
  }
}
