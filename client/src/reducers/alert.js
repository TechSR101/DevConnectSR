import { REMOVE_ALERT, SET_ALERT } from "../actions/types";

const initialState = [];

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_ALERT:
      return [...state, action.payload.msg];
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== action.payload.id);
    default:
      return state;
  }
}

// const initialState = [
//     {
//         id : 1,
//         msg : "Please Log in",
//         alertType : "success"
//     }
// ]
