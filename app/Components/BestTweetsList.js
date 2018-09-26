import React from 'react';
import PropTypes from 'prop-types';
import differenceInDays from 'date-fns/difference_in_days';
import { isNewerThanXDays } from '../helpers';

function Tweet(props) {
	const { tweet } = props;
	// console.log(tweet);
	return (
		<div className="tweet">
			<div className="avi-col">
				<img src={tweet.user.profile_image_url} alt={`${tweet.user.name}`} className="avatar" />
			</div>
			<div className="evr-else">
				{/* <span>{tweet.user.name}</span> */}
				{/* <span> @{tweet.user.screen_name}</span> */}
				{/* <span> {tweet.created_at}</span> */}
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
	const { tweets, oldestTweet, username } = props;
	return (
		<ul className="tweets-list">
			Showing {tweets.length} tweets for {username}.
			{/* {tweets.length > 0 && `Oldest tweet is ${differenceInDays(new Date(), new Date(oldestTweet.created_at))} old.`} */}
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
	oldestTweet: PropTypes.object,
};
BestTweetsList.defaultProps = {
	oldestTweet: null,
};

export default BestTweetsList;
