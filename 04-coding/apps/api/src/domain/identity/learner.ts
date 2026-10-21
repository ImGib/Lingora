export const LEARNER_STATUSES = ['ACTIVE', 'SUSPENDED', 'DELETED'] as const;
export type LearnerStatus = (typeof LEARNER_STATUSES)[number];

export type Learner = Readonly<{
  id: string;
  status: LearnerStatus;
  createdAt: Date;
  updatedAt: Date;
}>;
