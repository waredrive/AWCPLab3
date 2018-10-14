import React from 'react';

import {Alert} from 'react-bootstrap';

const errorMessage = props => (<Alert bsStyle="danger">{props.message}</Alert>);

export default errorMessage;
