import React, { Component } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { withRouter } from 'react-router-dom';
import { FormGroup, InputGroup, Button } from 'react-bootstrap';

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
		this.typeahead.getInstance().clear()
		this.typeahead.getInstance().blur()
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
			<FormGroup style={{width: '80%', margin: '10px auto'}}>
			  <InputGroup>
				<AsyncTypeahead
				{...this.state.typeaheadSettings}
				onChange={selected => this.searchSelectedStation(selected)}
				onSearch={query => this.fetchFromApi(query)}
				ref={(ref) => this.typeahead = ref}
			/>
				<InputGroup.Button>
				  <Button bsSize='large' onClick={() => this.typeahead.getInstance().clear()}>
					Clear
				  </Button>
				</InputGroup.Button>
			  </InputGroup>
			</FormGroup>
		);
	}
}

export default withRouter(SearchBar);
