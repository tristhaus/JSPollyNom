export interface Pair {
  x: number;
  y: number;
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
