import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { ListGroup, ListGroupItem, Button } from 'react-bootstrap';

import DepartureDetails from '../DepartureDetails/DepartureDetails';
import Spinner from '../../../components/Spinner/Spinner';

class DepartureItem extends Component {
	state = {
		intermediateStops: {},
		isLoading: false,
		showDetails: false
	};

	// componentDidMount() {
	// 	var req = require.context('../../../assets/images', false, /.*\.png$/);
	// 	req.keys().forEach(function(key) {
	// 		req(key);
	// 	});
	// 	console.log(req);
	// }

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
				// console.log('1', response);
				if (response.status !== 'success' || !response.data) {
					// console.log('2', response);
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
				// console.log('3', response);
			})
			.catch(err => {
				// console.log('4', err);
			});
	};

	onDepartureClickHandler = () => {
		if (Object.keys(this.state.intermediateStops).length !== 3) {
			this.fetchFromApi(
				this.props.match.params.stationId,
				this.props.departure
			);
		}
		const showDetails = !this.state.showDetails;
		this.setState({ showDetails: showDetails });
	};

	render() {
		return (
			<ListGroup>
				<Button
					href=""
					bsSize="large"
					bsStyle="info"
					block
					onClick={e => {
						e.preventDefault();
						this.onDepartureClickHandler();
					}}
				>
					<img
						src={require('../../../assets/images/' +
							this.props.departure.TransportMode +
							'.png')}
						alt={this.props.departure.TransportMode}
						style={{ width: '40px' }}
					/>
					<h4>{`${this.props.departure.StopAreaName} - ${
						this.props.departure.Destination
					}`}</h4>
				</Button>
				{this.state.showDetails ? (
					this.state.isLoading ||
					Object.keys(this.state.intermediateStops).length !== 3 ? (
						<Spinner />
					) : (
						<ListGroupItem>
							<DepartureDetails
								intermediateStops={this.state.intermediateStops}
							/>
						</ListGroupItem>
					)
				) : null}
			</ListGroup>
		);
	}
}

export default withRouter(DepartureItem);
