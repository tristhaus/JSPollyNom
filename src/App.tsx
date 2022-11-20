import { useState } from 'react';
import Plot from 'react-plotly.js';
import { Data as PlotlyData, Datum as PlotlyDatum } from 'plotly.js';

interface Pair {
  x: PlotlyDatum;
  y: PlotlyDatum;
}

interface Data {
  data: Array<Array<Pair>>;
}

const evaluate = (f: string): Data => {

  const list: Array<Pair> = [];

  for (let x = -10.0; x < 10.1; x = x + 0.1) {
    const func = eval(`x => ${f}`) as (x: number) => number;
    const res = func(x);
    if (!isNaN(res) && isFinite(res)) {
      list.push({ x: x, y: res });
    }
  }

  return { data: [list] };
};

interface TransformedData {
  x: Array<PlotlyDatum>;
  y: Array<PlotlyDatum>;
}

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

const App = () => {
  const [fs] = useState<string>("Math.sqrt(x)");

  const data = evaluate(fs);

  const transformedDataObjects = transform(data);

  const decoratedDataObjects = transformedDataObjects.map<PlotlyData>(tdo => {
    return {
      ...tdo,
      type: 'scatter',
      mode: 'lines',
      marker: { color: 'red' }
    }
  })

  return (
    <div>
      <Plot
        data={decoratedDataObjects}

        layout={{
          width: 500,
          height: 500,
          title: 'A Plot based on eval and hardcoded function',
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

    </div>
  );
}

export default App;
