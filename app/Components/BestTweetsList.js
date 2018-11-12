import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { prettyDate } from '../helpers';

const options = [
	{ value: 7, label: 'Last week' },
	{ value: 14, label: 'Last 14 days' },
	{ value: 30, label: 'Last month' },
	{ value: 60, label: 'Last 60 days' },
];

const customStyles = {
	control: styles => ({ ...styles, backgroundColor: '#4AB3F4' }),
	singleValue: () => ({ color: 'white', fontSize: '20px' }),
	indicatorSeparator: () => ({ backgroundColor: 'black' }),
};

function Tweet({ tweet, tweetRank }) {
	return (
		<div className="tweet">
			<div style={{ marginBottom: '5px' }}>#{tweetRank}</div>
			<div className="avi-col">
				<img src={tweet.user.profile_image_url} alt={`${tweet.user.name}`} className="avatar" />
			</div>
			<div className="evr-else">
				<h3>
					<a
						href={`https://twitter.com/i/web/status/${tweet.id_str}`}
						target="_blank"
						className="tweet-link"
						rel="noopener noreferrer"
					>
						{tweet.full_text}
					</a>
				</h3>
				<span>Likes: {tweet.favorite_count}, Retweets: {tweet.retweet_count}</span>
				<br />
				<span>On {prettyDate(tweet.created_at)}</span>
			</div>
		</div>
	);
}
Tweet.propTypes = {
	tweet: PropTypes.object.isRequired,
	tweetRank: PropTypes.number.isRequired,
};

function BestTweetsList(props) {
	const { tweets, username, maxAge, selectChanged, loading } = props;
	return (
		<div>
			<div className="tweet-meta">
				Showing {tweets.length} tweets for @{username} from the
				<span className="select-days-big">
					<Select
						value={options.find(o => o.value === maxAge)}
						onChange={selectChanged}
						options={options}
						isDisabled={loading}
						styles={customStyles}
					/>
				</span>
			</div>
			<div className="select-days-lil">
				<Select
					value={options.find(o => o.value === maxAge)}
					onChange={selectChanged}
					options={options}
					isDisabled={loading}
					styles={customStyles}
				/>
			</div>
			<ul className="tweets-list">
				{tweets.map((tweet, tweetIndex) => (
					<li key={tweet.id}>
						<Tweet tweet={tweet} tweetRank={tweetIndex + 1} />
					</li>
				))}
			</ul>
		</div>
	);
}
BestTweetsList.propTypes = {
	tweets: PropTypes.array.isRequired,
	username: PropTypes.string.isRequired,
	maxAge: PropTypes.number.isRequired,
	selectChanged: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
};

export default BestTweetsList;
