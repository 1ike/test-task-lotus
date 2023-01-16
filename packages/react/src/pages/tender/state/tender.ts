/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Bid, Countdown, Participants } from '@lotus/shared';
import type { RootState } from '../../../state/store';

type Tender = {
  participants?: Participants;
  bid?: Bid;
  countdown?: Countdown;
};

const tenderInitialState: Tender = {};

const slice = createSlice({
  name: 'tender',
  initialState: tenderInitialState,
  /* eslint-disable no-param-reassign */
  reducers: {
    setParticipants: (state, action: PayloadAction<Participants>) => {
      state.participants = action.payload;
    },
    setBid: (state, action: PayloadAction<Bid>) => {
      const newBid = action.payload;
      if (newBid.id !== state.bid?.id) {
        state.bid = newBid;
      }
    },
    setCountdown: (state, action: PayloadAction<Countdown>) => {
      state.countdown = action.payload;
    },
  },
  /* eslint-enable no-param-reassign */
});

export const tenderReducerName = slice.name;
export const tenderReducer = slice.reducer;
export const tenderActions = slice.actions;

export const selectParticipants = (state: RootState) => state[tenderReducerName].participants;
export const selectBid = (state: RootState) => state[tenderReducerName].bid;
export const selectCountdown = (state: RootState) => state[tenderReducerName].countdown;
