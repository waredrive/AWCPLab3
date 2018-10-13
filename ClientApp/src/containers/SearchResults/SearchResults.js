import React, { Component } from 'react';

import Spinner from '../../components/Spinner/Spinner';
import DepartureGroup from './DepartureGroup/DepartureGroup';

class SearchResults extends Component {
	state = {
		isLoading: false,
		results: {},
		latestUpdate: null,
		// transportTypes: []
	};

	fetchFromApi = stationId => {
		const possibleTransportTypes = [
			'Metros',
			'Buses',
			'Trains',
			'Trams',
			'Ships'
		];

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
				// let transportTypes = [];
				let results = Object.keys(response.ResponseData).reduce((obj, k) => {
					possibleTransportTypes.forEach(element => {
						if (k === element && response.ResponseData[k].length > 0) {
							obj[k] = response.ResponseData[k];
							// transportTypes.push(k);
						}
					});
					return obj;
				}, {});
				const latestUpdate = response.ResponseData.LatestUpdate;
				this.setState({
					// transportTypes: transportTypes,
					results: results,
					isLoading: false,
					latestUpdate: latestUpdate
				});
				console.log(this.state)
				// console.log(response);
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
		if (
			prevProps.match.params.stationId === this.props.match.params.stationId
		) {
			return;
		}
		this.fetchFromApi(this.props.match.params.stationId);
	}

	render() {
		return (
			<React.Fragment>
				{this.state.isLoading ? (
					<Spinner />
				) : (
					<div>
						<h2>{this.props.match.params.stationName.replace(/_/g, ' / ')}</h2>
						<button
							onClick={() =>
								this.fetchFromApi(this.props.match.params.stationId)
							}
						>
							UPDATE
						</button>
						{/* <div>
						{Object.keys(this.state.results).map(transportType => {
							return <button key={transportType}>{transportType}</button>
						})}
						</div> */}
						<button onClick={() => this.props.history.push('/')}>CLEAR</button>
						{Object.keys(this.state.results).map(transportGroup => {
							return (
								<DepartureGroup
									key={transportGroup}
									transportType={transportGroup}
									departures={this.state.results[transportGroup]}
								/>
							);
						})}
					</div>
				)}
			</React.Fragment>
		);
	}
}

export default SearchResults;
