import axios from 'axios';

import { FETCH_USER } from "./types";

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user')
  dispatch({ type: FETCH_USER, payload: res.data });
};


// ************************************************************

export const addRemoveNote = (stateNotes, newNote) => {
  if (stateNotes.some(note => {
    return newNote[0]===note[0] && newNote[1]===note[1]
  })
  ) {
    return {
      type: 'DELETE_NOTE',
      payload: newNote
    }
  }
  return {
    type: 'ADD_NOTE',
    payload: newNote
  }
};

export const changeTitle = value => {
  return {
    type: 'CHANGE_TITLE',
    payload: value
  }
};

export const updateOctavePx = value => {
  return {
    type: 'UPDATE_PX',
    payload: value
  }
};
