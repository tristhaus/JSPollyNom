import { useState } from 'react';
import Plot from 'react-plotly.js';
import { Data as PlotlyData, Shape as PlotlyShape } from 'plotly.js';

import ExpressionsForm from './form/ExpressionsForm';
import { FormValues } from './types';

import { createBranches, Data, Pair, transform } from './service/evaluation'
import { Dot, getDotsWithStatus } from './service/dot'

const createGraphData = (expressions: string[]): { plotlyData: PlotlyData[], rawData: Data } => {

  const evaluate = (expressions: string[]): Data => {

    const retval: Data = [];

    expressions.forEach(expression => {
      const func = eval(`x => ${expression}`) as (x: number) => number;
      const branches: Pair[][] = createBranches(func);

      retval.push(branches);
    });

    return retval;
  };

  const graphData = evaluate(expressions);

  const transformedGraphData = transform(graphData);

  const graphColors = [
    '#000000', // Black
    '#0000FF', // Blue
    '#9400D3', // DarkViolet
    '#A52A2A', // Brown
    '#B0E0E6'  // PowderBlue
  ]

  const decoratedGraphData = transformedGraphData.map<PlotlyData>((tdo, index) => {
    return {
      ...tdo,
      type: 'scatter',
      mode: 'lines',
      name: `f ${index}`,
      marker: { color: graphColors[index] },
      connectgaps: false,
    }
  })

  return { plotlyData: decoratedGraphData, rawData: graphData };
}

const createDotShapes = (data: Data): Partial<PlotlyShape>[] => {

  const createDotShape = (dot: Dot, color: string): Partial<PlotlyShape> => {
    return {
      type: 'circle',
      xref: 'x',
      yref: 'y',
      x0: dot.x - dot.radius,
      x1: dot.x + dot.radius,
      y0: dot.y - dot.radius,
      y1: dot.y + dot.radius,
      opacity: 0.8,
      fillcolor: color,
      line: {
        color: color,
      },
    }
  }

  const dots = getDotsWithStatus(data);

  const retval: Partial<PlotlyShape>[] = [
    ...dots.GoodActive.map(dot => createDotShape(dot, '#00008B')),   // DarkBlue 
    ...dots.GoodInactive.map(dot => createDotShape(dot, '#ADD8E6')), // LightBlue
    ...dots.BadActive.map(dot => createDotShape(dot, '#FF4500')),    // OrangeRed
    ...dots.BadInactive.map(dot => createDotShape(dot, '#FFB6C1'))   // LightPink
  ]

  return retval;
}

const App = () => {
  const [fs, setFs] = useState<string[]>(["Math.sqrt(x)"]);

  const { plotlyData, rawData } = createGraphData(fs);

  const shapes = createDotShapes(rawData);

  const plot = (values: FormValues) => {
    setFs(values.expressions);
  }

  return (
    <div>
      <Plot
        data={plotlyData}
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
          },
          shapes: shapes,
        }}
      />
      <ExpressionsForm onSubmit={plot} />
    </div>
  );
}

export default App;
