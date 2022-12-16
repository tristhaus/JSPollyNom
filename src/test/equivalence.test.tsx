import { AbsoluteValue, Constant, Cosine, Factor, NaturalExponential, NaturalLogarithm, Power, Product, Sine, SquareRoot, Sum, Summand, Tangent, X } from '../service/expressions';

test('X === X', () => {
  const x1 = new X();
  const x2 = new X();

  expect(x1.isEquivalentTo(x2)).toBe(true);
  expect(x1.isEquivalentTo(x1)).toBe(true);
});

test('c === c', () => {
  const c1 = new Constant(0.33);
  const c2 = new Constant(0.33);

  expect(c1.isEquivalentTo(c2)).toBe(true);
  expect(c1.isEquivalentTo(c1)).toBe(true);
});

test('c !== c', () => {
  const c1 = new Constant(0.33);
  const c2 = new Constant(0.22);

  expect(c1.isEquivalentTo(c2)).toBe(false);
});

test('X !== c', () => {
  const x = new X();
  const c = new Constant(0.22);

  expect(c.isEquivalentTo(x)).toBe(false);
  expect(x.isEquivalentTo(c)).toBe(false);
});

test('sum shall correctly implement equivalence', () => {
  const x = new X();
  const c1 = new Constant(0.22);
  const c2 = new Constant(0.44);

  // x + 0.22 + 0.44 + 0.44 - x
  const s1 = new Sum([new Summand(true, x), new Summand(true, c1), new Summand(true, c2), new Summand(true, c2), new Summand(false, x)]);
  // x + 0.22 + 0.44 + 0.44 - x
  const s2 = new Sum([new Summand(true, x), new Summand(true, c1), new Summand(true, c2), new Summand(true, c2), new Summand(false, x)]);

  // x + 0.22 + 0.44 - 0.44 - x
  const s3 = new Sum([new Summand(true, x), new Summand(true, c1), new Summand(true, c2), new Summand(false, c2), new Summand(false, x)]);

  // x + 0.22 + 0.44 + 0.44 - x + 0.22
  const s4 = new Sum([new Summand(true, x), new Summand(true, c1), new Summand(true, c2), new Summand(true, c2), new Summand(false, x), new Summand(true, c1)]);

  // x + 0.22 + 0.44 + 0.44
  const s5 = new Sum([new Summand(true, x), new Summand(true, c1), new Summand(true, c2), new Summand(true, c2)]);

  // x + 0.22 + 0.22 + 0.44 - x
  const s6 = new Sum([new Summand(true, x), new Summand(true, c1), new Summand(true, c1), new Summand(true, c2), new Summand(false, x)]);

  expect(s1.isEquivalentTo(s1)).toBe(true);
  expect(s1.isEquivalentTo(s2)).toBe(true);
  expect(s1.isEquivalentTo(s3)).toBe(false);
  expect(s1.isEquivalentTo(s4)).toBe(false);
  expect(s1.isEquivalentTo(s5)).toBe(false);
  expect(s1.isEquivalentTo(s6)).toBe(false);
});

test('sum shall not handle logically same expressions with parenthesis', () => {
  const x = new X();
  const c1 = new Constant(0.22);
  const c2 = new Constant(0.44);

  // x + 0.22 + (0.44 + 0.44) - x
  const s1 = new Sum([new Summand(true, x), new Summand(true, c1), new Summand(true, new Sum([new Summand(true, c2), new Summand(true, c2)])), new Summand(false, x)]);
  // x + 0.22 + (0.44 + 0.44) - x
  const s2 = new Sum([new Summand(true, x), new Summand(true, c1), new Summand(true, new Sum([new Summand(true, c2), new Summand(true, c2)])), new Summand(false, x)]);

  // x + (0.22 + 0.44) + 0.44 - x
  const s3 = new Sum([new Summand(true, x), new Summand(true, new Sum([new Summand(true, c1), new Summand(true, c2)])), new Summand(true, c2), new Summand(false, x)]);

  expect(s1.isEquivalentTo(s1)).toBe(true);
  expect(s1.isEquivalentTo(s2)).toBe(true);
  expect(s1.isEquivalentTo(s3)).toBe(false);
});

test('product shall correctly implement equivalence', () => {
  const x = new X();
  const c1 = new Constant(0.22);
  const c2 = new Constant(0.44);

  // x * 0.22 * 0.44 * 0.44 / x
  const p1 = new Product([new Factor(true, x), new Factor(true, c1), new Factor(true, c2), new Factor(true, c2), new Factor(false, x)]);
  // x * 0.22 * 0.44 * 0.44 / x
  const p2 = new Product([new Factor(true, x), new Factor(true, c1), new Factor(true, c2), new Factor(true, c2), new Factor(false, x)]);

  // x * 0.22 * 0.44 / 0.44 / x
  const p3 = new Product([new Factor(true, x), new Factor(true, c1), new Factor(true, c2), new Factor(false, c2), new Factor(false, x)]);

  // x * 0.22 * 0.44 * 0.44 / x * 0.22
  const p4 = new Product([new Factor(true, x), new Factor(true, c1), new Factor(true, c2), new Factor(true, c2), new Factor(false, x), new Factor(true, c1)]);

  // x * 0.22 * 0.44 * 0.44
  const p5 = new Product([new Factor(true, x), new Factor(true, c1), new Factor(true, c2), new Factor(true, c2)]);

  // x * 0.22 * 0.22 * 0.44 / x
  const p6 = new Product([new Factor(true, x), new Factor(true, c1), new Factor(true, c1), new Factor(true, c2), new Factor(false, x)]);

  expect(p1.isEquivalentTo(p1)).toBe(true);
  expect(p1.isEquivalentTo(p2)).toBe(true);
  expect(p1.isEquivalentTo(p3)).toBe(false);
  expect(p1.isEquivalentTo(p4)).toBe(false);
  expect(p1.isEquivalentTo(p5)).toBe(false);
  expect(p1.isEquivalentTo(p6)).toBe(false);
});

test('product shall not handle logically same expressions with parenthesis', () => {
  const x = new X();
  const c1 = new Constant(0.22);
  const c2 = new Constant(0.44);

  // x * 0.22 * (0.44 * 0.44) / x
  const p1 = new Product([new Factor(true, x), new Factor(true, c1), new Factor(true, new Product([new Factor(true, c2), new Factor(true, c2)])), new Factor(false, x)]);
  // x * 0.22 * (0.44 * 0.44) / x
  const p2 = new Product([new Factor(true, x), new Factor(true, c1), new Factor(true, new Product([new Factor(true, c2), new Factor(true, c2)])), new Factor(false, x)]);

  // x * (0.22 * 0.44) * 0.44 / x
  const p3 = new Product([new Factor(true, x), new Factor(true, new Product([new Factor(true, c1), new Factor(true, c2)])), new Factor(true, c2), new Factor(false, x)]);

  expect(p1.isEquivalentTo(p1)).toBe(true);
  expect(p1.isEquivalentTo(p2)).toBe(true);
  expect(p1.isEquivalentTo(p3)).toBe(false);
});

test('2^x === 2^x', () => {
  const x = new X();
  const c = new Constant(2.0);
  const power1 = new Power(c, x);
  const power2 = new Power(c, x);

  expect(power1.isEquivalentTo(power2)).toBe(true);
  expect(power1.isEquivalentTo(power1)).toBe(true);
});

test('x^1 !== x', () => {
  const x = new X();
  const c = new Constant(1.0);
  const power = new Power(x, c);

  expect(power.isEquivalentTo(x)).toBe(false);
});

test('abs shall correctly implement equivalence', () => {
  const x = new X();
  const c = new Constant(0.42);
  const abs1 = new AbsoluteValue(x);
  const abs2 = new AbsoluteValue(x);
  const abs3 = new AbsoluteValue(c);

  expect(abs1.isEquivalentTo(abs1)).toBe(true);
  expect(abs1.isEquivalentTo(abs2)).toBe(true);
  expect(abs1.isEquivalentTo(abs3)).toBe(false);
});

test('sin shall correctly implement equivalence', () => {
  const x = new X();
  const c = new Constant(0.42);
  const sin1 = new Sine(x);
  const sin2 = new Sine(x);
  const sin3 = new Sine(c);

  expect(sin1.isEquivalentTo(sin1)).toBe(true);
  expect(sin1.isEquivalentTo(sin2)).toBe(true);
  expect(sin1.isEquivalentTo(sin3)).toBe(false);
});

test('cos shall correctly implement equivalence', () => {
  const x = new X();
  const c = new Constant(0.42);
  const cos1 = new Cosine(x);
  const cos2 = new Cosine(x);
  const cos3 = new Cosine(c);

  expect(cos1.isEquivalentTo(cos1)).toBe(true);
  expect(cos1.isEquivalentTo(cos2)).toBe(true);
  expect(cos1.isEquivalentTo(cos3)).toBe(false);
});

test('tan shall correctly implement equivalence', () => {
  const x = new X();
  const c = new Constant(0.42);
  const tan1 = new Tangent(x);
  const tan2 = new Tangent(x);
  const tan3 = new Tangent(c);

  expect(tan1.isEquivalentTo(tan1)).toBe(true);
  expect(tan1.isEquivalentTo(tan2)).toBe(true);
  expect(tan1.isEquivalentTo(tan3)).toBe(false);
});

test('exp shall correctly implement equivalence', () => {
  const x = new X();
  const c = new Constant(0.42);
  const exp1 = new NaturalExponential(x);
  const exp2 = new NaturalExponential(x);
  const exp3 = new NaturalExponential(c);

  expect(exp1.isEquivalentTo(exp1)).toBe(true);
  expect(exp1.isEquivalentTo(exp2)).toBe(true);
  expect(exp1.isEquivalentTo(exp3)).toBe(false);
});

test('ln shall correctly implement equivalence', () => {
  const x = new X();
  const c = new Constant(0.42);
  const ln1 = new NaturalLogarithm(x);
  const ln2 = new NaturalLogarithm(x);
  const ln3 = new NaturalLogarithm(c);

  expect(ln1.isEquivalentTo(ln1)).toBe(true);
  expect(ln1.isEquivalentTo(ln2)).toBe(true);
  expect(ln1.isEquivalentTo(ln3)).toBe(false);
});

test('sqrt shall correctly implement equivalence', () => {
  const x = new X();
  const c = new Constant(0.42);
  const root1 = new SquareRoot(x);
  const root2 = new SquareRoot(x);
  const root3 = new SquareRoot(c);

  expect(root1.isEquivalentTo(root1)).toBe(true);
  expect(root1.isEquivalentTo(root2)).toBe(true);
  expect(root1.isEquivalentTo(root3)).toBe(false);
});