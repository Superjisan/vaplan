import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import BillList from '../../components/BillList';

import { fetchBills, updateBillRequest } from '../../BillActions';

// Import Selectors
import { getBills } from '../../BillReducer';

class BillListPage extends Component {
    componentDidMount() {
        this.props.dispatch(fetchBills());
    }

    handleFavoriteBill = bill => {
        bill.isFavorite = !bill.isFavorite;
        this.props.dispatch(updateBillRequest(bill))
    }

    render() {
        return (
            <div>
                <BillList bills={this.props.bills} handleFavoriteBill={this.handleFavoriteBill} />
            </div>
        )
    }
}

BillListPage.need = [() => {
    return fetchBills();
}]

function mapStateToProps(state) {
    return {
        bills: getBills(state)
    };
}

BillListPage.propTypes = {
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
    dispatch: PropTypes.func.isRequired,
};

BillListPage.contextTypes = {
    router: PropTypes.object,
};


export default connect(mapStateToProps)(BillListPage);