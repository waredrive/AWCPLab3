import React from 'react';
import './SearchResultToolbar.css';

const searchResultToolbar = props => (
	<div>
		<div className="btn-toolbar btn-lg d-flex justify-content-end pr-0 pb-2">
			<button className="btn btn-primary mr-1" onClick={props.onUpdateButtonClick}>
				Updated: {props.updated}
				<i className="fa fa-refresh fa-lg ml-2" />
			</button>
			<button className="btn btn-danger btn-lg ml-1" onClick={props.onClearResultsButtonClick}>
				<i className="fa fa-trash fa-lg" />
			</button>
		</div>
		<div className="bg-dark rounded mb-3 pr-md-0 text-center text-white align-self-center">
			<h3 className="p-2">{props.stationName}</h3>
		</div>
		{Object.keys(props.searchResults).length > 1 ? (
			<div className="bg-dark rounded mb-3 h5 d-flex justify-content-center text-light pb-2">
				<ul className="nav nav-pills nav-filter justify-content-center">
					<li className="nav-item ml-2 mt-2" key="all">
						<a
							className={props.shown['All'] ? 'nav-link filter active' : 'nav-link filter'}
							onClick={props.onShowAllTransportGroupsButtonClick}
						>
							SHOW ALL
						</a>
					</li>
					{Object.keys(props.searchResults).map(transportType => {
						return (
							<li className="nav-item ml-2 mt-2" key={transportType}>
								<a
									className={
										props.shown[transportType] && !props.shown['All'] ? 'nav-link filter active' : 'nav-link filter'
									}
									onClick={() => {
										props.onShowTransportGroupsButtonClick(transportType);
									}}
								>
									{transportType}
								</a>
							</li>
						);
					})}
				</ul>
			</div>
		) : null}
	</div>
);

export default searchResultToolbar;
