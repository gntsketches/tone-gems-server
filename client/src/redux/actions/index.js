import axios from 'axios';

import store from '../store';
import { FETCH_USER } from "./types";
import {
  octaves, offscreenOctavePx, offscreenCellWidth, maxZoom
} from "../../config/constants";

const offscreenHeight = offscreenOctavePx*octaves


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
    return { type: 'PROCESS_NOTE_EVENT', payload: note }
};

export const changeTitle = value => {
  return { type: 'CHANGE_TITLE', payload: value }
};

export const updateOctavePx = value => {
  return { type: 'UPDATE_PX', payload: value }
};

export const setCanvasWidth = width => {
  return { type: 'SET_CANVAS_WIDTH', payload: width }
}

export const setCanvasHeight = height => {
  return { type: 'SET_CANVAS_HEIGHT', payload: height }
}

export const setGemBoxX = deltaX => {
  console.log('boxx', deltaX)
  const state = store.getState()
  const { gemBoxX, gemBoxWidth, compositionLength } = state
  const offscreenWidth = offscreenCellWidth * compositionLength

  const deltaXAdjusted = deltaX * (gemBoxWidth / state.canvasWidth)
  let gemBoxXAdjusted = gemBoxX - deltaXAdjusted
  const gemBoxXMax =  offscreenWidth - gemBoxWidth
  if (gemBoxXAdjusted < 0) { gemBoxXAdjusted = 0 }
  if (gemBoxXAdjusted > gemBoxXMax) { gemBoxXAdjusted = gemBoxXMax}
  console.log('boxxadj', gemBoxXAdjusted)
  return { type: 'SET_GEM_BOX_X', payload: gemBoxXAdjusted }
};

export const setGemBoxY = deltaY => {
  const state = store.getState()
  const { gemBoxY, gemBoxHeight } = state
  const deltaYAdjusted = deltaY * (gemBoxHeight / state.canvasHeight)
  let gemBoxYAdjusted = gemBoxY - deltaYAdjusted
  const gemBoxYMax =  offscreenHeight - gemBoxHeight
  if (gemBoxYAdjusted < 0) { gemBoxYAdjusted = 0 }
  if (gemBoxYAdjusted > gemBoxYMax) { gemBoxYAdjusted = gemBoxYMax}
  return { type: 'SET_GEM_BOX_Y', payload: gemBoxYAdjusted } // could limit calls with if-already-at-range logic
};

export const setGemBoxWidth = value => {
  return { type: 'SET__GEM_BOX_WIDTH', payload: value, }
};

export const setGemBoxHeight = deltaX => {
  const state = store.getState()
  const { gemBoxHeight } = state
  let gemBoxHeightAdjusted = gemBoxHeight - deltaX
  if (gemBoxHeightAdjusted > offscreenHeight) { gemBoxHeightAdjusted = offscreenHeight } // could limit calls with if-already-at-range logic
  if (gemBoxHeightAdjusted < offscreenHeight / maxZoom) { gemBoxHeightAdjusted = offscreenHeight / maxZoom }
  return { type: 'SET_GEM_BOX_HEIGHT', payload: gemBoxHeightAdjusted, }
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
