import _ from "lodash";

import { UPDATE_BILL, ADD_BILLS } from './BillActions';

// Initial State
const initialState = { data: [] };

const BillReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_BILL:
      const billToUpdateIndex = _.findIndex(state.data, bill => action.bill.number === bill.number);
      const copyState = _.cloneDeep(state);
      copyState.data[billToUpdateIndex] = action.bill
      return copyState

    case ADD_BILLS:
      return {
        data: action.bills,
      };

    default:
      return state;
  }
};

/* Selectors */

// Get all posts
export const getBills = state => state.bills.data;

// Get post by cuid
export const getBill = (state, number) => state.bills.data.filter(bill => bill.number === number)[0];

// Export Reducer
export default BillReducer;