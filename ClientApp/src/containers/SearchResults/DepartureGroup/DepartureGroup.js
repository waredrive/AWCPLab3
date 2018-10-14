import React from 'react';

import DepartureItem from '../DepartureItem/DepartureItem';

const departureGroup = props => {
    // console.log(props.departures);
	return (
		<React.Fragment>
			<h4>This is a departure group for {props.transportType}!</h4>
			<ul>
				{props.departures.map((departure, index) => {
					return (
							<DepartureItem key={index} departure={departure} />
					);
				})}
			</ul>
		</React.Fragment>
	);
};

export default departureGroup;
