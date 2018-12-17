import _ from "lodash";
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

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
import { getBills, getNotification } from '../../BillReducer';

const materialStyles = theme => ({
    close: {
        padding: theme.spacing.unit / 2
    }
});

class BillListPage extends Component {
    state = {
        notificationSnackBarIsOpen: false
    }

    componentDidMount() {
        this.props.dispatch(fetchBills());
    }

    componentDidUpdate(prevProps) {
        if (prevProps.notification !== this.props.notification) {
            this.openNotificationSnackBar();
        }
    }

    openNotificationSnackBar = () => {
        this.setState({ notificationSnackBarIsOpen: true });
    }

    handleCloseNotificationSnackBar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        this.setState({ notificationSnackBarIsOpen: false })
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
        const { classes } = this.props;
        return (
            <div>
                <BillListFilter
                    handleSearch={this.handleSearch}
                    handleCheckNewBills={this.handleCheckNewBills} />
                <BillList
                    bills={this.props.bills}
                    handleFavoriteBill={this.handleFavoriteBill}
                    handleUpdateBill={this.handleUpdateBill} />
                <Snackbar
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "right"
                    }}
                    open={this.state.notificationSnackBarIsOpen}
                    autoHideDuration={6000}
                    onClose={this.handleClose}
                    ContentProps={{
                        "aria-describedby": "notification-id"
                    }}
                    message={<span id="notification-id">
                        {_.get(this.props.notification, 'message', '')}
                    </span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            className={classes.close}
                            onClick={this.handleCloseNotificationSnackBar}
                        >
                            <CloseIcon />
                        </IconButton>
                    ]}
                />
            </div>
        )
    }
}

BillListPage.need = [() => {
    return fetchBills();
}]

function mapStateToProps(state) {
    return {
        bills: getBills(state),
        notification: getNotification(state)
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
    notification: PropTypes.shape({
        message: PropTypes.string
    }),
    dispatch: PropTypes.func.isRequired,
};

BillListPage.contextTypes = {
    router: PropTypes.object,
};


export default connect(mapStateToProps)(withStyles(materialStyles)(BillListPage));