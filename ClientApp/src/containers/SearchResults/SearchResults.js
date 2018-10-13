import React from 'react';

const searchResults = props => (
<p>{props.match.params.stationName.replace(/_/g, '/')} - {props.match.params.stationId}</p>
    )

export default searchResults