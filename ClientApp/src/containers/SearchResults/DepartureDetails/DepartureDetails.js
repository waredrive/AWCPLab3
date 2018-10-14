import React from 'react';
import { withRouter } from 'react-router-dom';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

const departureDetails = props => (
	<ListGroup>
		<ListGroupItem key={props.intermediateStops.StartStation.SiteId}>
			{props.intermediateStops.StartStation.Name}
		</ListGroupItem>
		{props.intermediateStops.MiddleStations.map((stop, index) => (
			<ListGroupItem
				key={stop.SiteId + index}
				href=""
				onClick={e => {
					e.preventDefault();
					props.history.push(
						`/${encodeURIComponent(stop.Name.replace(/\//g, '_'))}/${
							stop.SiteId
						}`
					);
				}}
			>
				{stop.Name}
			</ListGroupItem>
		))}
		<ListGroupItem
			href=""
			onClick={e => {
				e.preventDefault();
				props.history.push(
					`/${encodeURIComponent(
						props.intermediateStops.EndStation.Name.replace(/\//g, '_')
					)}/${props.intermediateStops.EndStation.SiteId}`
				);
			}}
			key={props.intermediateStops.EndStation.SiteId}
		>
			{props.intermediateStops.EndStation.Name}
		</ListGroupItem>
	</ListGroup>
);

export default withRouter(departureDetails);
