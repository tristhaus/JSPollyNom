import { Expression } from "../types";
import { AbsoluteValue, Constant, Cosine, Factor, NaturalExponential, NaturalLogarithm, Power, Product, Sine, SquareRoot, Sum, Summand, Tangent, X } from "./expressions";

const prepareInput = (input: string): string => {
  const regex = /[ \t]/g;

  return input.replace(regex, '');
};

const validateInput = (input: string): boolean => {
  const validCharsRegex = /^[-+/*^()0-9.,xXabceilnpoqrst]+$/;

  const validCharsMatch = input.match(validCharsRegex);

  if (validCharsMatch === null) {
    return false;
  }

  if (input.includes('^+') || input.includes('^-')) {
    return false;
  }

  const lastChar = input[input.length - 1];
  const danglingMatch = lastChar.match(/[-+/*^(]/);

  if (danglingMatch !== null) {
    return false;
  }

  const parenthesesAreBalanced = (s: string): boolean => {
    let count = 0;

    for (let i = 0; i < s.length; i++) {
      const char = s.charAt(i);

      switch (char) {
        case "(":
          count++;
          break;
        case ")":
          count--;
          if (count < 0) {
            return false;
          }
          break;
      }
    }

    return count === 0;
  };

  return parenthesesAreBalanced(input);
};

export const findIndexOfMatchingRoundBracket = (input: string, indexToMatch: number): number => {
  if (!Number.isInteger(indexToMatch) || indexToMatch > input.length - 1) {
    throw Error("invalid input");
  }

  const lookForClosing = input.charAt(indexToMatch) === "(";

  let count = 0;
  if (lookForClosing) {
    for (let i = indexToMatch; i < input.length; i++) {
      const char = input.charAt(i);

      switch (char) {
        case "(":
          count++;
          break;
        case ")":
          count--;
          if (count === 0) {
            return i;
          }
          break;
      }
    }
  }
  else {
    for (let i = indexToMatch; i >= 0; i--) {
      const char = input.charAt(i);

      switch (char) {
        case ")":
          count++;
          break;
        case "(":
          count--;
          if (count === 0) {
            return i;
          }
          break;
      }
    }
  }

  return -1;
};

const parseToConstant = (input: string): Constant => {
  const anglified = input.replaceAll(',', '.');

  const parsedFloat = parseFloat(anglified);

  return new Constant(parsedFloat);
};

export const tokenize = (input: string): { tokens: string[], ops: string[] } => {

  const regex = /[-+/*^]/;

  const tokens: string[] = [];
  const ops: string[] = [];

  let token = '';

  for (let i = 0; i < input.length; i++) {
    const char = input.charAt(i);

    if (char === '(') {
      const endIndex = findIndexOfMatchingRoundBracket(input, i);
      token += input.substring(i, endIndex + 1);
      i = endIndex;
    }
    else if (char.match(regex) !== null && token.length > 0) {
      tokens.push(token);
      token = '';
      ops.push(char);
      continue;
    }
    else {
      token += char;
    }
  }

  if (token.length > 0) {
    tokens.push(token);
  }

  return { tokens, ops };
};

const parseToSum = (tokens: string[], ops: string[]): Sum | null => {
  if (tokens.length != ops.length + 1) {
    return null;
  }

  const targetList: Summand[] = [];

  let isPositive = true;

  let token = tokens[0];
  tokens.splice(0, 1);

  for (let opsIndex = 0; opsIndex < ops.length; opsIndex++) {
    if (ops[opsIndex] === "+" || ops[opsIndex] === "-") {
      const expression = internalParse(token);
      if (expression === null) {
        return null;
      }

      targetList.push(new Summand(isPositive, expression));
      token = tokens[0];
      tokens.splice(0, 1);
      isPositive = ops[opsIndex] === "+";
    }
    else {
      token += ops[opsIndex] + tokens[0];
      tokens.splice(0, 1);
    }
  }

  // one last token to take care of
  if (tokens.length == 1) {
    token = tokens[0];
  }

  if (token !== '') {
    const expression = internalParse(token);
    if (expression === null) {
      return null;
    }

    targetList.push(new Summand(isPositive, expression));
  }

  return new Sum(targetList);
};

const parseToProduct = (tokens: string[], ops: string[]): Product | null => {
  if (tokens.length != ops.length + 1) {
    return null;
  }

  const targetList: Factor[] = [];

  let isMultiplicative = true;

  let token = tokens.shift() as string;

  for (let opsIndex = 0; opsIndex < ops.length; opsIndex++) {
    if (ops[opsIndex] === "*" || ops[opsIndex] === "/") {
      const expression = internalParse(token);
      if (expression === null) {
        return null;
      }

      targetList.push(new Factor(isMultiplicative, expression));
      token = tokens.shift() as string;
      isMultiplicative = ops[opsIndex] === "*";
    }
    else {
      token += ops[opsIndex] + tokens.shift();
    }
  }

  // one last token to take care of
  if (tokens.length == 1) {
    token = tokens[0];
  }

  if (token !== '') {
    const expression = internalParse(token);
    if (expression === null) {
      return null;
    }

    targetList.push(new Factor(isMultiplicative, expression));
  }

  return new Product(targetList);
};

const parseToPower = (tokens: string[], ops: string[]): Power | null => {
  if (tokens.length != ops.length + 1) {
    return null;
  }

  const baseToken = tokens.shift() as string;

  const baseExpression = internalParse(baseToken);
  if (baseExpression === null) {
    return null;
  }

  ops.shift();
  const weave = (a: string[], b: string[]): string[] => a.length ? [a[0], ...weave(b, a.slice(1))] : b;
  const exponentToken = weave(tokens, ops).join('');

  const exponentExpression = internalParse(exponentToken);
  if (exponentExpression === null) {
    return null;
  }

  return new Power(baseExpression, exponentExpression);
};

const parseToFunction = (tokens: string[]): Expression | null => {

  const theMap: Array<{ name: string, creator: (argument: Expression) => Expression }> =
    [
      { name: 'abs', creator: (argument: Expression): Expression => new AbsoluteValue(argument) },
      { name: 'sin', creator: (argument: Expression): Expression => new Sine(argument) },
      { name: 'cos', creator: (argument: Expression): Expression => new Cosine(argument) },
      { name: 'tan', creator: (argument: Expression): Expression => new Tangent(argument) },
      { name: 'exp', creator: (argument: Expression): Expression => new NaturalExponential(argument) },
      { name: 'ln', creator: (argument: Expression): Expression => new NaturalLogarithm(argument) },
      { name: 'sqrt', creator: (argument: Expression): Expression => new SquareRoot(argument) },
    ];

  const functionToken = tokens.shift() as string;
  const index = functionToken.indexOf('(');
  const name = functionToken.substring(0, index);

  const theFunction = theMap.find(value => value.name === name);

  if (theFunction === undefined) {
    return null;
  }

  const argumentToken = functionToken.substring(index);
  const argument = internalParse(argumentToken);

  if (argument === null) {
    return null;
  }

  return theFunction.creator(argument);
};

const internalParse = (input: string): Expression | null => {

  if (!validateInput(input)) {
    return null;
  }

  // if fully enclosed in braces, we remove them
  if (input[0] == '(' && input.length - 1 === findIndexOfMatchingRoundBracket(input, 0)) {
    return internalParse(input.substring(1, input.length - 1));
  }

  // deal with a simple case: plain x
  if (input === "x" || input === "X") {
    return new X;
  }

  const numberRegexp = /^[-+]?[0-9]+[.,]?[0-9]*$/;

  // deal with a simple case: a numerical constant
  if (input.match(numberRegexp) !== null) {
    return parseToConstant(input);
  }

  const { tokens, ops } = tokenize(input);

  // deal with a signed single token
  if (tokens.length === 1 && input.match(/^[-+]/) !== null) {
    const subToken = input.substring(1);
    const bracketedExpression = internalParse(subToken);

    if (bracketedExpression === null) {
      return null;
    }

    if (input[0] === '-') {
      return new Sum([new Summand(false, bracketedExpression)]);
    }
    else {
      return bracketedExpression;
    }
  }

  // First case: plus and minus
  if (ops.includes('+') || ops.includes('-')) {
    return parseToSum(tokens, ops);
  }

  // Second case: multiply and divide
  if (ops.includes('*') || ops.includes('/')) {
    return parseToProduct(tokens, ops);
  }

  // Third case: power expressions
  if (ops.includes('^')) {
    return parseToPower(tokens, ops);
  }

  // Fourth case: functions
  if (tokens.length === 1) {
    return parseToFunction(tokens);
  }

  return null;
};

export const parse = (input: string): Expression | null => {

  const prepared = prepareInput(input);

  if (!validateInput(prepared)) {
    return null;
  }

  return internalParse(prepared);
};

