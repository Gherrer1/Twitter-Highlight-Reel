import { isNewerThanXDays, popularity } from './helpers';

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
				|| fetched.length >= 1000 || !isNewerThanXDays(newOldestTweet, maxAge);

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
