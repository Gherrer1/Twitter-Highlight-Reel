import React from 'react';
import PropTypes from 'prop-types';
import { prettyDate } from '../helpers';

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
	const { tweets, username } = props;
	return (
		<div>
			<div className="tweet-meta">Showing {tweets.length} tweets for @{username}</div>
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
};

export default BestTweetsList;
