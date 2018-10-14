import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

import Spinner from '../../components/Spinner/Spinner';
import DepartureGroup from './DepartureGroup/DepartureGroup';

class SearchResults extends Component {
	state = {
		isLoading: false,
		results: {},
		latestUpdate: null,
		hide: {Metros: false, Buses: false, Trains: false, Trams: false, Ships: false}
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
		this.hideTransportGroup('All');
	}

	hideTransportGroup = (transportType) => {
		let hidden;

		if(transportType === 'All'){
			hidden = Object.keys(this.state.hide).map(k => k = false)
		} else{
			hidden = {...this.state.hide}
			hidden[transportType] = !hidden[transportType];
		}
		this.setState({hide: hidden})
	}

	render() {
		return (
			<React.Fragment>
				{this.state.isLoading ? (
					<Spinner />
				) : (
					<div>
						<h2>{this.props.match.params.stationName.replace(/_/g, ' / ')}</h2>
						<Button bsStyle='primary' bsSize='large'
							onClick={() =>
								this.fetchFromApi(this.props.match.params.stationId)
							}
						>
							UPDATE
						</Button>
						<Button bsStyle='danger' bsSize='large' onClick={() => this.props.history.push('/')}>CLEAR</Button>
						<div>
						{['All', ...Object.keys(this.state.results)].map(transportType => {
							return <Button onClick={() =>{this.hideTransportGroup(transportType)}} key={transportType}>{transportType}</Button>
						})}
						</div>
						{Object.keys(this.state.results).map(transportGroup => {
							return (
								!this.state.hide[transportGroup] ?
								<DepartureGroup
									key={transportGroup}
									transportType={transportGroup}
									departures={this.state.results[transportGroup]}
								/> : null
							);
						})}
					</div>
				)}
			</React.Fragment>
		);
	}
}

export default SearchResults;
