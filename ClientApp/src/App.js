import React, { Component } from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';

import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import SearchBar from './components/SearchBar/SearchBar';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');

export default class App extends Component {
	render() {
		return (
			<BrowserRouter basename={baseUrl}>
				<SearchBar />
				{/* <Switch>
					<Route path="/:stationName/:stationId" component={SearchResults} />
					<Route path="/error" component={() => {return <ErrorMessage message="An Error has occurred while fetching data from SL. Please try again."/>}} />
					<Route component={WelcomePage} />
				</Switch> */}
			</BrowserRouter>
		);
	}
}
