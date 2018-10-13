import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import DepartureDetails from '../DepartureDetails/DepartureDetails';

class DepartureItem extends Component {
	state = {
		intermediateStops: {},
		isLoading: false,
		hideDetails: true
	};

	formatTime = i => {
		if (i < 10) {
			i = '0' + i;
		}
		return i;
	};

	fetchFromApi = (originId, departure) => {
		const transportTypesIds = {
			METRO: '2',
			BUS: '8',
			TRAIN: '1',
			TRAM: '4',
			SHIP: '96'
		};
		const stationCategories = ['StartStation', 'MiddleStations', 'EndStation'];
		const date = new Date();
		const params =
			`${originId}/` +
			`${encodeURI(departure.Destination)}/` +
			`${transportTypesIds[departure.TransportMode]}/` +
			`${departure.LineNumber}/` +
			`${departure.TimeTabledDateTime.replace(/:/g, '_')}/` +
			`${this.formatTime(date.getHours())}_${this.formatTime(
				date.getMinutes()
			)}`;

		this.setState({ isLoading: true });
		if (Object.keys(this.state.intermediateStops).length === 3) {
			return;
		} else {
			fetch('api/stops/' + params, {
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
					console.log('1', response);
					if (response.status !== 'success' || !response.data) {
						console.log('2', response);
						throw Error(response);
					}

					let results = Object.keys(response['data']).reduce((obj, k) => {
						stationCategories.forEach(element => {
							if (k === element) {
								obj[k] = response['data'][k];
							}
						});
						return obj;
					}, {});

					this.setState({
						intermediateStops: results,
						isLoading: false
					});
					console.log('3', response);
				})
				.catch(err => {
					console.log('4', err);
				});
		}
	};

	render() {
		console.log(this.state.intermediateStops);
		return (
			<p
				onClick={() =>
					this.fetchFromApi(
						this.props.match.params.stationId,
						this.props.departure
					)
				}
			>
				{this.props.departure.Destination}
			</p>
		);
	}
}

export default withRouter(DepartureItem);
