const Twitter = require('twitter');
/* eslint-disable camelcase */
const { consumer_key, consumer_secret, access_token_key, access_token_secret } = require('./apiCreds');
/* eslint-enable camelcase */

function createNoUsernameResponse() {
	const response = {
		statusCode: 400,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': true,
		},
		body: JSON.stringify({
			status: 'error',
			error: 'Username missing.',
			// input: event,
		}),
	};

	return response;
}

function createTweetFetchErrorResponse(statusCode, message) {
	const response = {
		statusCode,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': true,
		},
		body: JSON.stringify({
			status: 'error',
			message,
		}),
	};

	return response;
}

function createTweetFetchSuccessResponse(tweets) {
	const response = {
		statusCode: 200,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': true,
		},
		body: JSON.stringify(tweets),
	};

	return response;
}

module.exports.hello = (event, context, callback) => {
	const client = new Twitter({
		consumer_key,
		consumer_secret,
		access_token_key,
		access_token_secret,
	});

	const { queryStringParameters: query } = event;
	const username = (query && query.username) || null;
	if (!username) {
		return callback(null, createNoUsernameResponse());
	}

	const params = {
		screen_name: username,
		count: 200,
	};
	if (query && query.max_id) {
		params.max_id = query.max_id;
	}

	return client.get('statuses/user_timeline', params, (err, tweets) => {
		if (err) {
			if (err.length) {
				const response = createTweetFetchErrorResponse(404, err[0].message);
				return callback(null, response);
			}

			const response = createTweetFetchErrorResponse(400, 'Not sure what happened');
			return callback(null, response);
		}

		if (tweets) {
			const response = createTweetFetchSuccessResponse(tweets);
			return callback(null, response);
		}

		return callback(null, createTweetFetchErrorResponse(400, 'Not quite sure what went wrong'));
	});
};

// https://serverless.com/blog/cors-api-gateway-survival-guide/ serverless cors
// https://github.com/serverless/examples examples
// https://serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/ invoking locally

// write about testing locally with data.json
// ../node_modules/.bin/serverless invoke local --function hello --path data.json
