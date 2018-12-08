import callApi from '../../util/apiCaller';

export const UPDATE_BILL = 'UPDATE_BILL';
export const ADD_BILLS = 'ADD_BILLS';

export const addBills = (bills) => {return{
    type: ADD_BILLS,
    bills,
}};

export const fetchBills = () => dispatch => {
    return callApi('bills').then(res => {
        console.log("bills", res.bills)
        dispatch(addBills(res.bills));
    });
}