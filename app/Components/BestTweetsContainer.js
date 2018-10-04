import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Loader from 'react-loader-spinner';
import Modal from 'react-modal';
import { getQueryUsername, isNewerThanXDays } from '../helpers';
import BestTweetsList from './BestTweetsList';
import Nav from './Nav';
import fetchTweets from '../api';
import { MAX_NUM_TWEETS_TO_FETCH } from '../constants';

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
	},
};

Modal.setAppElement('#app');

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
			modalIsOpen: false,
		};

		this.fetchTweets = this.fetchTweets.bind(this);
		this.fetchMoreTweets = this.fetchMoreTweets.bind(this);
		this.changeDayFilter = this.changeDayFilter.bind(this);
		this.usernameProp = this.usernameProp.bind(this);
		this.handleFetchResponse = this.handleFetchResponse.bind(this);
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
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
			const { oldestTweet, maxAge, tweets } = this.state;
			if (isNewerThanXDays(oldestTweet, maxAge) && tweets.length < MAX_NUM_TWEETS_TO_FETCH) {
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
			console.log(data);
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

	openModal() {
		this.setState({
			modalIsOpen: true,
		});
	}

	closeModal() {
		this.setState({
			modalIsOpen: false,
		});
	}

	render() {
		const { error, tweets, oldestTweet, filteredSortedTweets,
			maxAge, loading, modalIsOpen } = this.state;
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
					<button onClick={this.openModal} type="button">Open Modal</button>
					<BestTweetsList
						tweets={tweetsForTimeWindow}
						oldestTweet={oldestTweet}
						username={this.usernameProp()}
					/>
					<Modal
						isOpen={modalIsOpen}
						onRequestClose={this.closeModal}
						style={customStyles}
					>
						<div>Yo</div>
						<button type="button" onClick={this.closeModal}>close</button>
					</Modal>
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
