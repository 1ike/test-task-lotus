export type ParticipantID = number;

export type Participant = {
  id: ParticipantID;
  name: string;
  qualityImprovementEvent?: string;
  productionTime: number;
  warranty: number;
  paymentTerms: number;
  value: number;
  actions?: string;
};

export type Participants = Participant[];

export type Countdown = number;

export type BidID = string;

export type Bid = {
  id: BidID;
  participantID: ParticipantID;
};

export type NewBidRequest = {
  previousBidID: BidID | undefined;
  participantID: ParticipantID;
};

export type BroadcastData = {
  countdown: Countdown;
  bid?: Bid;
};
