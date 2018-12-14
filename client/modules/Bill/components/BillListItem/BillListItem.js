import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faRegularStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as faSolidStar, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { VIRGINIA_LEGISLATURE_WEBSITE } from '../../constants';

const materialStyles = theme => ({
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    paddingTop: 0,
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
  },
  fontIcon: {
    float: 'right',
  },
  paragraph: {
    marginTop: 10,
  },
  listItem: {
    paddingTop: 0,
    paddingBottom: 0,
  },
});

function BillListItem(props) {
  const { classes } = props;
  return (
    <div>
      <Paper className={classes.paperRoot} elevation={1}>
        <Typography variant="title" component="h4">
          <a>{props.bill.name}</a>
          <FontAwesomeIcon
            className={classes.fontIcon}
            icon={props.bill.isFavorite ? faSolidStar : faRegularStar}
            onClick={() => props.onFavorite(props.bill)}
          />
          <a className={classes.fontIcon} href={`${VIRGINIA_LEGISLATURE_WEBSITE}${props.bill.link}`} target="_blank">
            <FontAwesomeIcon icon={faExternalLinkAlt} />
          </a>
        </Typography>
        <Typography variant="subtitle1" component="span">
          Sponsored By {props.bill.sponsor}
        </Typography>
        <Typography variant="body1" component="p" className={classes.paragraph}>
          <strong>Summary: </strong>
          {props.bill.summary}
        </Typography>
        {props.bill.committeeText ? (
          <Typography variant="body1" component="p" className={classes.paragraph}>
            <strong>Committee: </strong>
            {props.bill.committeeText}
          </Typography>
        ) : null}

        <Typography variant="body1" component="span" className={classes.paragraph}>
          <strong>History</strong>
        </Typography>
        <List className={classes.list}>
          {props.bill.historyItems.map(item => {
            return (
              <ListItem className={classes.listItem} alignItems="flex-start" key={item._id}>
                <ListItemText
                  primary={`- ${item.text}`}
                  primaryTypographyProps={{
                    variant: 'body1',
                    component: 'span',
                  }}
                />
              </ListItem>
            );
          })}
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
    historyItems: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        text: PropTypes.string,
        date: PropTypes.string,
      })
    ),
  }).isRequired,
  onFavorite: PropTypes.func.isRequired,
  classes: PropTypes.object,
};

export default withStyles(materialStyles)(BillListItem);
