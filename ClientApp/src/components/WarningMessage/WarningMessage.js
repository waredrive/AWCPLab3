import React from 'react';
import { Alert } from 'react-bootstrap';

const warningMessage = props => (
	<Alert
		bsStyle="warning"
		className="d-flex align-items-center justify-content-center text-center h5 font-weight-normal"
	>
		<i className="fa fa-exclamation-triangle fa-lg pr-3" />
		{props.children}
		<i className="fa fa-exclamation-triangle fa-lg pl-3" />
	</Alert>
);

export default warningMessage;
