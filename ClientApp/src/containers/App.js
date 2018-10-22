import React, { Component } from 'react';
import { Route, HashRouter, Switch } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import SearchBar from '../components/SearchBar/SearchBar';
import WelcomePage from '../components/WelcomePage/WelcomePage';
import SearchResults from './SearchResults/SearchResults';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');

export default class App extends Component {
	render() {
		return (
			<HashRouter basename={baseUrl}>
				<main className="container">
					<div className="row">
						<div className="col-md-12 my-5" style={{ minWidth: '480px' }}>
							<SearchBar />
						</div>
					</div>
					<div className="row">
						<div className="col-md-12" style={{ minWidth: '480px' }}>
							<Switch>
								<Route path="/:stationName/:stationId" component={SearchResults} />
								<Route
									path="/error"
									component={() => (
										<ErrorMessage>An Error has occurred while fetching data from SL. Please try again.</ErrorMessage>
									)}
								/>
								<Route component={WelcomePage} />
							</Switch>
						</div>
					</div>
				</main>
			</HashRouter>
		);
	}
}
