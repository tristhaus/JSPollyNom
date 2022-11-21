import { useState } from 'react';
import Plot from 'react-plotly.js';
import { Data as PlotlyData, Datum as PlotlyDatum } from 'plotly.js';

import ExpressionsForm from './form/ExpressionsForm';
import { FormValues } from './types';

import { createBranches, Pair } from './service/evaluation'

const createData = (expressions: string[]): PlotlyData[] => {

  // first index: expression
  // second index: branch
  // third index: individual ordered pair
  type Data = Pair[][][];

  interface TransformedData {
    x: PlotlyDatum[];
    y: PlotlyDatum[];
  }

  const evaluate = (expressions: string[]): Data => {

    const retval: Data = [];

    expressions.forEach(expression => {
      const func = eval(`x => ${expression}`) as (x: number) => number;
      const branches: Pair[][] = createBranches(func);

      retval.push(branches);
    });

    return retval;
  };

  const transform = (data: Data): TransformedData[] => {

    const addDataFromBranch = (branch: Pair[], transformedData: TransformedData) => {
      branch.reduce<TransformedData>((accumulator, pair) => {
        accumulator.x.push(pair.x);
        accumulator.y.push(pair.y);
        return accumulator;
      }, transformedData);
    }

    const retval = data.map(
      branches => {
        const transformed: TransformedData = {
          x: [],
          y: [],
        };

        if (branches.length === 0) {
          return transformed;
        }

        addDataFromBranch(branches[0], transformed);

        for (let branchIndex = 1; branchIndex < branches.length; branchIndex++) {

          // add gap
          const leftBranch = branches[branchIndex - 1];
          const rightBranch = branches[branchIndex];
          const leftX = leftBranch[leftBranch.length - 1].x;
          const rightX = rightBranch[0].x;
          const averageX = 0.5 * (leftX + rightX);
          transformed.x.push(averageX);
          transformed.y.push(null);

          addDataFromBranch(rightBranch, transformed);
        }

        return transformed;
      });

    return retval;
  }

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
