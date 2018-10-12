import React, { Component } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';

class SearchBar extends Component {
	state = {
		typeahead: {
			isLoading: false,
			options: [],
			minLength: 3,
			filterBy: option => option.Name,
			labelKey: 'Name'
		}
	};

	render() {
		const typeahead = this.state.typeahead;

		return (
			//TODO: Error Handling
			<AsyncTypeahead
				selectHintOnEnter={true}
				isLoading={typeahead.isLoading}
				onKeyPress={event => {
					console.log(event);
				}}
				minLength={typeahead.minLength}
				filterBy={typeahead.filterBy}
				labelKey={typeahead.labelKey}
				onSearch={query => {
					let updatedTypeahead = { ...this.state.typeahead };
					updatedTypeahead.isLoading = true;
					this.setState({ typeahead: updatedTypeahead });
					fetch('api/typeahead/' + query, {
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json'
						}
					})
						.then(resp => resp.json())
						.then(response => {
							let updatedTypeahead = { ...this.state.typeahead };
							let filteredResponse = response.ResponseData.filter(val =>
								val.Name.toLowerCase()
									.trim()
									.includes(query.toLowerCase().trim())
							);
							updatedTypeahead.isLoading = false;
							updatedTypeahead.options = filteredResponse;
							this.setState({
								typeahead: updatedTypeahead
							});
						});
				}}
				options={typeahead.options}
			/>
		);
	}
}

export default SearchBar;
