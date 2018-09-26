import React from 'react';
import PropTypes from 'prop-types';

class SearchForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		const { value } = event.target;
		this.setState({
			username: value,
		});
	}

	handleSubmit(event) {
		event.preventDefault();
		const { username } = this.state;
		const { history } = this.props;
		history.push(`/search?username=${username}`);

		this.setState({
			username: '',
		});
	}

	render() {
		const { username } = this.state;
		const { big } = this.props;
		const className = big ? 'search-form-big' : 'search-form-lil';
		const placeholder = 'e.g. @tylermcginnis';
		return (
			<form onSubmit={this.handleSubmit} className={className}>
				<input type="text" value={username} onChange={this.handleChange} placeholder={placeholder} />
				<button type="submit">Get Tweets</button>
			</form>
		);
	}
}
SearchForm.propTypes = {
	history: PropTypes.object.isRequired,
	big: PropTypes.bool,
};
SearchForm.defaultProps = {
	big: false,
};

export default SearchForm;
