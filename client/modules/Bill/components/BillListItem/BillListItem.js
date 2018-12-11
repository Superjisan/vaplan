import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faRegularStar} from '@fortawesome/free-regular-svg-icons';
import { faStar as faSolidStar, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import {VIRGINIA_LEGISLATURE_WEBSITE} from "../../constants";

// Import Style
import styles from './BillListItem.css';

const materialStyles = theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
    paperRoot: {
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        paddingLeft: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 2,
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 2,
    }
});

function BillListItem(props) {
    console.log("props bill", props.bill);
    const { classes } = props;
    return (
        <div>
            <Paper className={classes.paperRoot} elevation={1}>
                <Typography variant="title" component="h4">
                    <a>{props.bill.name}</a>
                    <FontAwesomeIcon icon={(props.bill.isFavorite ? faSolidStar : faRegularStar)} onClick={() => props.onFavorite(props.bill)} />
                    <a 
                        href={`${VIRGINIA_LEGISLATURE_WEBSITE}${props.bill.link}`}
                        target="_blank"
                    >
                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </a>
                </Typography>
                <Typography variant="subtitle" component="h5"> Sponsored By {props.bill.sponsor}</Typography>
                <Typography variant="body2" component="p">
                    <b>Summary: </b>{props.bill.summary}
                </Typography>
                <h4>History</h4>
                <List className={classes.root}>
                    {
                        props.bill.historyItems.map(item => {
                            return <ListItem
                                alignItems="flex-start"
                                key={item._id}
                            >
                                <ListItemText primary={`- ${item.text}`} />
                            </ListItem>
                        })
                    }
                </List>
            </Paper>
        </div>
    );
}

BillListItem.propTypes = {
    bill: PropTypes.shape({
        name: PropTypes.string.isRequired,
        number: PropTypes.string.isRequired,
        isFavorite: PropTypes.bool.isRequired,
        sponsor: PropTypes.string,
        committeeText: PropTypes.string,
        subcommitteText: PropTypes.string,
        summary: PropTypes.string,
        historyItems: PropTypes.arrayOf(PropTypes.shape({
            _id: PropTypes.string,
            text: PropTypes.string,
            date: PropTypes.string
        }))
    }).isRequired,
    onFavorite: PropTypes.func.isRequired,
    classes: PropTypes.object
};

export default withStyles(materialStyles)(BillListItem);
