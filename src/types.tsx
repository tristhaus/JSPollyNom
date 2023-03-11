export interface FormValues {
  expressions: string[]
}

export interface Expression {
  evaluate(x: number): number | null;
  isEquivalentTo(other: Expression): boolean;
  readonly expressionType: string;
}

export enum Problem {
  SquarePolynomial = "SquarePolynomial",
  Sine = "Sine",
  Rationals = "Rationals",
  Gaussian = "Gaussian",
}