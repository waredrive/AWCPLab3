import React, { Component } from 'react';

import Spinner from '../../components/Spinner/Spinner';

class SearchResults extends Component {
	state = {
		search: {
			isLoading: false,
			results: {},
			LatestUpdate: null
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
				if (!response.ok && !response.ResponseData) {
					throw Error(response);
				}
				return response.json();
			})
			.then(response => {
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
				updatedSearch.LatestUpdate = response.LatestUpdate;
				updatedSearch.isLoading = false;
				this.setState({
					search: updatedSearch
				});
			})
			.catch(err => console.log(err));
	}

	componentDidMount() {
		this.fetchFromApi(this.props.match.params.stationId);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			nextProps.match.params.stationId !== this.props.match.params.stationId ||
			nextState.search.LatestUpdate !== this.state.search.LatestUpdate
		);
	}

	componentDidUpdate() {
		this.fetchFromApi(this.props.match.params.stationId);
	}

	render() {
		return (
			Object.keys(this.state.search.results).map(transportGroup => {
				return <p key={transportGroup}>{transportGroup}</p>;
			})
			// <div>
			// 	{this.state.search.isLoading ? (
			// 		<Spinner />
			// 	) : (
			// 		Object.keys(this.state.search.results).map(transportGroup => {
			// 			return <p key={transportGroup}>{transportGroup}</p>;
			// 		})
			// 	)}
			// </div>
		);
	}
}

export default SearchResults;
