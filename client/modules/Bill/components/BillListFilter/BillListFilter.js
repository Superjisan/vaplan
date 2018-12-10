import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import Style
import styles from './BillListFilter.css';

export class BillListFilter extends Component {
    state = {
        isFavorite: false
    }

    handleFavorite = () => {
        this.setState({
            isFavorite: !this.state.isFavorite
        })
    }

    handleSearchButton = () => {
        const filter = {};
        if (this.state.isFavorite) {
            filter.isFavorite = true
        }
        this.props.handleSearch(filter)
    }

    render() {
        return (
            <div className="">
                <h2>Search By</h2>
                <label for="isFavorite">Favorite</label>
                <input type="checkbox" checked={this.state.isFavorite} onChange={this.handleFavorite} />
                <button onClick={this.handleSearchButton}>Search</button>
            </div>
        )
    }
}

BillListFilter.propTypes = {
    handleSearch: PropTypes.func
}

export default BillListFilter;