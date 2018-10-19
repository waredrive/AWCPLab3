import React from 'react';
import { Alert } from 'react-bootstrap';

const errorMessage = props => (
	<Alert
		bsStyle="danger"
		className="d-flex align-items-center justify-content-center text-center h5 font-weight-normal"
	>
		<i className="fa fa-exclamation-circle fa-lg pr-3" />
		{props.message}
		<i className="fa fa-exclamation-circle fa-lg pl-3" />
	</Alert>
);

export default errorMessage;
