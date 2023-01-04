import { useContext } from 'react';

import Countdown from './countdown';
import { ParticipantsContext } from '../../../contexts/paticipants';
import { BidContext } from '../../../contexts/bid';

export function CountdownRow() {
  const { participants, loading } = useContext(ParticipantsContext);
  const { bid } = useContext(BidContext);
  const activeParticipantID = bid?.participantID;

  console.log('--- CountdownRow render ---');

  return (
    <tr>
      <th>Ход</th>
      {participants.length === 0 && !loading ? (
        <th>
          <Countdown />
        </th>
      ) : (
        participants.map((participant) => (
          <th key={participant.id}>{participant.id === activeParticipantID && <Countdown />}</th>
        ))
      )}
    </tr>
  );
}

export default CountdownRow;
