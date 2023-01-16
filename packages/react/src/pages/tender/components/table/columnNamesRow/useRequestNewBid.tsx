import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { ParticipantID, NewBidRequest, SocketEvent } from '@lotus/shared';
import { socket } from '../../../../../api';
import { useAppSelector } from '../../../../../state/store';
import { selectBid } from '../../../state/tender';

export function useRequestNewBid() {
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

  return requestNewBid;
}
