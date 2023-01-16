import { PropsWithChildren } from 'react';

import { Participants } from '@lotus/shared';

import CountdownRow from './countdownRow';
import ColumnNamesRow from './columnNamesRow';
import { Loading } from '../useJoinRoom';
import { useBid } from './useBid';

export type TableHeaderProps = {
  participants?: Participants;
  loading?: Loading;
} & PropsWithChildren;

export function HeaderRows({ participants, loading }: TableHeaderProps) {
  const bid = useBid();

  return (
    <>
      <CountdownRow participants={participants} loading={loading} bid={bid} />
      <ColumnNamesRow participants={participants} loading={loading} bid={bid} />
    </>
  );
}

export default HeaderRows;
