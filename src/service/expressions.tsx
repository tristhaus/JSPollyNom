import { Expression } from "../types";

const isValidResult = (result: number): boolean => {
  return !isNaN(result) && isFinite(result);
};

export class X implements Expression {
  evaluate(x: number): number | null {
    return x;
  }

  expressionType = "x";

  isEquivalentTo(other: Expression): boolean {
    const isX = (candidate: Expression): candidate is X => {
      return candidate.expressionType === this.expressionType;
    };

    return isX(other);
  }
}

export class Constant implements Expression {
  private readonly c: number;

  constructor(c: number) {
    this.c = c;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  evaluate(x: number): number | null {
    return this.c;
  }

  expressionType = "constant";

  isEquivalentTo(other: Expression): boolean {
    const isConstant = (candidate: Expression): candidate is Constant => {
      return candidate.expressionType === this.expressionType;
    };

    return isConstant(other) && other.c === this.c;
  }
}

const areEquivalentUnorderedMultiSets = <T extends { expression: Expression }>(a: T[], b: T[], characterSelector: (arg: T) => boolean): boolean => {
  while (a.length > 0) {
    const right = a.pop() as T;
    const leftIndex = b.findIndex(value => characterSelector(value) === characterSelector(right) && value.expression.isEquivalentTo(right.expression));

    if (leftIndex === -1) {
      return false;
    }

    b.splice(leftIndex, 1);
  }

  return b.length === 0;
};

export class Summand {
  public readonly isPositive: boolean;
  public readonly expression: Expression;

  constructor(isPositive: boolean, expression: Expression) {
    this.isPositive = isPositive;
    this.expression = expression;
  }
}

export class Sum implements Expression {
  private readonly summands: Summand[];

  constructor(summands: Summand[]) {
    this.summands = summands;
  }

  evaluate(x: number): number | null {
    const results = this.summands.map<number | null>(summand => {
      const temp = summand.expression.evaluate(x);

      return temp === null ? null : (summand.isPositive ? 1.0 : -1.0) * temp;
    });

    return results.some(result => result === null) ? null : results.reduce<number>((prev, current) => prev + (current ?? 0), 0);
  }

  expressionType = "sum";

  isEquivalentTo(other: Expression): boolean {
    const isSum = (candidate: Expression): candidate is Sum => {
      return candidate.expressionType === this.expressionType;
    };

    if (!isSum(other)) {
      return false;
    }

    const a = [...other.summands];
    const b = [... this.summands];

    return areEquivalentUnorderedMultiSets(a, b, summand => summand.isPositive);
  }
}

export class Factor {
  /**
   * Indicates whether the factor is multiplicative or divisive.
   */
  public readonly isMultiplication: boolean;
  public readonly expression: Expression;

  constructor(isMultiplication: boolean, expression: Expression) {
    this.isMultiplication = isMultiplication;
    this.expression = expression;
  }
}

export class Product implements Expression {
  private readonly factors: Factor[];

  constructor(factors: Factor[]) {
    this.factors = factors;
  }

  evaluate(x: number): number | null {
    const results = this.factors.map<number | null>(factor => {
      const rawResult = factor.expression.evaluate(x);

      if (rawResult === null) {
        return null;
      }

      const resultWithPowerApplied = factor.isMultiplication ? rawResult : (1.0 / rawResult);

      return isValidResult(resultWithPowerApplied) ? resultWithPowerApplied : null;
    });

    return results.some(result => result === null) ? null : results.reduce<number>((prev, current) => prev * (current ?? 0), 1);
  }

  expressionType = "product";

  isEquivalentTo(other: Expression): boolean {
    const isProduct = (candidate: Expression): candidate is Product => {
      return candidate.expressionType === this.expressionType;
    };

    if (!isProduct(other)) {
      return false;
    }

    const a = [...other.factors];
    const b = [... this.factors];

    return areEquivalentUnorderedMultiSets(a, b, factor => factor.isMultiplication);
  }
}

export class Power implements Expression {
  private readonly base: Expression;
  private readonly exponent: Expression;

  constructor(base: Expression, exponent: Expression) {
    this.base = base;
    this.exponent = exponent;
  }

  evaluate(x: number): number | null {
    const tempBase = this.base.evaluate(x);

    if (tempBase === null) {
      return null;
    }

    const tempExponent = this.exponent.evaluate(x);

    if (tempExponent === null) {
      return null;
    }

    const result = tempBase ** tempExponent;

    return isValidResult(result) ? result : null;
  }

  expressionType = "power";

  isEquivalentTo(other: Expression): boolean {
    const isPower = (candidate: Expression): candidate is Power => {
      return candidate.expressionType === this.expressionType;
    };

    return isPower(other) && other.base.isEquivalentTo(this.base) && other.exponent.isEquivalentTo(this.exponent);
  }
}

abstract class SingleArgumentFunction implements Expression {
  protected abstract readonly argument: Expression;
  abstract evaluate(x: number): number | null;

  abstract readonly expressionType: string;
  isEquivalentTo(other: Expression): boolean {
    const isMatchingSingleArgumentFunction = (candidate: Expression): candidate is SingleArgumentFunction => {
      return candidate.expressionType === this.expressionType;
    };

    return isMatchingSingleArgumentFunction(other) && other.argument.isEquivalentTo(this.argument);
  }
}

export class AbsoluteValue extends SingleArgumentFunction {
  protected readonly argument: Expression;

  constructor(argument: Expression) {
    super();
    this.argument = argument;
  }

  expressionType = "saf_abs";

  evaluate(x: number): number | null {
    const argumentResult = this.argument.evaluate(x);

    return argumentResult === null ? null : Math.abs(argumentResult);
  }
}

export class Sine extends SingleArgumentFunction {
  protected readonly argument: Expression;

  constructor(argument: Expression) {
    super();
    this.argument = argument;
  }

  expressionType = "saf_sin";

  evaluate(x: number): number | null {
    const argumentResult = this.argument.evaluate(x);

    return argumentResult === null ? null : Math.sin(argumentResult);
  }
}

export class Cosine extends SingleArgumentFunction {
  protected readonly argument: Expression;

  constructor(argument: Expression) {
    super();
    this.argument = argument;
  }

  expressionType = "saf_cos";

  evaluate(x: number): number | null {
    const argumentResult = this.argument.evaluate(x);

    return argumentResult === null ? null : Math.cos(argumentResult);
  }
}

export class Tangent extends SingleArgumentFunction {
  protected readonly argument: Expression;

  constructor(argument: Expression) {
    super();
    this.argument = argument;
  }

  expressionType = "saf_tan";

  evaluate(x: number): number | null {
    const argumentResult = this.argument.evaluate(x);

    if (argumentResult === null) {
      return null;
    }

    const result = Math.tan(argumentResult);

    return isValidResult(result) ? result : null;
  }
}

export class NaturalExponential extends SingleArgumentFunction {
  protected readonly argument: Expression;

  constructor(argument: Expression) {
    super();
    this.argument = argument;
  }

  expressionType = "saf_exp";

  evaluate(x: number): number | null {
    const argumentResult = this.argument.evaluate(x);

    return argumentResult === null ? null : Math.exp(argumentResult);
  }
}

export class NaturalLogarithm extends SingleArgumentFunction {
  protected readonly argument: Expression;

  constructor(argument: Expression) {
    super();
    this.argument = argument;
  }

  expressionType = "saf_ln";

  evaluate(x: number): number | null {
    const argumentResult = this.argument.evaluate(x);

    if (argumentResult === null) {
      return null;
    }

    const result = Math.log(argumentResult);

    return isValidResult(result) ? result : null;
  }
}

export class SquareRoot extends SingleArgumentFunction {
  protected readonly argument: Expression;

  constructor(argument: Expression) {
    super();
    this.argument = argument;
  }

  expressionType = "saf_sqrt";

  evaluate(x: number): number | null {
    const argumentResult = this.argument.evaluate(x);

    if (argumentResult === null) {
      return null;
    }

    const result = Math.sqrt(argumentResult);

    return isValidResult(result) ? result : null;
  }
}

