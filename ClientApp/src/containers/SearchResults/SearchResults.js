import React, { Component } from 'react';

class SearchResults extends Component {
	state = {
		search: {
			isLoading: false,
			isCompleted: false,
			results: {}
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
		updatedSearch.isLoading = false;
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
				updatedSearch.isLoading = false;
				updatedSearch.isCompleted = true;
				updatedSearch.results = results;
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
		console.log(nextState.search.results !== this.state.search.results);
		return (
			nextProps.match.params.stationId !== this.props.match.params.stationId
		);
	}

	componentDidUpdate() {
		this.fetchFromApi(this.props.match.params.stationId);
	}

	render() {
		if (this.state.isCompleted) {
			// console.log(this.state.search.results)
			// console.log(Object.keys(this.state.search.results))
		}
		return (
			<p>Hi</p>
			// Object.keys(this.state.search.results).forEach(transportGroup => {
			//     <p>{this.state.search.results[transportGroup]}</p>

			// })
		);
	}
}

export default SearchResults;
