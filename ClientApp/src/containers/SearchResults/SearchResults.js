import React, { Component } from 'react';

import Spinner from '../../components/Spinner/Spinner';
import DepartureGroup from './DepartureGroup/DepartureGroup';
import './SearchResults.css';

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
		this.showAllTransportGroups();
	}

	showAllTransportGroups = () => {
		let hidden = Object.keys(this.state.hide).map(k => (k = false));
		this.setState({ hide: hidden });
	};

	hideTransportGroups = transportType => {
		let hidden = { ...this.state.hide };
		hidden[transportType] = !hidden[transportType];
		this.setState({ hide: hidden });
	};

	render() {
		return (
			<React.Fragment>
				{this.state.isLoading ? (
					<Spinner />
				) : (
					<div>
						<div className="btn-toolbar btn-lg d-flex justify-content-end pr-0 pb-2">
							<button
								className="btn btn-primary mr-1"
								onClick={() =>
									this.fetchFromApi(this.props.match.params.stationId)
								}
							>
								Updated: ADD TIME STAMP
								<i className="fa fa-refresh fa-lg ml-2" />
							</button>
							<button
								className="btn btn-danger btn-lg ml-1"
								onClick={() => this.props.history.push('/')}
							>
								<i className="fa fa-trash fa-lg" />
							</button>
						</div>
						<div className="bg-dark rounded mb-3 pr-md-0 text-center text-white align-self-center">
							<h3 className="p-2">
								{this.props.match.params.stationName.replace(/_/g, ' / ')}
							</h3>
						</div>
						{Object.keys(this.state.results).length > 1 ? (
							<div className="bg-dark rounded mb-3 h5 d-flex justify-content-center py-2 text-light">
								<ul className="nav nav-pills nav-filter">
									<li className="nav-item" key="all">
										<a
											className={
												Object.keys(this.state.hide).every(
													k => !this.state.hide[k]
												)
													? 'nav-link filter active'
													: 'nav-link filter'
											}
											onClick={this.showAllTransportGroups}
										>
											SHOW ALL
										</a>
									</li>
									{Object.keys(this.state.results).map(transportType => {
										return (
											<li className="nav-item ml-2" key={transportType}>
												<a
													className={
														!this.state.hide[transportType]
															? 'nav-link filter active'
															: 'nav-link filter'
													}
													onClick={() => {
														this.hideTransportGroups(transportType);
													}}
												>
													{transportType}
												</a>
											</li>
										);
									})}
								</ul>
							</div>
						) : null}
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
