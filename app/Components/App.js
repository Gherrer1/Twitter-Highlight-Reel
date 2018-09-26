import React from 'react';
import { Route } from 'react-router-dom';
import SearchForm from './SearchForm';
import BestTweetsContainer from './BestTweetsContainer';

function App() {
	return (
		<div>
			<Route exact path="/" render={routeProps => <SearchForm {...routeProps} big />} />
			{/* <Route path="/search" component={SearchForm} /> */}
			{/* <Route path="/search" render={() => <Link to="/">Home</Link>} /> */}
			<Route path="/search" component={BestTweetsContainer} />
		</div>
	);
}

export default App;
