export type ID = number

export type Participant = {
  id: ID;
  name: string;
  qualityImprovementEvent?: string;
  productionTime: number;
  warranty: number;
  paymentTerms: number;
  value: number;
  actions?: string;
};

export type Participants = Participant[]
