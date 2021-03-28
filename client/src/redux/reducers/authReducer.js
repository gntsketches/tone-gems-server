import { FETCH_USER } from "../actions/types";

export default function(state = null, action) {
  // console.log(action)
  switch (action.type) {
    case FETCH_USER:
      return action.payload || false;
      // will be either User Model or an empty string, in which case we return boolean false
    default:
      return state;
  }
}

// Vid 87: ~ 5:30
// Situation: make req to backend to get current user, authReducer returns null
  //  'null' indicates "we really don't know what's up right now"
// Situation: req complete, user is logged in, authReducer returns User-model
  //  User model is an Object containing user ID
// Situation: req done, user is *not* logged in, authReducer returns false
  //  False means "we're sure the user isn't logged in"
