import React from 'react';
import PropTypes from 'prop-types';

// Import Components
import BillListItem from './BillListItem/BillListItem';

function BillList(props) {
  return (
    <div className="listView">
      {
        props.bills.map(bill => (
          <BillListItem
            bill={bill}
            key={bill.number}
            onFavorite={() => props.handleFavoriteBill(bill)}
          />
        ))
      }
    </div>
  );
}

BillList.propTypes = {
    bills: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        number: PropTypes.string.isRequired,
        isFavorite: PropTypes.bool.isRequired,
        sponsor: PropTypes.string,
        committeeText: PropTypes.string,
        subcommitteText: PropTypes.string,
        history: PropTypes.shape({
            text: PropTypes.string,
            date: PropTypes.string
        })
    })).isRequired,
  handleFavoriteBill: PropTypes.func.isRequired,
};

export default BillList;
