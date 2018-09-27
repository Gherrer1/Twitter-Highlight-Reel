import React from 'react';
import PropTypes from 'prop-types';

function Tweet(props) {
	const { tweet } = props;
	// console.log(tweet);
	return (
		<div className="tweet">
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
						{tweet.text}
					</a>
				</h3>
				<span>Likes: {tweet.favorite_count}, Retweets: {tweet.retweet_count}</span>
				<br />
				<span>Created at {tweet.created_at}</span>
			</div>
		</div>
	);
}
Tweet.propTypes = {
	tweet: PropTypes.object.isRequired,
};

function BestTweetsList(props) {
	const { tweets, username } = props;
	return (
		<ul className="tweets-list">
			<div className="tweet-meta">Showing {tweets.length} tweets for {username}.</div>
			{tweets.map(tweet => (
				<li key={tweet.id}>
					<Tweet tweet={tweet} />
				</li>
			))}
		</ul>
	);
}
BestTweetsList.propTypes = {
	tweets: PropTypes.array.isRequired,
	username: PropTypes.string.isRequired,
};

export default BestTweetsList;
