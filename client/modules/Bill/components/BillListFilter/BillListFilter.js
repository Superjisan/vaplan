import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

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
    }
})

export class BillListFilter extends Component {
    
    state = {
        isFavorite: false,
        committeeText: '',
        number: '',
        name: ''
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
        if(this.state.committeeText) {
            filter.committeeText = this.state.committeeText
        }
        if(this.state.number) {
            filter.number = this.state.number
        }
        if(this.state.name) {
            filter.name = this.state.name
        }
        this.props.handleSearch(filter)
    }

    handleChange = (stateProp) => event => {
        this.setState({
            [stateProp]: event.target.value
        })
    }

    render() {
        const {classes} = this.props;
        return (
            <div>
                <Paper className={classes.paper}>
                    <Grid container space={10}> 
                        <Grid item xs={12}>
                            <Typography variant="title" component="h4">Search By</Typography>
                        </Grid>
                        
                        <Grid item xs={4}>
                            <TextField
                                id="number"
                                label="Bill No."
                                placeholder="Bill Number"
                                value={this.state.number}
                                onChange={this.handleChange('number')}
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                id="name"
                                label="Name"
                                placeholder="Bill Name"
                                value={this.state.name}
                                onChange={this.handleChange('name')}
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                id="committee-text"
                                label="Committee"
                                placeholder="Committee Name"
                                value={this.state.committeeText}
                                onChange={this.handleChange('committeeText')}
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
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
                        </Grid>
                        <Grid item xs={11}></Grid>
                        <Grid item xs={1}>
                            <Button 
                                variant="contained" 
                                color="primary"
                                onClick={this.handleSearchButton}
                            >
                                Search
                            </Button>
                        
                        </Grid>
                    </Grid>
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