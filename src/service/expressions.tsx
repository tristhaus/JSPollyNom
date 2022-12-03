import { Expression } from "../types";

const isValidResult = (result: number): boolean => {
  return !isNaN(result) && isFinite(result);
};

export class X implements Expression {
  evaluate(x: number): number | null {
    return x;
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
}

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
}

export class AbsoluteValue implements Expression {
  private readonly argument: Expression;

  constructor(argument: Expression) {
    this.argument = argument;
  }

  evaluate(x: number): number | null {
    const argumentResult = this.argument.evaluate(x);

    return argumentResult === null ? null : Math.abs(argumentResult);
  }
}

export class Sine implements Expression {
  private readonly argument: Expression;

  constructor(argument: Expression) {
    this.argument = argument;
  }

  evaluate(x: number): number | null {
    const argumentResult = this.argument.evaluate(x);

    return argumentResult === null ? null : Math.sin(argumentResult);
  }
}

export class Cosine implements Expression {
  private readonly argument: Expression;

  constructor(argument: Expression) {
    this.argument = argument;
  }

  evaluate(x: number): number | null {
    const argumentResult = this.argument.evaluate(x);

    return argumentResult === null ? null : Math.cos(argumentResult);
  }
}

export class Tangent implements Expression {
  private readonly argument: Expression;

  constructor(argument: Expression) {
    this.argument = argument;
  }

  evaluate(x: number): number | null {
    const argumentResult = this.argument.evaluate(x);

    if (argumentResult === null) {
      return null;
    }

    const result = Math.tan(argumentResult);

    return isValidResult(result) ? result : null;
  }
}

export class NaturalExponential implements Expression {
  private readonly argument: Expression;

  constructor(argument: Expression) {
    this.argument = argument;
  }

  evaluate(x: number): number | null {
    const argumentResult = this.argument.evaluate(x);

    return argumentResult === null ? null : Math.exp(argumentResult);
  }
}

export class NaturalLogarithm implements Expression {
  private readonly argument: Expression;

  constructor(argument: Expression) {
    this.argument = argument;
  }

  evaluate(x: number): number | null {
    const argumentResult = this.argument.evaluate(x);

    if (argumentResult === null) {
      return null;
    }

    const result = Math.log(argumentResult);

    return isValidResult(result) ? result : null;
  }
}
