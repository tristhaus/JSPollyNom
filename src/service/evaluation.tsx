import { Datum as PlotlyDatum } from 'plotly.js';
import { Expression } from '../types';

export interface Pair {
  x: number;
  y: number;
}

// first index: expression
// second index: branch
// third index: individual ordered pair
export type Data = Pair[][][];

export interface TransformedData {
  x: PlotlyDatum[];
  y: PlotlyDatum[];
}

// the limits of the window
const minX = -10.5;
const maxX = 10.5;

// The absolute value of y after which the point shall not be included in the resulting data.
const Limit = 100;

// Epsilon is the lower limit for increments etc.
const Epsilon = 1e-4;

// TargetDistance is the intended upper bound for x increments, which should still be above \ref Epsilon.
const TargetDistance = 5e-3;

// InitialIncrement is the initial increment for x.
const InitialIncrement = 1e-3;

// LargeIncrement is the increment to find branches.
const LargeIncrement = 1e-2;

const isValidResult = (result: number | null): result is number => {
  return result !== null && !isNaN(result) && isFinite(result);
};

const forwardX = (x: number): number => x;
const backwardX = (x: number): number => -x;

const squareDistance = (x1: number, y1: number, x2: number, y2: number): number => (x1 - x2) ** 2 + (y1 - y2) ** 2;

const workAnInterval = (expression: Expression, direction: (x: number) => number, xInCurrentInterval: number): { branch: Pair[], lastValidXinCurrentInterval: number, x: number } => {
  const branch: Pair[] = [];

  let x = xInCurrentInterval + direction(Epsilon);
  let yOptional = expression.evaluate(x);
  let xOld = xInCurrentInterval;

  let y = isValidResult(yOptional) ? yOptional : 0.0;
  let yOld = isValidResult(yOptional) ? yOptional : expression.evaluate(xInCurrentInterval) as number; // func(xInCurrentInterval) must be valid

  let incr = InitialIncrement;

  // scan the interval until it is interrupted
  let interrupt = false;
  while (!interrupt) {
    interrupt = true;
    yOptional = expression.evaluate(x);

    if (isValidResult(yOptional)) {
      y = yOptional as number;
      interrupt = !(minX <= x && x <= maxX && -Limit <= y && y <= Limit);
    }

    if (!interrupt) {
      const squareDist = squareDistance(x, y, xOld, yOld);
      if (squareDist < TargetDistance || incr < Epsilon) {
        if (squareDist < Epsilon) {
          incr *= 2.0;
        }

        branch.push({ x: x, y: y });
        xOld = x;
        yOld = y;
        x = x + direction(incr);
      }
      else {
        incr *= 0.5;
        x = x - direction(incr);
      }
    }
  }

  return { branch: branch, lastValidXinCurrentInterval: xOld, x: x };
};

export const createBranches = (expression: Expression): Pair[][] => {

  let lastXinPreviousInterval = minX;
  let x = lastXinPreviousInterval;

  const retval: Pair[][] = [];

  while (x < maxX) {
    // look for interval
    let xInCurrentInterval = lastXinPreviousInterval;
    let foundInterval = false;
    while (!foundInterval && xInCurrentInterval < maxX) {
      xInCurrentInterval += LargeIncrement;
      const result = expression.evaluate(xInCurrentInterval);
      foundInterval = isValidResult(result);
    }

    // maybe the function is not defined anywhere in our window
    if (!foundInterval) {
      break;
    }

    // work inside interval - backward
    const backwardResult = workAnInterval(expression, backwardX, xInCurrentInterval);

    // work inside interval - forward
    const forwardResult = workAnInterval(expression, forwardX, xInCurrentInterval);

    // finish up interval
    lastXinPreviousInterval = forwardResult.lastValidXinCurrentInterval;
    x = forwardResult.x;

    retval.push(backwardResult.branch.concat(forwardResult.branch).sort((a, b) => a.x - b.x));
  }

  // todo: check if we cannot have empty retval

  return retval.filter(value => value.length > 1);
};

export const transform = (data: Data): TransformedData[] => {

  const addDataFromBranch = (branch: Pair[], transformedData: TransformedData) => {
    branch.reduce<TransformedData>((accumulator, pair) => {
      accumulator.x.push(pair.x);
      accumulator.y.push(pair.y);
      return accumulator;
    }, transformedData);
  };

  const retval = data.map(
    branches => {
      const transformed: TransformedData = {
        x: [],
        y: [],
      };

      if (branches.length === 0) {
        return transformed;
      }

      addDataFromBranch(branches[0], transformed);

      for (let branchIndex = 1; branchIndex < branches.length; branchIndex++) {

        // add gap
        const leftBranch = branches[branchIndex - 1];
        const rightBranch = branches[branchIndex];
        const leftX = leftBranch[leftBranch.length - 1].x;
        const rightX = rightBranch[0].x;
        const averageX = 0.5 * (leftX + rightX);
        transformed.x.push(averageX);
        transformed.y.push(null);

        addDataFromBranch(rightBranch, transformed);
      }

      return transformed;
    });

  return retval;
};
