import { Problem } from '../types';

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

export const generateDots = (problem: Problem): { goodDots: Dot[], badDots: Dot[] } => {

  const createSquarePolynomial = (): { goodDots: Dot[], badDots: Dot[] } => {
    const goodDots: Dot[] =
      [
        { x: 0.5, y: -2.25, radius: defaultRadius },
        { x: -0.6, y: -1, radius: defaultRadius },
        { x: 1.8, y: -0.5, radius: defaultRadius },
        { x: 3, y: 5, radius: defaultRadius },
        { x: 2.6, y: 2.4, radius: defaultRadius },
        { x: -1.3, y: 1.1, radius: defaultRadius },
        { x: -2, y: 4, radius: defaultRadius },
      ];

    const badDots: Dot[] =
      [
        { x: 0.5, y: -3.25, radius: defaultRadius },
        { x: 0.5, y: -1.25, radius: defaultRadius },
        { x: 2.5, y: -1, radius: defaultRadius },
        { x: 3.4, y: 2.3, radius: defaultRadius },
        { x: 4, y: 5, radius: defaultRadius },
        { x: 1, y: 0, radius: defaultRadius },
        { x: 1.8, y: 2.5, radius: defaultRadius },
        { x: 2, y: 5, radius: defaultRadius },
        { x: 0, y: -0.75, radius: defaultRadius },
        { x: -1.25, y: -1.3, radius: defaultRadius },
        { x: -2, y: 1, radius: defaultRadius },
        { x: -0.6, y: 1.2, radius: defaultRadius },
        { x: -2.7, y: 3.8, radius: defaultRadius },
        { x: -1.3, y: 4.2, radius: defaultRadius },
      ];

    return { goodDots: goodDots, badDots: badDots };
  };

  const createSine = (): { goodDots: Dot[], badDots: Dot[] } => {
    const goodDots: Dot[] =
      [
        { x: -9.82, y: 2, radius: defaultRadius },
        { x: -3.75, y: 2, radius: defaultRadius },
        { x: 2.24, y: 2, radius: defaultRadius },
        { x: 8.4, y: 2, radius: defaultRadius },
        { x: -8.33, y: 0, radius: defaultRadius },
        { x: -5.3, y: 0, radius: defaultRadius },
        { x: -2.3, y: 0, radius: defaultRadius },
        { x: 0.75, y: 0, radius: defaultRadius },
        { x: 3.8, y: 0, radius: defaultRadius },
        { x: 6.8, y: 0, radius: defaultRadius },
        { x: 9.87, y: 0, radius: defaultRadius },
        { x: -6.84, y: -2, radius: defaultRadius },
        { x: -0.78, y: -2, radius: defaultRadius },
        { x: 5.25, y: -2, radius: defaultRadius },
      ];

    const badDots: Dot[] =
      [
        { x: -9.82, y: 1, radius: defaultRadius },
        { x: -9.82, y: 0, radius: defaultRadius },
        { x: -9.82, y: -1, radius: defaultRadius },
        { x: -9.82, y: -2, radius: defaultRadius },
        { x: -3.75, y: 1, radius: defaultRadius },
        { x: -3.75, y: 0, radius: defaultRadius },
        { x: -3.75, y: -1, radius: defaultRadius },
        { x: -3.75, y: -2, radius: defaultRadius },
        { x: 2.24, y: 1, radius: defaultRadius },
        { x: 2.24, y: 0, radius: defaultRadius },
        { x: 2.24, y: -1, radius: defaultRadius },
        { x: 2.24, y: -2, radius: defaultRadius },
        { x: 8.4, y: 1, radius: defaultRadius },
        { x: 8.4, y: 0, radius: defaultRadius },
        { x: 8.4, y: -1, radius: defaultRadius },
        { x: 8.4, y: -2, radius: defaultRadius },
        { x: -6.84, y: -1, radius: defaultRadius },
        { x: -6.84, y: 0, radius: defaultRadius },
        { x: -6.84, y: 1, radius: defaultRadius },
        { x: -6.84, y: 2, radius: defaultRadius },
        { x: -0.78, y: -1, radius: defaultRadius },
        { x: -0.78, y: 0, radius: defaultRadius },
        { x: -0.78, y: 1, radius: defaultRadius },
        { x: -0.78, y: 2, radius: defaultRadius },
        { x: 5.25, y: -1, radius: defaultRadius },
        { x: 5.25, y: 0, radius: defaultRadius },
        { x: 5.25, y: 1, radius: defaultRadius },
        { x: 5.25, y: 2, radius: defaultRadius },
        { x: -9.82, y: 3, radius: defaultRadius },
        { x: -3.75, y: 3, radius: defaultRadius },
        { x: 2.24, y: 3, radius: defaultRadius },
        { x: 8.4, y: 3, radius: defaultRadius },
        { x: -8.33, y: 3, radius: defaultRadius },
        { x: -5.3, y: 3, radius: defaultRadius },
        { x: -2.3, y: 3, radius: defaultRadius },
        { x: 0.75, y: 3, radius: defaultRadius },
        { x: 3.8, y: 3, radius: defaultRadius },
        { x: 6.8, y: 3, radius: defaultRadius },
        { x: 9.87, y: 3, radius: defaultRadius },
        { x: -6.84, y: 3, radius: defaultRadius },
        { x: -0.78, y: 3, radius: defaultRadius },
        { x: 5.25, y: 3, radius: defaultRadius },
        { x: -9.82, y: -3, radius: defaultRadius },
        { x: -3.75, y: -3, radius: defaultRadius },
        { x: 2.24, y: -3, radius: defaultRadius },
        { x: 8.4, y: -3, radius: defaultRadius },
        { x: -8.33, y: -3, radius: defaultRadius },
        { x: -5.3, y: -3, radius: defaultRadius },
        { x: -2.3, y: -3, radius: defaultRadius },
        { x: 0.75, y: -3, radius: defaultRadius },
        { x: 3.8, y: -3, radius: defaultRadius },
        { x: 6.8, y: -3, radius: defaultRadius },
        { x: 9.87, y: -3, radius: defaultRadius },
        { x: -6.84, y: -3, radius: defaultRadius },
        { x: -0.78, y: -3, radius: defaultRadius },
        { x: 5.25, y: -3, radius: defaultRadius },
      ];

    return { goodDots: goodDots, badDots: badDots };
  };

  const createRationals = (): { goodDots: Dot[], badDots: Dot[] } => {
    const goodDots: Dot[] =
      [
        { x: -9, y: 2.25, radius: defaultRadius },
        { x: -7, y: 2.15, radius: defaultRadius },
        { x: -5, y: 1.85, radius: defaultRadius },
        { x: -4, y: 1.35, radius: defaultRadius },
        { x: -3.3, y: -1, radius: defaultRadius },
        { x: -3.15, y: -5, radius: defaultRadius },
        { x: -3.1, y: -7.5, radius: defaultRadius },
        { x: -2.8, y: 8, radius: defaultRadius },
        { x: -2.6, y: 5, radius: defaultRadius },
        { x: -2, y: 3.2, radius: defaultRadius },
        { x: -0.5, y: 2.5, radius: defaultRadius },
        { x: 1, y: 1.75, radius: defaultRadius },
        { x: 1.6, y: 0, radius: defaultRadius },
        { x: 1.8, y: -2.35, radius: defaultRadius },
        { x: 1.87, y: -5, radius: defaultRadius },
        { x: 1.9, y: -7.5, radius: defaultRadius },
        { x: 2.2, y: 8, radius: defaultRadius },
        { x: 2.43, y: 5, radius: defaultRadius },
        { x: 3, y: 3.65, radius: defaultRadius },
        { x: 4, y: 3.13, radius: defaultRadius },
        { x: 6, y: 2.86, radius: defaultRadius },
        { x: 8, y: 2.75, radius: defaultRadius },
      ];

    const badDots: Dot[] =
      [
        { x: -8, y: 6.4, radius: defaultRadius },
        { x: -6, y: 4.8, radius: defaultRadius },
        { x: -4, y: 3.2, radius: defaultRadius },
        { x: -2, y: 1.6, radius: defaultRadius },
        { x: 0, y: 0, radius: defaultRadius },
        { x: 0, y: -2, radius: defaultRadius },
        { x: 0, y: -4, radius: defaultRadius },
        { x: 0, y: -6, radius: defaultRadius },
        { x: 0, y: -8, radius: defaultRadius },
        { x: 0, y: 8, radius: defaultRadius },
        { x: 0, y: 6, radius: defaultRadius },
        { x: 0, y: 4, radius: defaultRadius },
        { x: 2, y: 2.4, radius: defaultRadius },
        { x: 4, y: 0.8, radius: defaultRadius },
        { x: 6, y: -0.8, radius: defaultRadius },
        { x: 8, y: -2.4, radius: defaultRadius },
      ];

    return { goodDots: goodDots, badDots: badDots };
  };

  const createGaussian = (): { goodDots: Dot[], badDots: Dot[] } => {
    const goodDots: Dot[] =
      [
        { x: -9, y: 0, radius: defaultRadius },
        { x: -2, y: 0, radius: defaultRadius },
        { x: -1, y: 0.5, radius: defaultRadius },
        { x: 0, y: 1.9, radius: defaultRadius },
        { x: 1, y: 3.9, radius: defaultRadius },
        { x: 2, y: 5, radius: defaultRadius },
        { x: 3, y: 3.9, radius: defaultRadius },
        { x: 4, y: 1.9, radius: defaultRadius },
        { x: 5, y: 0.5, radius: defaultRadius },
        { x: 6, y: 0, radius: defaultRadius },
        { x: 9, y: 0, radius: defaultRadius },
      ];

    const badDots: Dot[] =
      [
        { x: -9, y: 1, radius: defaultRadius },
        { x: -8, y: 1, radius: defaultRadius },
        { x: -7, y: 1, radius: defaultRadius },
        { x: -6, y: 1, radius: defaultRadius },
        { x: -5, y: 1, radius: defaultRadius },
        { x: -4, y: 1, radius: defaultRadius },
        { x: -3, y: 1, radius: defaultRadius },
        { x: -2, y: 1, radius: defaultRadius },
        { x: -1, y: 1.5, radius: defaultRadius },
        { x: 0, y: 2.9, radius: defaultRadius },
        { x: 1, y: 4.9, radius: defaultRadius },
        { x: 2, y: 6, radius: defaultRadius },
        { x: 3, y: 4.9, radius: defaultRadius },
        { x: 4, y: 2.9, radius: defaultRadius },
        { x: 5, y: 1.5, radius: defaultRadius },
        { x: 6, y: 1, radius: defaultRadius },
        { x: 7, y: 1, radius: defaultRadius },
        { x: 8, y: 1, radius: defaultRadius },
        { x: 9, y: 1, radius: defaultRadius },
        { x: -9, y: -1, radius: defaultRadius },
        { x: -8, y: -1, radius: defaultRadius },
        { x: -7, y: -1, radius: defaultRadius },
        { x: -6, y: -1, radius: defaultRadius },
        { x: -5, y: -1, radius: defaultRadius },
        { x: -4, y: -1, radius: defaultRadius },
        { x: -3, y: -1, radius: defaultRadius },
        { x: -2, y: -1, radius: defaultRadius },
        { x: -1, y: -0.5, radius: defaultRadius },
        { x: 0, y: 0.9, radius: defaultRadius },
        { x: 1, y: 2.9, radius: defaultRadius },
        { x: 2, y: 4, radius: defaultRadius },
        { x: 3, y: 2.9, radius: defaultRadius },
        { x: 4, y: 0.9, radius: defaultRadius },
        { x: 5, y: -0.5, radius: defaultRadius },
        { x: 6, y: -1, radius: defaultRadius },
        { x: 7, y: -1, radius: defaultRadius },
        { x: 8, y: -1, radius: defaultRadius },
        { x: 9, y: -1, radius: defaultRadius },
      ];

    return { goodDots: goodDots, badDots: badDots };
  };

  switch (problem) {
    case Problem.SquarePolynomial:
      return createSquarePolynomial();
      break;
    case Problem.Sine:
      return createSine();
      break;
    case Problem.Rationals:
      return createRationals();
      break;
    case Problem.Gaussian:
      return createGaussian();
      break;
    default:
      throw Error(`${problem} not implemented`);
      break;
  }
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
    return 0;
  }

  return Math.floor(dots.goodActive.length / (dots.goodActive.length + dots.goodInactive.length) * 100);
};
