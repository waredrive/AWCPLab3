import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import DepartureDetails from '../DepartureDetails/DepartureDetails';
import Spinner from '../../../components/Spinner/Spinner';
import './DepartureItem.css';

class DepartureItem extends Component {
	state = {
		intermediateStops: {},
		isLoading: false,
		isError: false,
		showDetails: false
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
			`${this.formatTime(date.getHours())}_${this.formatTime(date.getMinutes())}`;

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
				if (response.status !== 'success' || !response.data) {
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
			})
			.catch(err => {
				this.setState({
					isLoading: false,
					isError: true
				});
			});
	};

	onDepartureClickHandler = () => {
		if (Object.keys(this.state.intermediateStops).length !== 3) {
			this.fetchFromApi(this.props.match.params.stationId, this.props.departure);
		}
		const showDetails = !this.state.showDetails;
		this.setState({ showDetails: showDetails });
	};

	render() {
		return (
			<div className="panel-group">
				<div className="panel panel-default">
					<div className="panel-heading">
						<h6 className="panel-title">
							<button
								className="btn btn-light btn-block d-flex justify-content-between align-items-center"
								onClick={e => {
									e.preventDefault();
									this.onDepartureClickHandler();
								}}
							>
								<span className="d-flex justify-content-start align-items-center text-left">
									<img
										className="mr-2 mr-md-3"
										style={{ width: '40px' }}
										src={require('../../../assets/images/' + this.props.departure.TransportMode + '.png')}
										alt={this.props.departure.TransportMode}
									/>
									<h5>
										<span className="badge badge-info badge-pill mr-2 mr-md-5" style={{ width: '90px' }}>
											Line:
											{this.props.departure.LineNumber}
										</span>
									</h5>
									<span className="h5 text-dark">
										{this.props.departure.StopAreaName} {' - '}
										{this.props.departure.Destination}
									</span>
								</span>
								<span className="d-flex justify-content-end align-items-center">
									{this.props.departure.DisplayTime.indexOf(':') > -1 ? (
										<span className="badge badge-danger badge-pill ml-1 ml-md-4 font-weight-normal">
											NOT <br /> REAL TIME
										</span>
									) : null}
									<span className="font-weight-bold ml-1 ml-md-4 h5">{this.props.departure.DisplayTime}</span>
								</span>
							</button>
						</h6>
						{this.state.showDetails ? (
							this.state.isLoading || Object.keys(this.state.intermediateStops).length !== 3 ? (
								<Spinner />
							) : (
								<DepartureDetails intermediateStops={this.state.intermediateStops} />
							)
						) : null}
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(DepartureItem);
