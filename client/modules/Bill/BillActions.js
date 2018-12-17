import _ from "lodash";
import querystring from "querystring";
import callApi from '../../util/apiCaller';

export const UPDATE_BILL = 'UPDATE_BILL';
export const ADD_BILLS = 'ADD_BILLS';
export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';

export const addBills = (bills) => {
    return {
        type: ADD_BILLS,
        bills,
    }
};

export const addNotification = (notification) => {
    return {
        type: ADD_NOTIFICATION,
        notification
    }
}

export function fetchBills() {
    return (dispatch) => {
        return callApi('bills').then(res => {
            return dispatch(addBills(res.bills));
        });
    }
}

export const checkForNewBills = bills => dispatch => {
    // dispatch({ type: ADD_NOTIFICATION, notification: { message: 'this is a message' } })
    return callApi('check-new-bills', 'post', { bills })
        .then(res => {
            console.log(res);
            // put in a snack item to show how many new bills were fetched
            if (_.get(res, 'bills.length')) {
                dispatch(addNotification({
                    message: `Added new ${res.bills.length} bills to the database `
                }));
            } else if (_.get(res, 'message') === "nothing to update") {
                dispatch(addNotification({ message: res.message }))
            }
        })
        .catch(err => {
            console.error(err)
            dispatch(addNotification({
                message: _.get(err.message) || `Checking For New Bills Faile`
            }));
        });
}


export const checkForUpdateBill = bill => dispatch => {
    return callApi('check-for-update-bill', 'put', { bill })
        .then(res => {
            dispatch(updateBill(res.bill));
        })
        .catch(err => console.error(err));
}

export const updateBill = bill => {
    return {
        type: UPDATE_BILL,
        bill
    }
}

export const updateBillRequest = (bill) => dispatch => {
    return callApi(`bills/${bill.number}`, 'put', { bill })
        .then(res => dispatch(updateBill(res.bill)))
}

export const searchBillsRequest = filter => dispatch => {
    return callApi(`bills?${querystring.stringify(filter)}`).then(res => {
        return dispatch(addBills(res.bills));
    })
}
