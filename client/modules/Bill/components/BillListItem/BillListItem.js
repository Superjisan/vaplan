import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as faRegularStar } from '@fortawesome/free-regular-svg-icons'
import { faStar as faSolidStar } from '@fortawesome/free-solid-svg-icons'

// Import Style
import styles from './BillListItem.css';

function BillListItem(props) {
    return (
        <div className={styles['single-bill']}>
            <h3 className={styles['bill-title']}>
                <Link to={`/bills/${props.bill.number}`} >
                    {props.bill.name}
                </Link>
                <FontAwesomeIcon icon={(props.bill.isFavorite ? faSolidStar : faRegularStar)} onClick={() => props.onFavorite(props.bill)} />
            </h3>
            <p className={styles['author-name']}><FormattedMessage id="by" /> {props.bill.sponsor}</p>
            <p className={styles['bill-desc']}>
                <b>Summary:</b>{props.bill.summary}
            </p>
            <hr className={styles.divider} />
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
        history: PropTypes.shape({
            text: PropTypes.string,
            date: PropTypes.string
        })
    }).isRequired,
    onFavorite: PropTypes.func.isRequired,
};

export default BillListItem;
