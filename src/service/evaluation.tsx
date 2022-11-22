import { Datum as PlotlyDatum } from 'plotly.js';

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

// each branch must be sorted
export const createBranches = (func: (x: number) => number): Pair[][] => {
  const branchA: Pair[] = [];
  const branchB: Pair[] = [];

  for (let x = -10.1; x < 2; x = x + 0.01) {
    const res = func(x);
    if (!isNaN(res) && isFinite(res)) {
      branchA.push({ x: x, y: res });
    }
  }

  for (let x = 2.1; x < 10.1; x = x + 0.01) {
    const res = func(x);
    if (!isNaN(res) && isFinite(res)) {
      branchB.push({ x: x, y: res });
    }
  }

  return [branchA, branchB];
};

export const transform = (data: Data): TransformedData[] => {

  const addDataFromBranch = (branch: Pair[], transformedData: TransformedData) => {
    branch.reduce<TransformedData>((accumulator, pair) => {
      accumulator.x.push(pair.x);
      accumulator.y.push(pair.y);
      return accumulator;
    }, transformedData);
  }

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
}
