import { AbsoluteValue, Constant, Cosine, Factor, NaturalExponential, NaturalLogarithm, Power, Product, Sine, SquareRoot, Sum, Summand, Tangent, X } from "../service/expressions";
import { findIndexOfMatchingRoundBracket, parse, tokenize } from "../service/parser";

test('empty string should fail to parse', () => {
  const result = parse('');

  expect(result).toBeNull();
});

test('invalid chars should fail to parse', () => {
  const result = parse('cos(Y)');

  expect(result).toBeNull();
});

test('invalid power sequence should fail to parse', () => {
  const result = parse('x^-x');

  expect(result).toBeNull();
});

test.each([
  { invalidInput: 'x+' },
  { invalidInput: 'x-' },
  { invalidInput: 'x*' },
  { invalidInput: 'x/' },
  { invalidInput: 'x^' },
  { invalidInput: 'x(' },
])('invalid dangling operators should fail to parse ($invalidInput)', (input) => {
  const result = parse(input.invalidInput);

  expect(result).toBeNull();
});

test.each([
  { invalidInput: '((x)' },
  { invalidInput: '(x))(' },
  { invalidInput: ')' },
  { invalidInput: '(' },
  { invalidInput: '()' },
])('unbalanced parenthesis and other problems should fail to parse', (input) => {
  const result = parse(input.invalidInput);

  expect(result).toBeNull();
});

test.each([
  { text: '(    )', index: 0, expected: 5 },
  { text: '((x) )', index: 1, expected: 3 },
  { text: '((x) )', index: 5, expected: 0 },
  { text: '((x) )', index: 3, expected: 1 },
  { text: '(((x)(x)))', index: 1, expected: 8 },
  { text: '(((x)(x)))', index: 8, expected: 1 },
])('find matching index should work', (input) => {
  const result = findIndexOfMatchingRoundBracket(input.text, input.index);

  expect(result).toEqual(input.expected);
});

test.each([
  { text: 'X' },
  { text: '( X  )' },
  { text: '((x) )' },
])('simple X cases should parse ($text)', (input) => {
  const reference = new X();

  const result = parse(input.text);

  expect(result).not.toBeNull();
  expect(result?.isEquivalentTo(reference)).toBe(true);
});

test.each([
  { text: '2.2', reference: new Constant(2.2) },
  { text: '3,3', reference: new Constant(3.3) },
  { text: '-4.0', reference: new Constant(-4) },
  { text: '-11', reference: new Constant(-11) },
  { text: '+12', reference: new Constant(12) },
  { text: '0', reference: new Constant(0) },
  { text: '+  1  3', reference: new Constant(13) },
  { text: ' +030.500', reference: new Constant(30.5) },
  { text: ' +030.50.0', reference: null },
  { text: ' +030,500', reference: new Constant(30.5) },
  { text: ' +030,50,0', reference: null },
])('simple constant cases should parse ($text)', (input) => {
  const result = parse(input.text);

  if (input.reference === null) {
    expect(result).toBeNull();
  }
  else {
    expect(result).not.toBeNull();
    expect(result?.isEquivalentTo(input.reference)).toBe(true);
  }
});

test.each([
  { text: 'x+1', tokens: ['x', '1',], ops: ['+',] },
  { text: 'x+3-1', tokens: ['x', '3', '1',], ops: ['+', '-',] },
  { text: 'x*(3-1)', tokens: ['x', '(3-1)',], ops: ['*',] },
  { text: '(x-5)*(3-1)', tokens: ['(x-5)', '(3-1)',], ops: ['*',] },
])('tokenizing should work as expected ($text)', (input => {
  const { tokens, ops } = tokenize(input.text);

  expect(tokens).toEqual(input.tokens);
  expect(ops).toEqual(input.ops);
}));

test.each([
  { text: '+(x)', reference: new X() },
  { text: '-(x)', reference: new Sum([new Summand(false, new X())]) },
  { text: '+(xx)', reference: null },
  { text: '-(xx)', reference: null },
  { text: '(x)x', reference: null },
])('single tokens should parse ($text)', (input) => {
  const result = parse(input.text);

  if (input.reference === null) {
    expect(result).toBeNull();
  }
  else {
    expect(result).not.toBeNull();
    expect(result?.isEquivalentTo(input.reference)).toBe(true);
  }
});

test.each([
  { text: 'x+1', reference: new Sum([new Summand(true, new X()), new Summand(true, new Constant(1.0)),]) },
  { text: 'x-1', reference: new Sum([new Summand(true, new X()), new Summand(false, new Constant(1.0)),]) },
  { text: '2-x-1', reference: new Sum([new Summand(false, new X()), new Summand(false, new Constant(1.0)), new Summand(true, new Constant(2.0)),]) },
  { text: '2 - ( x-1 )', reference: new Sum([new Summand(true, new Constant(2.0)), new Summand(false, new Sum([new Summand(true, new X()), new Summand(false, new Constant(1.0)),])),]) },
  { text: '+2-(+x-1)', reference: new Sum([new Summand(true, new Constant(2.0)), new Summand(false, new Sum([new Summand(true, new X()), new Summand(false, new Constant(1.0)),])),]) },
])('sums should parse ($text)', (input) => {
  const result = parse(input.text);

  if (input.reference === null) {
    expect(result).toBeNull();
  }
  else {
    expect(result).not.toBeNull();
    expect(result?.isEquivalentTo(input.reference)).toBe(true);
  }
});

test.each([
  { text: 'x*1', reference: new Product([new Factor(true, new X()), new Factor(true, new Constant(1.0)),]) },
  { text: 'x/1', reference: new Product([new Factor(true, new X()), new Factor(false, new Constant(1.0)),]) },
  { text: '2/x/1', reference: new Product([new Factor(false, new X()), new Factor(false, new Constant(1.0)), new Factor(true, new Constant(2.0)),]) },
  { text: '2 / ( x/1 )', reference: new Product([new Factor(true, new Constant(2.0)), new Factor(false, new Product([new Factor(true, new X()), new Factor(false, new Constant(1.0)),])),]) },
  { text: '4x', reference: null },
])('products should parse ($text)', (input) => {
  const result = parse(input.text);

  if (input.reference === null) {
    expect(result).toBeNull();
  }
  else {
    expect(result).not.toBeNull();
    expect(result?.isEquivalentTo(input.reference)).toBe(true);
  }
});

test.each([
  { text: 'x*(x+2.0)', reference: new Product([new Factor(true, new X()), new Factor(true, new Sum([new Summand(true, new X()), new Summand(true, new Constant(2.0)),])),]) },
  { text: 'x*x+2.0', reference: new Sum([new Summand(true, new Product([new Factor(true, new X()), new Factor(true, new X()),])), new Summand(true, new Constant(2.0)),]) },
])('mix of sum and product should parse ($text)', (input) => {
  const result = parse(input.text);

  if (input.reference === null) {
    expect(result).toBeNull();
  }
  else {
    expect(result).not.toBeNull();
    expect(result?.isEquivalentTo(input.reference)).toBe(true);
  }
});

test.each([
  { text: 'x^2', reference: new Power(new X(), new Constant(2.0)) },
  { text: '(x+2)^(3*x)', reference: new Power(new Sum([new Summand(true, new X()), new Summand(true, new Constant(2.0))]), new Product([new Factor(true, new Constant(3.0)), new Factor(true, new X())])) },
  { text: '3.0^x^2.0', reference: new Power(new Constant(3.0), new Power(new X(), new Constant(2.0))) },
])('powers should parse ($text)', (input) => {
  const result = parse(input.text);

  if (input.reference === null) {
    expect(result).toBeNull();
  }
  else {
    expect(result).not.toBeNull();
    expect(result?.isEquivalentTo(input.reference)).toBe(true);
  }
});

test.each([
  { text: 'abs()', reference: null },
  { text: 'abs(x+2.0)', reference: new AbsoluteValue(new Sum([new Summand(true, new X()), new Summand(true, new Constant(2.0)),])) },
  { text: 'sin(x+2.0)', reference: new Sine(new Sum([new Summand(true, new X()), new Summand(true, new Constant(2.0)),])) },
  { text: 'cos(x+2.0)', reference: new Cosine(new Sum([new Summand(true, new X()), new Summand(true, new Constant(2.0)),])) },
  { text: 'tan(x+2.0)', reference: new Tangent(new Sum([new Summand(true, new X()), new Summand(true, new Constant(2.0)),])) },
  { text: 'exp(x+2.0)', reference: new NaturalExponential(new Sum([new Summand(true, new X()), new Summand(true, new Constant(2.0)),])) },
  { text: 'ln(x+2.0) ', reference: new NaturalLogarithm(new Sum([new Summand(true, new X()), new Summand(true, new Constant(2.0)),])) },
  { text: 'sqrt(x+2.0) ', reference: new SquareRoot(new Sum([new Summand(true, new X()), new Summand(true, new Constant(2.0)),])) },
  { text: 'exp(ln(x+2.0)) ', reference: new NaturalExponential(new NaturalLogarithm(new Sum([new Summand(true, new X()), new Summand(true, new Constant(2.0)),]))) },
])('functions should parse ($text)', (input) => {
  const result = parse(input.text);

  if (input.reference === null) {
    expect(result).toBeNull();
  }
  else {
    expect(result).not.toBeNull();
    expect(result?.isEquivalentTo(input.reference)).toBe(true);
  }
});

test.each([
  { text: 'cis(x+2.0)' },
  { text: 'l(x+2.0) ' },
])('invalid functions should not parse ($text)', (input) => {
  const result = parse(input.text);

  expect(result).toBeNull();
});