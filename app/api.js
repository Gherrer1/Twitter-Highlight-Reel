import { isNewerThanXDays, popularity } from './helpers';
import { MAX_NUM_TWEETS_TO_FETCH } from './constants';

export default function fetchTweets({
	username, maxAge, alreadyFetched = [], oldestTweet = null, cb,
}) {
	console.log('fetching tweets');
	const maxId = oldestTweet ? oldestTweet.id - 1 : null;

	fetch(`https://aqztc03pq2.execute-api.us-east-1.amazonaws.com/dev/tweets?username=${username}${maxId ? `&max_id=${maxId}` : ''}`)
		.then(res => res.json())
		.then((json) => {
			if (json.status === 'error') {
				throw new Error(json.message);
			}

			const fetched = alreadyFetched.concat(json);
			const newOldestTweet = fetched.length > 0
				? fetched[fetched.length - 1]
				: null;
			const doneFetching = json.length === 0
				|| fetched.length >= MAX_NUM_TWEETS_TO_FETCH || !isNewerThanXDays(newOldestTweet, maxAge);
			const maxTweetsFetched = fetched.length >= MAX_NUM_TWEETS_TO_FETCH
				&& isNewerThanXDays(newOldestTweet, maxAge);
			if (maxTweetsFetched) {
				console.log('max tweets fetched');
			}

			if (doneFetching) {
				return cb({
					tweets: fetched,
					filteredSortedTweets: fetched.filter(t => !t.retweeted_status)
						.sort((a, b) => popularity(b) - popularity(a)),
					oldestTweet: newOldestTweet,
				});
			}

			return fetchTweets({
				username,
				maxAge,
				alreadyFetched: fetched,
				oldestTweet: newOldestTweet,
				cb,
			});
		})
		.catch(err => cb(null, err));
}
