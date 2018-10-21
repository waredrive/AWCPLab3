import React, { Component } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { withRouter } from 'react-router-dom';
import { FormGroup, InputGroup, Button } from 'react-bootstrap';

class SearchBar extends Component {
	state = {
		searchResults: [],
		searchHistoryStorage: [],
		searchMinLength: 3,
		searchEmptyLabel: 'No stations were found.',
		isNoMatch: false,
		isLoading: false,
		isError: false,
		touched: false
	};

	componentWillMount() {
		const history = this.getSearchHistory();
		this.setState({ searchHistoryStorage: history });
	}

	getSearchHistory() {
		let storage = [];
		if (sessionStorage) {
			if (sessionStorage.getItem('searchHistory')) {
				storage = JSON.parse(sessionStorage.getItem('searchHistory'));
			}
		}
		return storage;
	}

	addToSearchHistory = station => {
		let storage = [...this.state.searchHistoryStorage];

		if (sessionStorage) {
			if (!storage.some(s => s.Name === station.Name)) {
				storage.unshift(station);
			}
			if (storage.length > 5) {
				storage.pop();
			}
			this.setState({ searchHistoryStorage: storage });
			sessionStorage.setItem('searchHistory', JSON.stringify(storage));
		}
	};

	onClearSearchButtonClickHandler = () => {
		this.typeahead.getInstance().clear();
		this.typeahead.getInstance().focus();
		this.setState({ touched: false, isNoMatch: false });
	};

	searchSelectedStation = station => {
		if (station.length !== 1) {
			return;
		}
		this.addToSearchHistory(station[0]);
		this.props.history.push(`/${encodeURIComponent(station[0].Name.replace(/\//g, '_'))}/${station[0].SiteId}`);
		this.onClearSearchButtonClickHandler();
		this.typeahead.getInstance().blur();
	};

	fetchFromApi = query => {
		this.setState({ isLoading: true });
		fetch('api/typeahead/' + query, {
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
				let filteredResponse = response.ResponseData.filter(
					val =>
						val.Name.toLowerCase()
							.trim()
							.includes(query.toLowerCase().trim()) || val.SiteId.trim().includes(query.trim())
				);
				let isEmpty = filteredResponse.length === 0;

				this.setState({
					isLoading: false,
					searchResults: filteredResponse,
					isNoMatch: isEmpty
				});
			})
			.catch(err => {
				this.setState({
					isLoading: false,
					isError: true,
					searchEmptyLabel: 'An Error has occurred while fetching data from SL. Please try again.',
					isNoMatch: true
				});
			});
	};

	fetchFromSessionStorage = () => {
		const searchHistory = [...this.state.searchHistoryStorage];
		const minLength = this.state.searchHistoryStorage.length > 0 ? 0 : 3;
		this.setState({ searchResults: searchHistory, searchMinLength: minLength });
	};

	onInputChangeHandler = e => {
		if (e.length < 3) {
			this.fetchFromSessionStorage();
			this.setState({ isNoMatch: false });
		}
	};

	onFocusHandler = () => {
		if (this.state.touched || !this.typeahead.state.query.length === 0) {
			return;
		}
		this.setState({ touched: true });
		this.fetchFromSessionStorage();
	};

	render() {
		return (
			<FormGroup className="input-group mt-1" validationState="error">
				<InputGroup>
					<AsyncTypeahead
						isInvalid={this.state.isNoMatch}
						isLoading={false}
						selectHintOnEnter
						highlightOnlyResult
						bsSize="large"
						minLength={this.state.searchMinLength}
						placeholder="From station..."
						emptyLabel={this.state.searchEmptyLabel}
						filterBy={option => option.Name}
						labelKey="Name"
						useCache={false}
						options={this.state.searchResults}
						onFocus={this.onFocusHandler}
						onChange={selected => this.searchSelectedStation(selected)}
						onInputChange={e => {
							this.onInputChangeHandler(e);
						}}
						onSearch={query => {
							query.trim().length > 2 ? this.fetchFromApi(query) : this.fetchFromSessionStorage();
						}}
						ref={ref => (this.typeahead = ref)}
					/>
					<InputGroup.Button className="input-group-append">
						<Button
							className="btn btn-light btn-lg rounded-right"
							style={this.state.isNoMatch ? { backgroundColor: '#dc3545', borderColor: 'red', color: 'white' } : null}
							onClick={this.onClearSearchButtonClickHandler}
						>
							{this.state.isLoading ? (
								<i className="fa fa-circle-o-notch fa-spin fa-fw" />
							) : (
								<i className="fa fa-close fa-fw" />
							)}
						</Button>
					</InputGroup.Button>
				</InputGroup>
			</FormGroup>
		);
	}
}

export default withRouter(SearchBar);
