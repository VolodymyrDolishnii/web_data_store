import { configureStore } from '@reduxjs/toolkit';
import foldersReducer from '../folders/forders';

export const store = configureStore({
  reducer: {
    folders: foldersReducer, 
  },
});
