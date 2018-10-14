import React, { Component } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { withRouter } from 'react-router-dom';

class SearchBar extends Component {
	state = {
		typeaheadSettings: {
			selectHintOnEnter: true,
			highlightOnlyResult: true,
			isLoading: false,
			bsSize: 'large',
			options: [],
			minLength: 3,
			filterBy: option => option.Name,
			labelKey: 'Name'
		},
		sessionStorage: []
	};

	getSearchHistory() {
        if (sessionStorage) {
            if (sessionStorage.getItem('searchHistory')) {
                return JSON.parse(sessionStorage.getItem('searchHistory'));
            }
        }
	}
	
	searchSelectedStation = station => {
		if (station.length !== 1) {
			return;
		}
		this.props.history.push(
			`/${encodeURIComponent(station[0].Name.replace(/\//g, '_'))}/${
				station[0].SiteId
			}`
		);
	};

	fetchFromApi = query => {
		let updatedTypeahead = { ...this.state.typeaheadSettings };
		updatedTypeahead.isLoading = true;
		this.setState({ typeaheadSettings: updatedTypeahead });
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
				let updatedTypeahead = { ...this.state.typeaheadSettings };
				let filteredResponse = response.ResponseData.filter(
					val =>
						val.Name.toLowerCase()
							.trim()
							.includes(query.toLowerCase().trim()) ||
						val.SiteId.trim().includes(query.trim())
				);
				updatedTypeahead.isLoading = false;
				updatedTypeahead.options = filteredResponse;
				this.setState({
					typeaheadSettings: updatedTypeahead
				});
			}).catch(err => console.log(err));
	};

	fetchFromSessionStorage = query => {};

	

	render() {
		return (
			<Fragment>
			<FormGroup validationState={validationState}>
			  <InputGroup>
				<InputGroup.Addon className="input-group-prepend">
				  <span className="input-group-text">
					The capital of {state.name} is
				  </span>
				</InputGroup.Addon>
				<AsyncTypeahead
				{...this.state.typeaheadSettings}
				onChange={selected => this.searchSelectedStation(selected)}
				onSearch={query => this.fetchFromApi(query)}
			/>
				<InputGroup.Button className="input-group-append">
				  <Button
					className="btn-outline-secondary"
					onClick={() => this.setState(getInitialState())}>
					Play Again
				  </Button>
				</InputGroup.Button>
			  </InputGroup>
			</FormGroup>
		  </Fragment>

		);
	}
}

export default withRouter(SearchBar);
