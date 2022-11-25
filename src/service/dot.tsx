import { Pair, Data } from './evaluation';

export interface Dot extends Pair {
  radius: number;
}

interface Dots {
  GoodActive: Dot[];
  GoodInactive: Dot[];
  BadActive: Dot[];
  BadInactive: Dot[];
}

const defaultRadius = 0.25;

export const getDotsWithStatus = (data: Data): Dots => {
  return {
    GoodActive: [
      { x: 1.0, y: 1.0, radius: defaultRadius },
      { x: 1.0, y: (1.0 + 1.0), radius: defaultRadius },
      { x: 1.0, y: (1.0 + 2.0), radius: defaultRadius },
      { x: 1.0, y: (1.0 + 3.0), radius: defaultRadius },
      { x: 1.0, y: (1.0 + 4.0), radius: defaultRadius },
    ],
    GoodInactive: [
      { x: 2.0, y: 1.41, radius: defaultRadius },
      { x: 2.0, y: (1.41 + 1.0), radius: defaultRadius },
      { x: 2.0, y: (1.41 + 2.0), radius: defaultRadius },
      { x: 2.0, y: (1.41 + 3.0), radius: defaultRadius },
      { x: 2.0, y: (1.41 + 4.0), radius: defaultRadius },
    ],
    BadActive: [
      { x: 3.0, y: 1.73, radius: defaultRadius },
      { x: 3.0, y: (1.73 + 1.0), radius: defaultRadius },
      { x: 3.0, y: (1.73 + 2.0), radius: defaultRadius },
      { x: 3.0, y: (1.73 + 3.0), radius: defaultRadius },
      { x: 3.0, y: (1.73 + 4.0), radius: defaultRadius },
    ],
    BadInactive: [
      { x: 4.0, y: 2.0, radius: defaultRadius },
      { x: 4.0, y: (2.0 + 1.0), radius: defaultRadius },
      { x: 4.0, y: (2.0 + 2.0), radius: defaultRadius },
      { x: 4.0, y: (2.0 + 3.0), radius: defaultRadius },
      { x: 4.0, y: (2.0 + 4.0), radius: defaultRadius },
    ]
  };
};
