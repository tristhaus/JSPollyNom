import { AbsoluteValue, Constant, Cosine, Factor, NaturalExponential, NaturalLogarithm, Power, Product, Sine, Sum, Summand, Tangent, X } from '../service/expressions';

test('X yields given value', () => {
  const x = new X();

  expect(x.evaluate(6.33)).toBeCloseTo(6.33);
  expect(x.evaluate(-6.12)).toBeCloseTo(-6.12);
});

test('Constant yields contained value', () => {
  const constant = new Constant(6.44);

  expect(constant.evaluate(6.33)).toBeCloseTo(6.44);
  expect(constant.evaluate(-6.12)).toBeCloseTo(6.44);
});

test('Sum yields correct value', () => {
  const constant = new Constant(6.44);
  const x = new X();

  const sum = new Sum([new Summand(true, constant), new Summand(false, x)]);

  expect(sum.evaluate(4)).toBeCloseTo(2.44);
  expect(sum.evaluate(-3)).toBeCloseTo(9.44);
});

test('Product yields correct value', () => {
  const constant = new Constant(6.44);
  const x = new X();

  const product = new Product([new Factor(true, constant), new Factor(false, x)]);

  expect(product.evaluate(4.0)).toBeCloseTo(1.61);
  expect(product.evaluate(-2.0)).toBeCloseTo(-3.22);
});

test('Product yields null correctly', () => {
  const constant = new Constant(6.44);
  const x = new X();

  const product = new Product([new Factor(true, constant), new Factor(false, x)]);

  expect(product.evaluate(0)).toBeNull();
});

test('Sum propagates null correctly', () => {
  const constant = new Constant(1.0);
  const x = new X();

  const product = new Product([new Factor(true, constant), new Factor(false, x)]);
  const sum = new Sum([new Summand(true, product), new Summand(true, x)]);

  expect(sum.evaluate(0)).toBeNull();
});

test('Power yields correct value', () => {
  const base = new Constant(2.0);
  const x = new X();

  const power = new Power(base, x);

  expect(power.evaluate(0)).toBeCloseTo(1.0);
  expect(power.evaluate(0.5)).toBeCloseTo(1.414);
  expect(power.evaluate(3.0)).toBeCloseTo(8.0);
  expect(power.evaluate(-2.0)).toBeCloseTo(0.25);
});

test('Power yields null correctly', () => {
  const base = new Constant(0.0);
  const x = new X();

  const power = new Power(base, x);

  expect(power.evaluate(0)).toBeCloseTo(1.0);
  expect(power.evaluate(2.0)).toBeCloseTo(0.0);
  expect(power.evaluate(-2.0)).toBeNull();
});

test('Power handles negative base correctly', () => {
  const base = new Constant(-2.0);
  const x = new X();

  const power = new Power(base, x);

  expect(power.evaluate(2.0)).toBeCloseTo(4.0);
  expect(power.evaluate(0.0)).toBeCloseTo(1.0);
  expect(power.evaluate(0.5)).toBeNull();
});

test('Absolute value yields correct value', () => {
  const x = new X();

  const theFunction = new AbsoluteValue(x);

  expect(theFunction.evaluate(2.0)).toBeCloseTo(2.0);
  expect(theFunction.evaluate(0.0)).toBeCloseTo(0.0);
  expect(theFunction.evaluate(-0.5)).toBeCloseTo(0.5);
});

test('Sine yields correct value', () => {
  const x = new X();

  const theFunction = new Sine(x);

  expect(theFunction.evaluate(0.0)).toBeCloseTo(0.0);
  expect(theFunction.evaluate(Math.PI / 4)).toBeCloseTo(0.707);
  expect(theFunction.evaluate(Math.PI / 2)).toBeCloseTo(1.0);
});

test('Cosine yields correct value', () => {
  const x = new X();

  const theFunction = new Cosine(x);

  expect(theFunction.evaluate(0.0)).toBeCloseTo(1.0);
  expect(theFunction.evaluate(Math.PI / 4)).toBeCloseTo(0.707);
  expect(theFunction.evaluate(Math.PI / 2)).toBeCloseTo(0.0);
});

test('Tangent yields correct value', () => {
  const x = new X();

  const theFunction = new Tangent(x);

  expect(theFunction.evaluate(0.0)).toBeCloseTo(0.0);
  expect(theFunction.evaluate(Math.PI / 4)).toBeCloseTo(1.0);

  // not working
  // expect(theFunction.evaluate(Math.PI / 2)).toBeNull();
});

test('NaturalExponential yields correct value', () => {
  const x = new X();

  const theFunction = new NaturalExponential(x);

  expect(theFunction.evaluate(0.0)).toBeCloseTo(1.0);
  expect(theFunction.evaluate(-1.0)).toBeCloseTo(1.0 / Math.E);
  expect(theFunction.evaluate(1.0)).toBeCloseTo(Math.E);
});

test('NaturalLogarithm yields correct value', () => {
  const x = new X();

  const theFunction = new NaturalLogarithm(x);

  expect(theFunction.evaluate(-1.0)).toBeNull();
  expect(theFunction.evaluate(0.0)).toBeNull();
  expect(theFunction.evaluate(1.0)).toBeCloseTo(0.0);
  expect(theFunction.evaluate(Math.E)).toBeCloseTo(1.0);
});
