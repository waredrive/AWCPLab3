import React from 'react';

const departureDetails = props => (
	<div style={{border: '1px solid black'}}>
		<p>{props.intermediateStops.StartStation.Name}</p>
		{props.intermediateStops.MiddleStations.map(stop => (
            <p>{stop.Name}</p>
		))}
		<p>{props.intermediateStops.EndStation.Name}</p>
	</div>
);

export default departureDetails;
