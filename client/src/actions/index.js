import axios from 'axios';

import { FETCH_USER } from "./types";

// AUTHENTICATE **************************************************************************

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user')
  dispatch({ type: FETCH_USER, payload: res.data });
};

// LOAD/SAVE COMPOSITIONS

export const loadComposition = (id) => async dispatch => {
  console.log('in loadComposition', id)
  // const res = await axios.get(`/composition/load/${id}`)
  const res = await axios.get('/composition/load', {
    params: { id }
  })
  // receiving params as req.query works for get, not post...
  console.log('res', res)
  dispatch({ type: 'LOAD_COMPOSITION', payload: res.data })
}

export const saveComposition = composition => async dispatch => {

  console.log('in saveComposition', composition)
  const res = await axios.post('/composition/save', {
    params: { composition }
  })
  console.log('res', res)
  dispatch({ type: 'SAVE_COMPOSITION', payload: res.data })
}


// MANAGE CURRENT COMPOSITION ************************************************************

export const processNoteEvent = (note) => {
    return {
      type: 'PROCESS_NOTE_EVENT',
      payload: note
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

export const setScrollTop = value => {
  return {
    type: 'SET_SCROLL_TOP',
    payload: value,
  }
};



// export const addRemoveNote = (stateNotes, newNote) => {
//   if (stateNotes.some(note => {
//     return newNote[0]===note[0] && newNote[1]===note[1]
//   })
//   ) {
//     return {
//       type: 'DELETE_NOTE',
//       payload: newNote
//     }
//   }
//   return {
//     type: 'ADD_NOTE',
//     payload: newNote
//   }
// };
