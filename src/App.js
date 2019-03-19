import React, { Component } from "react";
import "./App.css";
import {
    fetchPostsIfNeeded,
    selectSubreddit,
    invalidateSubreddit
} from "./actions";
import { connect } from "react-redux";
import Picker from "./components/Picker";
import Posts from "./components/Posts";

class App extends Component {
    componentDidMount() {
        const { dispatch, selectedSubreddit } = this.props;
        dispatch(fetchPostsIfNeeded(selectedSubreddit));
    }

    componentDidUpdate(prevProps) {
        const { dispatch, selectedSubreddit } = this.props;
        if (selectedSubreddit !== prevProps.selectedSubreddit) {
            dispatch(fetchPostsIfNeeded(selectedSubreddit));
        }
    }

    handleChange = newSubreddit => {
        const { dispatch } = this.props;
        dispatch(selectSubreddit(newSubreddit));
        dispatch(fetchPostsIfNeeded(newSubreddit));
    };
    handleRefreshClick = e => {
        e.preventDefault();
        const { dispatch, selectedSubreddit } = this.props;
        dispatch(invalidateSubreddit(selectedSubreddit));
        dispatch(fetchPostsIfNeeded(selectedSubreddit));
    };
    render() {
        const {
            selectedSubreddit,
            posts,
            isFetching,
            lastUpdated
        } = this.props;
        console.log("posts", posts);
        return (
            <div className="App">
                <Picker
                    value={selectedSubreddit}
                    onChange={this.handleChange}
                    options={["reactjs", "frontend", "node"]}
                />
                <p>
                    {lastUpdated && (
                        <span>
                            Last updated at{" "}
                            {new Date(lastUpdated).toLocaleTimeString()}.
                        </span>
                    )}
                    {!isFetching && (
                        <button onClick={this.handleRefreshClick}>
                            Refresh
                        </button>
                    )}
                </p>
                {isFetching && posts.length === 0 && <h2>Loading...</h2>}
                {!isFetching && posts.length === 0 && <h2>Empty</h2>}
                {
                    <div style={{ opacity: isFetching ? 0.5 : 1 }}>
                        <Posts posts={posts} />
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { selectedSubreddit, postsBySubreddit } = state;
    const { isFetching, lastUpdated, items: posts } = postsBySubreddit[
        selectedSubreddit
    ] || { isFetching: true, items: [] };

    return { selectedSubreddit, posts, isFetching, lastUpdated };
};

export default connect(mapStateToProps)(App);
