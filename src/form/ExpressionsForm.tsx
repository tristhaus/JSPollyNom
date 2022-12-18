import { FormValues } from "../types";
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import { parse } from "../service/parser";

interface Props {
  onSubmit: (values: FormValues) => void;
}

export const ExpressionsForm = ({ onSubmit }: Props) => {
  return (
    <Formik
      initialValues={{
        expressions: ["sqrt(x^3)"]
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = "Field is required";
        const invalidError = "Expression is not valid";
        const errors: { [field: string]: string[] } = {};
        if (!values.expressions) {
          // use knowledge that there is just one field right now
          errors.expressions = [requiredError];
        }

        const parseResults = values.expressions.map(expression => parse(expression));

        if (parseResults.some(result => result === null)) {
          // use knowledge that there is just one field right now
          errors.expressions = [invalidError];
        }

        return errors;
      }}
    >
      {({ values }) => {
        return (
          <Form className="form ui">
            <FieldArray name="expressions">
              {() => (
                <div>
                  {values.expressions.length > 0 &&
                    values.expressions.map((friend, index) => (
                      <div className="row" key={index}>
                        <div className="col centering">
                          <label htmlFor={`expressions.${index}`}>f(x) = </label>
                          <Field
                            style={{ width: '70%' }}
                            name={`expressions.${index}`}
                            placeholder="sqrt(x)"
                            type="text"
                          />
                          <ErrorMessage
                            name={`expressions.${index}`}
                            component="div"
                            className="field-error"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </FieldArray>
            <div className='centering'>
              <button className='plotButton' type="submit">Plot</button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ExpressionsForm;
