// SYNCHRONOUS
import fetch from "cross-fetch";

export const SELECT_SUBREDDIT = "SELECT_SUBREDDIT";
export const INVALIDATE_SUBREDDIT = "INVALIDATE_SUBREDDIT";

export const selectSubreddit = subreddit => ({
    type: SELECT_SUBREDDIT,
    subreddit
});
export const invalidateSubreddit = subreddit => ({
    type: INVALIDATE_SUBREDDIT,
    subreddit
});

// ASYNC
export const REQUEST_POSTS = "REQUEST_POSTS";
export const RECEIVE_POSTS = "RECEIVE_POSTS";

const requestPosts = subreddit => ({
    type: REQUEST_POSTS,
    subreddit
});

const receivePosts = (subreddit, json) => ({
    type: RECEIVE_POSTS,
    subreddit,
    posts: json.data ? json.data.children.map(child => child.data) : [],
    receivedAt: Date.now()
});

export const fetchPosts = subreddit => dispatch => {
    dispatch(requestPosts(subreddit));
    return fetch(`https://www.reddit.com/r/${subreddit}.json`)
        .then(res => res.json(), error => console.log(error))
        .then(json => dispatch(receivePosts(subreddit, json)));
};

const shouldFetchPosts = (state, subreddit) => {
    const posts = state.postsBySubreddit[subreddit];
    return !posts ? true : posts.isFetching ? false : posts.didInvalidate;
};

export const fetchPostsIfNeeded = subreddit => (dispatch, getState) =>
    shouldFetchPosts(getState(), subreddit)
        ? dispatch(fetchPosts(subreddit))
        : Promise.resolve();
