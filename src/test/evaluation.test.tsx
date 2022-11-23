import { createBranches, Data, transform, TransformedData } from "../service/evaluation";

test('for x^2, create two branches', () => {
  const f = (x: number): number => {
    return x ** 2;
  }

  const result = createBranches(f);

  expect(result).toHaveLength(1);
});

test('for 1/x, create two branches', () => {
  const f = (x: number): number => {
    return 1.0 / x;
  }

  const result = createBranches(f);

  expect(result).toHaveLength(2);
});

test('for tan(x), create seven branches', () => {
  const f = (x: number): number => {
    return Math.tan(x);
  }

  const result = createBranches(f);

  expect(result).toHaveLength(7);
});

test('for ln(x), create one correct branch', () => {
  const f = (x: number): number => {
    return Math.log(x);
  }

  const result = createBranches(f);

  expect(result).toHaveLength(1);
  expect(result[0][0].x).toBeGreaterThan(0.0)
});

test('for sqrt(-1), create no branches', () => { // todo : check if this conforms to the use case in plotly
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const f = (_x: number): number => {
    return Math.sqrt(-1);
  }

  const result = createBranches(f);

  expect(result).toHaveLength(0);
});

test('single branch transforms to one contiguous data', () => {
  const data: Data = [[[{ x: 1.0, y: 1.1 }, { x: 2.0, y: 2.1 }, { x: 3.0, y: 3.1 },]]]

  const result = transform(data);

  const expected: TransformedData[] = [{ x: [1.0, 2.0, 3.0], y: [1.1, 2.1, 3.1] }];

  expect(result).toEqual(expected)
});

test('two branches transform to data separated by null', () => {
  const data: Data = [[
    [{ x: 1.0, y: 1.1 }, { x: 2.0, y: 2.1 }, { x: 3.0, y: 3.1 },],
    [{ x: 4.0, y: 1.1 }, { x: 5.0, y: 2.1 }, { x: 6.0, y: 3.1 },]
  ]]

  const result = transform(data);

  const expected: TransformedData[] = [{ x: [1.0, 2.0, 3.0, 3.5, 4.0, 5.0, 6.0], y: [1.1, 2.1, 3.1, null, 1.1, 2.1, 3.1] }];

  expect(result).toEqual(expected)
});

test('three branches transform to data separated by null', () => {
  const data: Data = [[
    [{ x: 1.0, y: 1.1 }, { x: 2.0, y: 2.1 }, { x: 3.0, y: 3.1 },],
    [{ x: 4.0, y: 1.1 }, { x: 5.0, y: 2.1 }, { x: 6.0, y: 3.1 },],
    [{ x: 8.0, y: 1.1 }, { x: 9.0, y: 2.1 }, { x: 10.0, y: 3.1 },]
  ]]

  const result = transform(data);

  const expected: TransformedData[] = [
    {
      x: [1.0, 2.0, 3.0, 3.5, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0],
      y: [1.1, 2.1, 3.1, null, 1.1, 2.1, 3.1, null, 1.1, 2.1, 3.1]
    }];

  expect(result).toEqual(expected)
});