import { FormValues } from "../types";
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';

interface Props {
  onSubmit: (values: FormValues) => void;
}

export const ExpressionsForm = ({ onSubmit }: Props) => {
  return (
    <Formik
      initialValues={{
        expressions: ["Math.sqrt(x)"]
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if (!values.expressions) {
          errors.expressions = requiredError;
        }
        return errors;
      }}
    >
      {({ values }) => {
        return (
          <Form className="form ui">
            <FieldArray name="expressions">
              {({ remove, push }) => (
                <div>
                  {values.expressions.length > 0 &&
                    values.expressions.map((friend, index) => (
                      <div className="row" key={index}>
                        <div className="col">
                          <label htmlFor={`expressions.${index}`}>f {index} (x) = </label>
                          <Field
                            name={`expressions.${index}`}
                            placeholder="Math.sqrt(x)"
                            type="text"
                          />
                          <ErrorMessage
                            name={`expressions.${index}`}
                            component="div"
                            className="field-error"
                          />
                          <button
                            type="button"
                            className="secondary"
                            onClick={() => remove(index)}
                          >
                            X
                          </button>
                        </div>
                      </div>
                    ))}
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => push('')}
                  >
                    Add expression
                  </button>
                </div>
              )}
            </FieldArray>
            <button type="submit">Plot</button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ExpressionsForm;
