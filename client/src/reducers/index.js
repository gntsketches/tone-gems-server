import { combineReducers } from "redux";

import authReducer from "./authReducer";


const initialNotes = [
  { octave: 3, cents: 0, start: 0, duration: 4, selected: false },
  { octave: 4, cents: 200, start: 4, duration: 2, selected: false },
  { octave: 4, cents: 400, start: 8, duration: 3, selected: true }
]

export const notes = (notes=initialNotes, action={}) => {
  switch(action.type) {
    case 'PROCESS_NOTE_EVENT':
      if (notes.some(note => {
          return (action.payload.octave===note.octave &&
                  action.payload.cents===note.cents &&
                  action.payload.start===note.start)
      })) {
        return notes.filter(note => {
          return !(action.payload.octave===note.octave &&
                   action.payload.cents===note.cents &&
                   action.payload.start===note.start)
        })
      }
      return [...notes, action.payload];
    default:
      return notes;
  }
};

 export const title = (title='test', action={}) => {
   console.log('title action in reducers', action)
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

// export const notes = (notes=initialNotes, action={}) => {
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
// };

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
