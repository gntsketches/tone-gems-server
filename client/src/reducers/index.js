import { combineReducers } from "redux";

import authReducer from "./authReducer";


const initialNotes = [
  [2, 4, 4],
  [4, 8, 4],
  [7, 12, 1, true]
];

export const notes = (notes=initialNotes, action={}) => {
  switch(action.type) {
    case 'ADD_NOTE':
      return [...notes, action.payload];
    case 'DELETE_NOTE':
      return notes.filter(note => {
        return !(action.payload[0] === note[0] && action.payload[1] === note[1])
      });
    default:
      return notes;
  }
};

 export const title = (title='', action={}) => {
   switch(action.type) {
     case 'CHANGE_TITLE':
       return action.payload;
     default:
       return title;
   }
 };


const px = 240;

export const updateOctavePx = (octavePx=px, action={}) => {
  switch(action.type) {
    case 'UPDATE_PX':
      return action.payload;
    default:
      return octavePx;
  }
}

export const setScrollTop = (scrollTop=0, action={}) => {
  switch(action.type) {
    case 'SET_SCROLL_TOP':
      return action.payload;
    default:
      return scrollTop;
  }
}

export default combineReducers({
  auth: authReducer,

  notes: notes,
  title: title,
  octavePx: updateOctavePx,
  scrollTop: setScrollTop,
});

// const gems = [
//   {
//     title: 'title1',
//     notes: [
//       [2, 4, 4],
//       [4, 8, 4],
//       [7, 12, 1, true]
//     ]
//   },
// ];
//
// export const updateGems = (notes=initialNotes, action={}) => {
//   switch(action.type) {
//     case 'ADD_NOTE':
//       return [...notes, action.payload];
//     case 'DELETE_NOTE':
//       return notes.filter(note => {
//         return !(action.payload[0] === note[0] && action.payload[1] === note[1])
//       });
//     default:
//       return notes;
//   }
