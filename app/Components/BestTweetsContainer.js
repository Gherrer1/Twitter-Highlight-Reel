import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Loader from 'react-loader-spinner';
import { getQueryUsername, isNewerThanXDays } from '../helpers';
import BestTweetsList from './BestTweetsList';
import Nav from './Nav';
import fetchTweets from '../api';

class BestTweetsContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			tweets: null,
			filteredSortedTweets: null,
			oldestTweet: null,
			maxAge: 7,
			error: null,
			loading: true,
		};

		this.fetchTweets = this.fetchTweets.bind(this);
		this.fetchMoreTweets = this.fetchMoreTweets.bind(this);
		this.changeDayFilter = this.changeDayFilter.bind(this);
		this.usernameProp = this.usernameProp.bind(this);
		this.handleFetchResponse = this.handleFetchResponse.bind(this);
	}

	componentDidMount() {
		if (this.usernameProp()) {
			this.fetchTweets(this.usernameProp());
		}
	}

	componentDidUpdate(prevProps) {
		const { location } = this.props;
		if (this.usernameProp() && prevProps.location !== location) {
			this.fetchTweets(this.usernameProp());
		}
	}

	usernameProp() {
		const { location } = this.props;
		const username = getQueryUsername(location.search);
		return username || null;
	}

	changeDayFilter({ value }) {
		this.setState({
			maxAge: value,
		}, () => {
			const { oldestTweet, maxAge } = this.state;
			if (isNewerThanXDays(oldestTweet, maxAge)) {
				console.log('we need more tweets');
				this.fetchMoreTweets();
			}
		});
	}

	handleFetchResponse(data, err) {
		if (err) {
			return this.setState({
				error: err.message || 'Something went wrong.',
				loading: false,
			});
		}
		if (data) {
			return this.setState({
				...data,
				loading: false,
			});
		}
		return this.setState({
			error: 'Not really sure what happened',
			loading: false,
		});
	}

	fetchMoreTweets() {
		const username = this.usernameProp();
		const { maxAge, tweets: alreadyFetched, oldestTweet } = this.state;
		this.setState({
			loading: true,
		});
		fetchTweets({
			username,
			maxAge,
			alreadyFetched,
			oldestTweet,
			cb: this.handleFetchResponse,
		});
	}

	fetchTweets(username) {
		this.setState({
			tweets: null,
			filteredSortedTweets: null,
			oldestTweet: null,
			error: null,
			loading: true,
			maxAge: 7,
		}, () => {
			const { maxAge } = this.state;
			fetchTweets({
				username,
				maxAge,
				cb: this.handleFetchResponse,
			});
		});
	}


	render() {
		const { error, tweets, oldestTweet, filteredSortedTweets, maxAge, loading } = this.state;
		const { history } = this.props;
		if (loading) {
			return (
				<div>
					<Nav
						selectChanged={this.changeDayFilter}
						{...{ history, loading, maxAge }}
					/>
					<div className="loader">
						<Loader type="Triangle" color="#00BFFF" height="100" width="100" />
					</div>
				</div>
			);
		}
		if (!this.usernameProp()) {
			return <Redirect to="/" />;
		}
		if (tweets) {
			const tweetsForTimeWindow = filteredSortedTweets
				.filter(t => isNewerThanXDays(t, maxAge))
				.slice(0, 25);
			return (
				<Fragment>
					<Nav
						selectChanged={this.changeDayFilter}
						{...{ history, loading, maxAge }}
					/>
					<BestTweetsList
						tweets={tweetsForTimeWindow}
						oldestTweet={oldestTweet}
						username={this.usernameProp()}
					/>
				</Fragment>
			);
		}
		if (error) {
			return (
				<div>
					<Nav
						selectChanged={this.changeDayFilter}
						{...{ history, loading, maxAge }}
					/>
					{error}
				</div>
			);
		}

		return (
			<div>
				<Nav
					selectChanged={this.changeDayFilter}
					{...{ history, loading, maxAge }}
				/>
				Something went wrong :(
			</div>
		);
	}
}
BestTweetsContainer.propTypes = {
	location: PropTypes.object.isRequired,
};

export default BestTweetsContainer;
