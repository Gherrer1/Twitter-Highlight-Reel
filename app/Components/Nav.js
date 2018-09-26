import { Link } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import SearchForm from './SearchForm';

const options = [
	{ value: 7, label: 'Last week' },
	{ value: 14, label: 'Last 14 days' },
	{ value: 30, label: 'Last month' },
];

function Nav(props) {
	const { maxAge, selectChanged, history, loading } = props;
	return (
		<nav>
			<Link to="/" className="home-btn">Home</Link>
			<SearchForm history={history} />
			<div className="select-days">
				<Select
					value={options.find(o => o.value === maxAge)}
					onChange={selectChanged}
					options={options}
					isDisabled={loading}
				/>
			</div>
		</nav>
	);
}
Nav.propTypes = {
	maxAge: PropTypes.number.isRequired,
	selectChanged: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired,
	loading: PropTypes.bool.isRequired,
};

export default Nav;
