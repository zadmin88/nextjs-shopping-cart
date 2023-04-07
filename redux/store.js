import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { reducer } from './reducer';

const makeStore = (context) =>
  configureStore({
    reducer: reducer,
    devTools: true,
  });

export const wrapper = createWrapper(makeStore, { debug: true });
