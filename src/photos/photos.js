export function setPhotosDispatch(arg) {
    return {type: 'setPhotos', payload: arg}
}

// Initial state
const initialState = {
  photos: []
};

// Reducer
export default function photoReducer(state = initialState, action) {
  switch (action.type) {
    case 'setPhotos':
      return {
        ...state,
        photos: action.payload,
      };
    default:
      return state;
  }
}