import React from 'react';
import { withRouter } from 'react-router-dom';

const departureDetails = props => (
	<div className="list-group mt-0 mb-2">
		<div className="list-group-item bg-light d-flex align-items-center h5 text-dark">
			<i className="fa fa-circle-o mr-3 fa-2x text-info" />
			<span className="font-weight-bold">
				{props.intermediateStops.StartStation.Name}
			</span>
		</div>
		{props.intermediateStops.MiddleStations.map((stop, index) => (
			<a
				className="list-group-item bg-light d-flex align-items-center list-group-item-action h5 text-dark"
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
				<i className="fa fa-circle ml-2 mr-4 text-info" />
				{stop.Name}
			</a>
		))}

		<a
			className="list-group-item bg-light d-flex align-items-center  list-group-item-action h5 text-dark"
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
			<i className="fa fa-circle-o mr-3 fa-2x text-info" />
			<span className="font-weight-bold">
				{props.intermediateStops.EndStation.Name}
			</span>
		</a>
	</div>
);

export default withRouter(departureDetails);
