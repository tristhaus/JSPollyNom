import { useState } from 'react';
import Plot from 'react-plotly.js';
import { Data as PlotlyData} from 'plotly.js';

import ExpressionsForm from './form/ExpressionsForm';
import { FormValues } from './types';

import { createBranches, Data, Pair, transform } from './service/evaluation'

const createData = (expressions: string[]): PlotlyData[] => {

  const evaluate = (expressions: string[]): Data => {

    const retval: Data = [];

    expressions.forEach(expression => {
      const func = eval(`x => ${expression}`) as (x: number) => number;
      const branches: Pair[][] = createBranches(func);

      retval.push(branches);
    });

    return retval;
  };

  const data = evaluate(expressions);

  const transformedDataObjects = transform(data);

  const decoratedDataObjects = transformedDataObjects.map<PlotlyData>(tdo => {
    return {
      ...tdo,
      type: 'scatter',
      mode: 'lines',
      marker: { color: 'red' },
      connectgaps: false,
    }
  })

  return decoratedDataObjects;
}

const App = () => {
  const [fs, setFs] = useState<string[]>(["Math.sqrt(x)"]);

  const data = createData(fs);

  const plot = (values: FormValues) => {
    setFs(values.expressions);
  }

  return (
    <div>
      <Plot
        data={data}
        layout={{
          width: 500,
          height: 500,
          title: 'Plot based on eval',
          xaxis: {
            range: [-10, 10]
          },
          yaxis: {
            range: [-10, 10]
          },
          modebar: {
            remove: ['autoScale2d', 'lasso2d', 'pan2d', 'select2d', 'zoom2d', 'zoomIn2d', 'zoomOut2d'],
          }
        }}
      />
      <ExpressionsForm onSubmit={plot} />
    </div>
  );
}

export default App;
