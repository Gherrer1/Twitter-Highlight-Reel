import { Link } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import SearchForm from './SearchForm';

function Nav(props) {
	const { history } = props;
	return (
		<nav>
			<Link to="/" className="home-btn">Home</Link>
			<SearchForm history={history} />
		</nav>
	);
}
Nav.propTypes = {
	history: PropTypes.object.isRequired,
};

export default Nav;
