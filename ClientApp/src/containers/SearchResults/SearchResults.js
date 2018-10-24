import React, { Component } from 'react';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import Spinner from '../../components/Spinner/Spinner';
import DepartureGroup from './DepartureGroup/DepartureGroup';
import SearchResultToolbar from '../../components/SearchResultToolbar/SearchResultToolbar';
import WarningMessage from '../../components/WarningMessage/WarningMessage';

const AbortController = window.AbortController;

class SearchResults extends Component {
	controller;

	state = {
		isLoading: false,
		isError: false,
		results: {},
		latestUpdate: null,
		show: {}
	};

	componentDidMount() {
		this.fetchFromApi(this.props.match.params.stationId);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.match.params.stationId === this.props.match.params.stationId) {
			return;
		}
		this.fetchFromApi(this.props.match.params.stationId);
		this.showAllTransportGroups();
	}

	fetchFromApi = stationId => {
		let signal;
		const possibleTransportTypes = ['Metros', 'Buses', 'Trains', 'Trams', 'Ships'];

		if (this.controller !== undefined) {
			this.controller.abort();
		}

		this.controller = new AbortController();
		signal = this.controller.signal;

		this.setState({ isLoading: true });

		fetch('api/search/' + stationId, {
			signal,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		})
			.then(response => {
				if (!response.ok) {
					throw Error(response);
				}
				return response.json();
			})
			.then(response => {
				if (response.StatusCode !== 0 || !response.ResponseData) {
					throw Error(response);
				}
				let results = Object.keys(response.ResponseData).reduce((obj, k) => {
					possibleTransportTypes.forEach(element => {
						if (k === element && response.ResponseData[k].length > 0) {
							obj[k] = response.ResponseData[k];
						}
					});
					return obj;
				}, {});
				const latestUpdate = new Date(response.ResponseData.LatestUpdate);
				const updated = `${this.formatTime(latestUpdate.getHours())}:${this.formatTime(latestUpdate.getMinutes())}`;

				const transportTypes = this.getTransportTypesToShow(results);

				this.setState({
					results: results,
					isLoading: false,
					latestUpdate: updated,
					show: transportTypes
				});
			})
			.catch(err => {
				if (err.name === 'AbortError') {
					this.setState({ isLoading: false, isError: false });
					return;
				}
				this.setState({ isLoading: false, isError: true });
				this.props.history.push('/error');
			});
	};

	formatTime = i => {
		if (i < 10) {
			i = '0' + i;
		}
		return i;
	};

	getTransportTypesToShow = results => {
		let transportTypes = {};
		Object.keys(results).map(k => (transportTypes[k] = true));
		return transportTypes;
	};

	showAllTransportGroups = () => {
		let shown = {};
		Object.keys(this.state.show).map(k => (shown[k] = true));
		this.setState({ show: shown });
	};

	showTransportGroups = transportType => {
		let shown = { ...this.state.show };
		if (Object.values(this.state.show).every(v => v)) {
			Object.keys(this.state.show).map(k => (shown[k] = false));
		}
		shown[transportType] = !shown[transportType];
		if (Object.values(shown).every(v => !v)) {
			this.showAllTransportGroups();
			return;
		}
		this.setState({ show: shown });
	};

	updateResults = () => {
		this.fetchFromApi(this.props.match.params.stationId);
	};

	clearResults = () => {
		this.props.history.push('/');
	};

	render() {
		let departureGroups = null;
		if (Object.getOwnPropertyNames(this.state.results).length === 0) {
			departureGroups = <WarningMessage>There are no registered departures from this address.</WarningMessage>;
		} else {
			departureGroups = Object.keys(this.state.results).map(transportGroup => {
				return this.state.show[transportGroup] ? (
					<DepartureGroup
						key={transportGroup}
						transportType={transportGroup}
						departures={this.state.results[transportGroup]}
					/>
				) : null;
			});
		}

		return (
			<React.Fragment>
				{this.state.isLoading ? (
					<Spinner />
				) : (
					<div>
						<SearchResultToolbar
							searchResults={this.state.results}
							shown={this.state.show}
							stationName={decodeURIComponent(this.props.match.params.stationName.replace(/_/g, ' / '))}
							onUpdateButtonClick={this.updateResults}
							onClearResultsButtonClick={this.clearResults}
							onShowAllTransportGroupsButtonClick={this.showAllTransportGroups}
							onShowTransportGroupsButtonClick={this.showTransportGroups}
							updated={this.state.latestUpdate}
						/>
						{departureGroups}
					</div>
				)}
			</React.Fragment>
		);
	}
}

export default SearchResults;
