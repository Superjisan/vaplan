import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Typography from '@material-ui/core/Typography';

// Import Style
import styles from './BillListFilter.css';

const materialStyles = theme => ({
    paper: {
        backgroundColor: blueGrey[100],
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        paddingLeft: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 2,
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 2,
    },
    formControl: {
        margin: theme.spacing.unit * 3,
    },
    group: {
        margin: `${theme.spacing.unit}px 0`,
    },
})

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
        const {classes} = this.props;
        return (
            <div>
                <Paper className={classes.paper}>
                    <Typography variant="title" component="h4">Search By</Typography>
                    <FormGroup >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.isFavorite}
                                    onChange={this.handleFavorite}
                                />
                            }
                            label="Favorited"
                        />
                    </FormGroup>
                    
                    <div className={styles['form-content']}>
                        <button className={styles['search-submit-button']} onClick={this.handleSearchButton}>Search</button>
                    </div>
                </Paper>
            </div>
        )
    }
}

BillListFilter.propTypes = {
    handleSearch: PropTypes.func,
    classes: PropTypes.object
}

export default withStyles(materialStyles)(BillListFilter);