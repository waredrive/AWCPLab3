import React from 'react';

import DepartureItem from '../DepartureItem/DepartureItem';

const departureGroup = props => {
	return (
		<div style={{width: '80%', margin: '15px auto'}}>
			<h4>This is a departure group for {props.transportType}!</h4>
			<ul>
				{props.departures.map((departure, index) => {
					return (
							<DepartureItem key={index} departure={departure} />
					);
				})}
			</ul>
		</div>
	);
};

export default departureGroup;
