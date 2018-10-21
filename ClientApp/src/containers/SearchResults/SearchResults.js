import React, { Component } from 'react';

import Spinner from '../../components/Spinner/Spinner';
import DepartureGroup from './DepartureGroup/DepartureGroup';
import SearchResultToolbar from '../../components/SearchResultToolbar/SearchResultToolbar';
import WarningMessage from '../../components/WarningMessage/WarningMessage';

class SearchResults extends Component {
	state = {
		isLoading: false,
		isError: false,
		results: {},
		latestUpdate: null,
		hide: {
			Metros: false,
			Buses: false,
			Trains: false,
			Trams: false,
			Ships: false
		}
	};

	componentDidMount() {
		this.fetchFromApi(this.props.match.params.stationId);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.match.params.stationId === this.props.match.params.stationId) {
			return;
		}
		this.fetchFromApi(this.props.match.params.stationId);
		this.onShowAllTransportGroupsButtonClickHandler();
	}

	formatTime = i => {
		if (i < 10) {
			i = '0' + i;
		}
		return i;
	};

	fetchFromApi = stationId => {
		const possibleTransportTypes = ['Metros', 'Buses', 'Trains', 'Trams', 'Ships'];

		this.setState({ isLoading: true });

		fetch('api/search/' + stationId, {
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
				this.setState({
					results: results,
					isLoading: false,
					latestUpdate: updated
				});
			})
			.catch(err => {
				this.setState({ isLoading: false, isError: true });
				this.props.history.push('/error');
			});
	};

	onShowAllTransportGroupsButtonClickHandler = () => {
		let hidden = Object.keys(this.state.hide).map(k => (k = false));
		this.setState({ hide: hidden });
	};

	onHideTransportGroupsButtonClickHandler = transportType => {
		let hidden = { ...this.state.hide };
		hidden[transportType] = !hidden[transportType];
		this.setState({ hide: hidden });
	};

	onUpdateButtonClickHandler = () => {
		this.fetchFromApi(this.props.match.params.stationId);
	};

	onClearResultsButtonClickHandler = () => {
		this.props.history.push('/');
	};

	render() {
		let departureGroups = null;
		if (Object.getOwnPropertyNames(this.state.results).length === 0) {
			departureGroups = <WarningMessage>There are no registered departures from this address.</WarningMessage>;
		} else {
			departureGroups = Object.keys(this.state.results).map(transportGroup => {
				return !this.state.hide[transportGroup] ? (
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
							hidden={this.state.hide}
							stationName={this.props.match.params.stationName.replace(/_/g, ' / ')}
							onUpdateButtonClick={this.onUpdateButtonClickHandler}
							onClearResultsButtonClick={this.onClearResultsButtonClickHandler}
							onShowAllTransportGroupsButtonClick={this.onShowAllTransportGroupsButtonClickHandler}
							onHideTransportGroupsButtonClick={this.onHideTransportGroupsButtonClickHandler}
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
