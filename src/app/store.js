import { configureStore } from '@reduxjs/toolkit';
import foldersReducer from '../folders/forders';
import photoReducer from '../photos/photos';

export const store = configureStore({
  reducer: {
    folders: foldersReducer, 
    photos: photoReducer,
  },
});
