import React, { Component } from 'react';

import Spinner from '../../components/Spinner/Spinner';
import DepartureGroup from './DepartureGroup/DepartureGroup';
import SearchResultToolbar from '../../components/SearchResultToolbar/SearchResultToolbar';

class SearchResults extends Component {
	state = {
		isLoading: false,
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
				const latestUpdate = response.ResponseData.LatestUpdate;
				this.setState({
					results: results,
					isLoading: false,
					latestUpdate: latestUpdate
				});
			})
			.catch(err => {
				this.props.history.push('/error');
				console.log(err);
			});
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
						/>
						{Object.keys(this.state.results).map(transportGroup => {
							return !this.state.hide[transportGroup] ? (
								<DepartureGroup
									key={transportGroup}
									transportType={transportGroup}
									departures={this.state.results[transportGroup]}
								/>
							) : null;
						})}
					</div>
				)}
			</React.Fragment>
		);
	}
}

export default SearchResults;
