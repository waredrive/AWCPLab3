import React from 'react';
import SLLogo from '../../assets/images/SLLogo.svg';

const welcomePage = props => (
	<div>
		<h1 className="d-block display-4 text-white text-center mx-lg-5 my-3">
			Här kan du söka avgångar för SL kollektivtrafik.
		</h1>
		<img className="img-fluid mx-auto m-5 d-block" src={SLLogo} alt="SL" />
	</div>
);

export default welcomePage;
