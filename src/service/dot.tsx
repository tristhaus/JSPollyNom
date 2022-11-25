import { Pair, Data } from './evaluation';

export interface Dot extends Pair {
  radius: number;
}

export interface Dots {
  goodActive: Dot[];
  goodInactive: Dot[];
  badActive: Dot[];
  badInactive: Dot[];
}

const defaultRadius = 0.25;

export const generateDots = (): { goodDots: Dot[], badDots: Dot[] } => {
  const goodDots: Dot[] =
    [
      { x: 1, y: 2, radius: defaultRadius },
      { x: -1, y: -2, radius: defaultRadius },
      { x: 3, y: 4, radius: defaultRadius },
    ];

  const badDots: Dot[] =
    [
      { x: 5, y: 1, radius: defaultRadius },
      { x: -5, y: -4, radius: defaultRadius }
    ];

  return { goodDots: goodDots, badDots: badDots };
};

export const getDotsWithStatus = (goodDots: Dot[], badDots: Dot[], data: Data): Dots => {
  const isActive = (dot: Dot): boolean => {
    const squareRadius = dot.radius ** 2;
    return data.some(func => func.some(branch => branch.some(pair => (pair.x - dot.x) ** 2 + (pair.y - dot.y) ** 2 <= squareRadius)));
  };

  const dots: Dots = {
    goodActive: [],
    goodInactive: [],
    badActive: [],
    badInactive: []
  };

  goodDots.forEach(dot => {
    if (isActive(dot)) {
      dots.goodActive.push(dot);
    }
    else {
      dots.goodInactive.push(dot);
    }
  });

  badDots.forEach(dot => {
    if (isActive(dot)) {
      dots.badActive.push(dot);
    }
    else {
      dots.badInactive.push(dot);
    }
  });

  return dots;
};

export const calculateScore = (dots: Dots): number => {
  if (dots.badActive.length > 0) {
    return -1;
  }

  return 2 ** dots.goodActive.length - 1;
};
