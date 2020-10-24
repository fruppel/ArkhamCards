import { useMemo } from 'react';
import { flatMap } from 'lodash';

import Card from '@data/Card';
import { combineQueriesOpt } from '@data/query';
import FilterBuilder from '@lib/filters';
import { useInvestigatorCards, usePlayerCards } from '@components/core/hooks';
import useCardsFromQuery from './useCardsFromQuery';

const FILTER_BUILDER = new FilterBuilder('clw');

export default function useCardList(codes: string[], type: 'player' | 'encounter'): [Card[], boolean] {
  const query = useMemo(() => {
    return combineQueriesOpt(
      FILTER_BUILDER.equalsVectorClause(codes, 'code'),
      'and'
    );
  }, [codes]);
  const investigators = useInvestigatorCards();
  const cards = usePlayerCards();

  if (!codes.length) {
    return [[], false];
  }

  if (type === 'player') {
    if (!cards || !investigators) {
      return [[], true];
    }
    const playerCards = flatMap(codes, code => cards[code] || investigators[code] || []);
    return [playerCards, false];
  }
  return useCardsFromQuery({ query });
}
