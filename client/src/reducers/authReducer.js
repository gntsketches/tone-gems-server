import { FETCH_USER } from "../actions/types";

export default function(state = null, action) {
  // console.log(action)
  switch (action.type) {
    case FETCH_USER:
      return action.payload || false; // will be either User Model or an empty string in which case we return boolean false
    default:
      return state;
  }
}
