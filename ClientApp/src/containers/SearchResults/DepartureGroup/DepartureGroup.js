import React from 'react';

import DepartureItem from '../DepartureItem/DepartureItem';

const departureGroup = props => {
	return (
		<div className="px-2 pt-2 pb-1 mb-3 bg-dark rounded">
			<div className="text-white text-uppercase text-center pb-1 font-weight-bold h4">{props.transportType}</div>
			{props.departures.map((departure, index) => {
				return <DepartureItem key={index} departure={departure} />;
			})}
		</div>
	);
};

export default departureGroup;
