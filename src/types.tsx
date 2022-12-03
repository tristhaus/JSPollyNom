export interface FormValues {
  expressions: string[]
}

export interface Expression {
  evaluate: (x: number) => number | null;
}
