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
            <div className={styles.form}>
                <div className={styles['form-content']}>
                    <h2 className={styles['form-title']}>Search By</h2>
                    <label htmlFor="isFavorite">Favorite</label>
                    <input type="checkbox" checked={this.state.isFavorite} onChange={this.handleFavorite} />
                    <button className={styles['search-submit-button']} onClick={this.handleSearchButton}>Search</button>
                </div>
            </div>
        )
    }
}

BillListFilter.propTypes = {
    handleSearch: PropTypes.func
}

export default BillListFilter;