import { calculateScore, Dot, Dots, getDotsWithStatus } from '../service/dot';
import { Data } from '../service/evaluation';

test('good dot evaluation works correctly', () => {
  const data: Data = [
    [[{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 0.5 }]],
  ];

  const goodDots: Dot[] = [
    { x: 0, y: 0, radius: 1 },
    { x: 2, y: 0, radius: 1 },
    { x: 3, y: 0, radius: 1 },
  ];

  const badDots: Dot[] = [
  ];

  const result = getDotsWithStatus(goodDots, badDots, data);

  expect(result.goodActive).toHaveLength(2);
  expect(result.goodActive[0].x).toBe(2);
  expect(result.goodActive[1].x).toBe(3);
  expect(result.goodInactive).toHaveLength(1);
  expect(result.goodInactive[0].x).toBe(0);
});

test('bad dot evaluation works correctly', () => {
  const data: Data = [
    [[{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 0.5 }]],
  ];

  const goodDots: Dot[] = [
  ];

  const badDots: Dot[] = [
    { x: 0, y: 0, radius: 1 },
    { x: 2, y: 0, radius: 1 },
    { x: 3, y: 0, radius: 1 },
  ];

  const result = getDotsWithStatus(goodDots, badDots, data);

  expect(result.badActive).toHaveLength(2);
  expect(result.badActive[0].x).toBe(2);
  expect(result.badActive[1].x).toBe(3);
  expect(result.badInactive).toHaveLength(1);
  expect(result.badInactive[0].x).toBe(0);
});

test('combined dot evaluation works correctly', () => {
  const data: Data = [
    [[{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 0.5 }]],
  ];

  const goodDots: Dot[] = [
    { x: 0, y: 0, radius: 1 },
    { x: 2, y: 0, radius: 1 },
  ];

  const badDots: Dot[] = [
    { x: 3, y: 0, radius: 1 },
  ];

  const result = getDotsWithStatus(goodDots, badDots, data);

  expect(result.goodActive).toHaveLength(1);
  expect(result.goodActive[0].x).toBe(2);
  expect(result.goodInactive).toHaveLength(1);
  expect(result.goodInactive[0].x).toBe(0);
  expect(result.badActive).toHaveLength(1);
  expect(result.badActive[0].x).toBe(3);
  expect(result.badInactive).toHaveLength(0);
});

test('bad dots cause a negative score', () => {
  const dots: Dots = {
    goodActive: [
      { x: 0, y: 0, radius: 1 },
      { x: 0, y: 0, radius: 1 },
    ],
    goodInactive: [
      { x: 0, y: 0, radius: 1 },
      { x: 0, y: 0, radius: 1 },
    ],
    badActive: [
      { x: 0, y: 0, radius: 1 },
    ],
    badInactive: [
      { x: 0, y: 0, radius: 1 },
    ],
  };

  const result = calculateScore(dots);

  expect(result).toBeLessThan(0);
});

test('all dots inactive causes a zero score', () => {
  const dots: Dots = {
    goodActive: [
    ],
    goodInactive: [
      { x: 0, y: 0, radius: 1 },
      { x: 0, y: 0, radius: 1 },
    ],
    badActive: [
    ],
    badInactive: [
      { x: 0, y: 0, radius: 1 },
    ],
  };

  const result = calculateScore(dots);

  expect(result).toBe(0);
});

test('good dots cause a positive score of 1', () => {
  const dots: Dots = {
    goodActive: [
      { x: 0, y: 0, radius: 1 },
    ],
    goodInactive: [
      { x: 0, y: 0, radius: 1 },
      { x: 0, y: 0, radius: 1 },
      { x: 0, y: 0, radius: 1 },
    ],
    badActive: [
    ],
    badInactive: [
      { x: 0, y: 0, radius: 1 },
      { x: 0, y: 0, radius: 1 },
    ],
  };

  const result = calculateScore(dots);

  expect(result).toBe(1);
});

test('good dots cause a positive score of 3', () => {
  const dots: Dots = {
    goodActive: [
      { x: 0, y: 0, radius: 1 },
      { x: 0, y: 0, radius: 1 },
    ],
    goodInactive: [
      { x: 0, y: 0, radius: 1 },
      { x: 0, y: 0, radius: 1 },
    ],
    badActive: [
    ],
    badInactive: [
      { x: 0, y: 0, radius: 1 },
      { x: 0, y: 0, radius: 1 },
    ],
  };

  const result = calculateScore(dots);

  expect(result).toBe(3);
});