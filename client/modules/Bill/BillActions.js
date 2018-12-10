import querystring from "querystring";
import callApi from '../../util/apiCaller';

export const UPDATE_BILL = 'UPDATE_BILL';
export const ADD_BILLS = 'ADD_BILLS';

export const addBills = (bills) => {
    return {
        type: ADD_BILLS,
        bills,
    }
};

export function fetchBills() {
    return (dispatch) => {
        return callApi('bills').then(res => {
            return dispatch(addBills(res.bills));
        });
    }
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