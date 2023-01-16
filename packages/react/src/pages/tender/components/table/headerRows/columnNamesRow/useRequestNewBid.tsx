import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { ParticipantID, NewBidRequest, SocketEvent, Bid } from '@lotus/shared';
import { socket } from '../../../../../../api';

export function useRequestNewBid(bid: Bid | undefined) {
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

  return requestNewBid;
}
