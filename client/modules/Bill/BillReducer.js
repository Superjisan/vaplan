import _ from "lodash";

import { UPDATE_BILL, ADD_BILLS, ADD_NOTIFICATION } from './BillActions';

// Initial State
const initialState = { data: [], notification: {} };

const BillReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_BILL:
      const billToUpdateIndex = _.findIndex(state.data, bill => action.bill.number === bill.number);
      const copyState = _.cloneDeep(state);
      copyState.data[billToUpdateIndex] = action.bill
      return copyState
    case ADD_NOTIFICATION:
      const stateToReturn = { ...state, notification: action.notification };
      return stateToReturn
    case ADD_BILLS:
      return {
        data: action.bills,
      };

    default:
      return state;
  }
};

/* Selectors */

// Get bills
export const getBills = state => state.bills.data;

// Get specific bill
export const getBill = (state, number) => state.bills.data.filter(bill => bill.number === number)[0];

// 
export const getNotification = (state) => state.bills.notification

// Export Reducer
export default BillReducer;