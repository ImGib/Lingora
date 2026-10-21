export type StartingPointItem = {
  id: string;
  claimCode: string;
  modality: string;
  accepted: string[];
};

export type StartingPointResponse = { itemId: string; value: string };

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase('en');
}

export function evaluateStartingPoint(
  items: StartingPointItem[],
  responses: StartingPointResponse[],
) {
  const responseByItem = new Map(responses.map((response) => [response.itemId, response.value]));
  const coverage = items.map((item) => {
    const value = responseByItem.get(item.id);
    const correct = value !== undefined && item.accepted.some((answer) => normalize(answer) === normalize(value));
    return {
      itemId: item.id,
      claimCode: item.claimCode,
      modality: item.modality,
      result: correct ? ('ALREADY_DEMONSTRATED' as const) : ('NEED_MORE_EVIDENCE' as const),
      correct,
    };
  });

  return {
    coverage,
    recommendedStart: coverage.every((claim) => claim.correct) ? 'WEEK_1_DAY_2' : 'WEEK_1_DAY_1',
  };
}
