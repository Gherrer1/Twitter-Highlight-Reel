import queryString from 'query-string';
import { subDays, isBefore, format } from 'date-fns';

export function getQueryUsername(query) {
	const parsedQuery = queryString.parse(query);
	return (parsedQuery && parsedQuery.username) || null;
}

export function popularity(tweet) {
	return tweet.favorite_count + tweet.retweet_count;
}

export function isNewerThanXDays(tweet, daysAgo = 7) {
	if (!tweet) {
		return false;
	}
	const xDaysAgo = subDays(new Date(), daysAgo);
	const tweetCreatedOn = new Date(tweet.created_at);
	return isBefore(xDaysAgo, tweetCreatedOn);
}

export function prettyDate(date) {
	return format(date, 'MMMM Do, YYYY h:mm a');
}

export function unescapeTweet(tweet) {
	return {
		...tweet,
		full_text: tweet.full_text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
	};
}
