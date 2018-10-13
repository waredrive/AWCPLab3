import React, { Component } from 'react';

import Spinner from '../../components/Spinner/Spinner';

class SearchResults extends Component {
	state = {
		isLoading: false,
		results: {},
		latestUpdate: null
	};

	fetchFromApi(stationId) {
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
				if (response.StatusCode !== 0 && !response.ResponseData) {
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
				console.log(response);
			})
			.catch(err => {
				this.props.history.push('/error');
				console.log(err);
			});
	}

	testreload = () => {
		console.log('yey');
		this.fetchFromApi(this.props.match.params.stationId);
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
						{Object.keys(this.state.results).map(transportGroup => {
							return <p key={transportGroup}>{transportGroup}</p>;
						})}
						<button onClick={this.testreload}>TEST ME</button>
					</div>
				)}
			</React.Fragment>
		);
	}
}

export default SearchResults;
