import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { ParticipantID, BroadcastData, NewBidRequest, SocketEvent } from '@lotus/shared';
import { socket } from '../../../api';
import { useAppDispatch, useAppSelector } from '../../../state/store';
import { selectBid, tenderActions } from '../state/tender';

export function useSubscribeBid() {
  const dispatch = useAppDispatch();
  const bid = useAppSelector(selectBid);

  const { roomName } = useParams();

  const requestNewBid = useCallback(
    (participantID: ParticipantID) => {
      if (!roomName) return;

      const params: NewBidRequest = {
        previousBidID: bid?.id,
        participantID,
        roomName,
      };
      socket.emit(SocketEvent.MakeNewBid, params);
    },
    [bid, roomName],
  );

  const handler = useCallback(
    (broadcastData: BroadcastData) => {
      if (broadcastData.bid && broadcastData.bid.id !== bid?.id) {
        dispatch(tenderActions.setBid(broadcastData.bid));
      }
    },
    [bid, dispatch],
  );

  useEffect(() => {
    socket.on(SocketEvent.Countdown, handler);

    return () => {
      socket.off(SocketEvent.Countdown, handler);
    };
  }, [handler]);

  return requestNewBid;
}
