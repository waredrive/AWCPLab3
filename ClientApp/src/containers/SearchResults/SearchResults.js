import React, { Component } from 'react';

import Spinner from '../../components/Spinner/Spinner';

class SearchResults extends Component {
	state = {
		search: {
			isLoading: false,
			results: {},
			latestUpdate: null
		}
	};

	fetchFromApi(stationId) {
		const possibleTransportTypes = [
			'Metros',
			'Buses',
			'Trains',
			'Trams',
			'Ships'
		];

		let updatedSearch = { ...this.state.search };
		updatedSearch.isLoading = true;
		this.setState({ search: updatedSearch });

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
				let updatedSearch = { ...this.state.search };
				updatedSearch.results = results;
				updatedSearch.latestUpdate = response.ResponseData.LatestUpdate;
				this.setState({
					search: updatedSearch
				});
			})
			.catch(err => {this.props.history.push('/error'); console.log(err)});

			updatedSearch = { ...this.state.search };
			updatedSearch.isLoading = false;
			this.setState({ search: updatedSearch });
	}

	componentDidMount() {
		this.fetchFromApi(this.props.match.params.stationId);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			nextProps.match.params.stationId !== this.props.match.params.stationId ||
			nextState.search.latestUpdate !== this.state.search.latestUpdate
		);
	}

	componentDidUpdate() {
		this.fetchFromApi(this.props.match.params.stationId);
	}

	render() {
		console.log(this.state.search.results);
		return (
			<div>
				{this.state.search.isLoading ? (
					<Spinner />
				) : (
					Object.keys(this.state.search.results).map(transportGroup => {
						return <p key={transportGroup}>{transportGroup}</p>;
					})
				)}
			</div>
		);
	}
}

export default SearchResults;
