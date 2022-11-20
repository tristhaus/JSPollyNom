import { useState } from 'react';
import Plot from 'react-plotly.js';
import { Data as PlotlyData, Datum as PlotlyDatum } from 'plotly.js';

import ExpressionsForm from './form/ExpressionsForm';
import { FormValues } from './types';

const createData = (expressions: string[]): PlotlyData[] => {

  interface Pair {
    x: PlotlyDatum;
    y: PlotlyDatum;
  }

  interface Data {
    data: Array<Array<Pair>>;
  }

  interface TransformedData {
    x: Array<PlotlyDatum>;
    y: Array<PlotlyDatum>;
  }

  const evaluate = (expressions: string[]): Data => {

    const retval: Data = { data: [] };

    expressions.forEach(expression => {
      const list: Array<Pair> = [];

      for (let x = -10.0; x < 10.1; x = x + 0.1) {
        const func = eval(`x => ${expression}`) as (x: number) => number;
        const res = func(x);
        if (!isNaN(res) && isFinite(res)) {
          list.push({ x: x, y: res });
        }
      }

      retval.data.push(list);
    });

    return retval;
  };

  const transform = (data: Data): Array<TransformedData> => {
    const retval = data.data.map(
      pairs => pairs.reduce<TransformedData>((accumulator, pair) => {
        accumulator.x.push(pair.x);
        accumulator.y.push(pair.y);
        return accumulator;
      },
        { x: [], y: [] }));

    return retval;
  }

  const data = evaluate(expressions);

  const transformedDataObjects = transform(data);

  const decoratedDataObjects = transformedDataObjects.map<PlotlyData>(tdo => {
    return {
      ...tdo,
      type: 'scatter',
      mode: 'lines',
      marker: { color: 'red' }
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
