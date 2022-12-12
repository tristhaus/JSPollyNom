export interface FormValues {
  expressions: string[]
}

export interface Expression {
  evaluate(x: number): number | null;
  isEquivalentTo(other: Expression): boolean;
  readonly expressionType: string;
}
