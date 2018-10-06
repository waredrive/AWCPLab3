import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');

export default class App extends Component {

	render() {
		return (
			<BrowserRouter basename={baseUrl}>
				<h1>HELLO!</h1>
			</BrowserRouter>
		);
	}
}
