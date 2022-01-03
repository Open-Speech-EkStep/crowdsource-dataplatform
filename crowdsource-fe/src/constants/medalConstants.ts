import type { MedalsType } from 'types/MedalsType';

export const MEDALS_MAPPING = {
  bronze: 'bronze',
  silver: 'silver',
  gold: 'gold',
  platinum: 'platinum',
} as const;

export const MEDALS = ['bronze', 'silver', 'gold', 'platinum'] as Array<MedalsType>;
