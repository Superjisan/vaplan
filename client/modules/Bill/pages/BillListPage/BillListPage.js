import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import BillList from '../../components/BillList';
import BillListFilter from '../../components/BillListFilter/BillListFilter';

import {
    fetchBills,
    updateBillRequest,
    searchBillsRequest,
    checkForNewBills,
    checkForUpdateBill
} from '../../BillActions';

// Import Selectors
import { getBills } from '../../BillReducer';

class BillListPage extends Component {
    componentDidMount() {
        this.props.dispatch(fetchBills());
    }

    handleSearch = filter => {
        this.props.dispatch(searchBillsRequest(filter))
    }

    handleFavoriteBill = bill => {
        bill.isFavorite = !bill.isFavorite;
        this.props.dispatch(updateBillRequest(bill))
    }

    handleCheckNewBills = () => {
        this.props.dispatch(checkForNewBills(this.props.bills))
    }

    handleUpdateBill = bill => {
        this.props.dispatch(checkForUpdateBill(bill))
    }

    render() {
        return (
            <div>
                <BillListFilter
                    handleSearch={this.handleSearch}
                    handleCheckNewBills={this.handleCheckNewBills} />
                <BillList
                    bills={this.props.bills}
                    handleFavoriteBill={this.handleFavoriteBill}
                    handleUpdateBill={this.handleUpdateBill} />
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