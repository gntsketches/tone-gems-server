import { combineReducers } from "redux";

import authReducer from "./authReducer";


const initialNotes = [
  // { octave: 3, cents: 0, nextCents: 75, start: 0, duration: 4, selected: false },
  // { octave: 4, cents: 200, nextCents: 250, start: 4, duration: 2, selected: false },
  { octave: 2, cents: 850, nextCents: 1000, start: 9, duration: 2, selected: true },
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
   // console.log('title action in reducers', action)
   switch(action.type) {
     case 'CHANGE_TITLE':
       return action.payload;
     default:
       return title;
   }
 };



export const updateOctavePx = (octavePx=240, action={}) => {
  switch(action.type) {
    case 'UPDATE_PX':
      return action.payload;
    default:
      return octavePx;
  }
}


export const compositionLength = (length=32, action={}) => {
  switch(action.type) {
    case 'SET_COMPOSITION_LENGTH':
      return action.payload;
    default:
      return length;
  }
}

export const setCanvasWidth = (width=null, action={}) => {
  // console.log('set width', action)
  switch(action.type) {
    case 'SET_CANVAS_WIDTH':
      return action.payload;
    default:
      return width;
  }
}

export const setCanvasHeight = (height=null, action={}) => {
  // rename 'onscreenHeight'
  // console.log('set height', action)
  switch(action.type) {
    case 'SET_CANVAS_HEIGHT':
      return action.payload;
    default:
      return height;
  }
}

export const setGemBoxX = (x=0, action={}) => {
    console.log('reducer box x', action.payload)
  switch(action.type) {
    case 'SET_GEM_BOX_X':
      return action.payload;
    default:
      return x;
  }
}

export const setGemBoxY = (y=0, action={}) => {
  switch(action.type) {
    case 'SET_GEM_BOX_Y':
      return action.payload;
    default:
      return y;
  }
}

export const setGemBoxWidth = (width=600, action={}) => {
  switch(action.type) {
    case 'SET_GEM_BOX_WIDTH':
      return action.payload;
    default:
      return width;
  }
}

export const setGemBoxHeight = (height=350, action={}) => {
  // note how zoom setting affects scroll speed...
  switch(action.type) {
    case 'SET_GEM_BOX_HEIGHT':
      return action.payload;
    default:
      return height;
  }
}

export default combineReducers({
  auth: authReducer,

  title: title,
  notes: notes,
  compositionLength: compositionLength,
  octavePx: updateOctavePx,
  canvasWidth: setCanvasWidth,
  canvasHeight: setCanvasHeight,
  gemBoxX: setGemBoxX,
  gemBoxY: setGemBoxY,
  gemBoxWidth: setGemBoxWidth,
  gemBoxHeight: setGemBoxHeight,
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
