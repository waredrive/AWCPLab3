import React from 'react';
import SLLogo from '../../assets/images/SLLogo.svg';

const welcomePage = props => (
	<div>
		<h1>Här kan du söka avgångar för SL kollektivtrafik.</h1>
		<img src={SLLogo} alt="SL" />
	</div>
);

export default welcomePage;
