import React, { Component } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { withRouter } from 'react-router-dom';
import { FormGroup, InputGroup, Button } from 'react-bootstrap';

class SearchBar extends Component {
	state = {
		searchResults: [],
		searchHistoryStorage: [],
		searchMinLength: 3,
		isLoading: false,
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

	clearSearch = () => {
		this.typeahead.getInstance().clear();
		this.setState({ touched: false });
	};
	searchSelectedStation = station => {
		if (station.length !== 1) {
			return;
		}
		this.addToSearchHistory(station[0]);
		this.props.history.push(
			`/${encodeURIComponent(station[0].Name.replace(/\//g, '_'))}/${
				station[0].SiteId
			}`
		);
		this.clearSearch();
		this.typeahead.getInstance().blur();
	};

	fetchFromApi = query => {
		this.setState({ loading: true });
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
							.includes(query.toLowerCase().trim()) ||
						val.SiteId.trim().includes(query.trim())
				);
				this.setState({
					isLoading: false,
					searchResults: filteredResponse
				});
			})
			.catch(err => console.log(err));
	};

	fetchFromSessionStorage = () => {
		const searchHistory = [...this.state.searchHistoryStorage];
		const minLength = this.state.searchHistoryStorage.length > 0 ? 0 : 3;
		this.setState({ searchResults: searchHistory, searchMinLength: minLength });
	};

	onFocusHandler = () => {
		if (this.state.touched || !this.typeahead.state.query.length === 0) {
			return;
		}
		console.log(this.typeahead);
		this.setState({ touched: true });
		this.fetchFromSessionStorage();
	};

	render() {
		return (
			<FormGroup style={{ width: '80%', margin: '10px auto' }}>
				<InputGroup>
					<AsyncTypeahead
						isLoading={this.state.isLoading}
						selectHintOnEnter
						highlightOnlyResult
						bsSize="large"
						minLength={this.state.searchMinLength}
						placeholder="Station..."
						filterBy={option => option.Name}
						labelKey="Name"
						useCache={false}
						options={this.state.searchResults}
						onFocus={this.onFocusHandler}
						onChange={selected => this.searchSelectedStation(selected)}
						onSearch={query => {
							query.trim().length > 2
								? this.fetchFromApi(query)
								: this.fetchFromSessionStorage();
						}}
						ref={ref => (this.typeahead = ref)}
					/>
					<InputGroup.Button>
						<Button bsSize="large" onClick={this.clearSearch}>
							Clear
						</Button>
					</InputGroup.Button>
				</InputGroup>
			</FormGroup>
		);
	}
}

export default withRouter(SearchBar);
