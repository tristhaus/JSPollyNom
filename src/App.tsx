import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { Data as PlotlyData, Shape as PlotlyShape } from 'plotly.js';

import ExpressionsForm from './form/ExpressionsForm';
import { FormValues } from './types';

import { createBranches, Data, Pair, transform } from './service/evaluation';
import { calculateScore, Dot, generateDots, getDotsWithStatus } from './service/dot';
import OverlayMessageBox from './components/OverlayMessageBox';
import HelpContent from './components/HelpContent';

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
  ];

  const decoratedGraphData = transformedGraphData.map<PlotlyData>((tdo, index) => {
    return {
      ...tdo,
      type: 'scatter',
      mode: 'lines',
      name: `f ${index + 1}`,
      marker: { color: graphColors[index] },
      connectgaps: false,
    };
  });

  return { plotlyData: decoratedGraphData, rawData: graphData };
};

const getDotInformation = (goodDots: Dot[], badDots: Dot[], data: Data): { shapes: Partial<PlotlyShape>[], score: number } => {

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
    };
  };

  const dots = getDotsWithStatus(goodDots, badDots, data);

  const score = calculateScore(dots);

  const shapes: Partial<PlotlyShape>[] = [
    ...dots.goodActive.map(dot => createDotShape(dot, '#00008B')),   // DarkBlue 
    ...dots.goodInactive.map(dot => createDotShape(dot, '#ADD8E6')), // LightBlue
    ...dots.badActive.map(dot => createDotShape(dot, '#FF4500')),    // OrangeRed
    ...dots.badInactive.map(dot => createDotShape(dot, '#FFB6C1'))   // LightPink
  ];

  return { shapes: shapes, score: score };
};

const App = () => {
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [fs, setFs] = useState<string[]>(["Math.sqrt(x)"]);
  const [goodDots, setGoodDots] = useState<Dot[]>([]);
  const [badDots, setBadDots] = useState<Dot[]>([]);

  useEffect(() => {
    const { goodDots, badDots } = generateDots();
    setGoodDots(goodDots);
    setBadDots(badDots);
  }, []);

  const { plotlyData, rawData } = createGraphData(fs);

  const { shapes, score } = getDotInformation(goodDots, badDots, rawData);

  const plot = (values: FormValues) => {
    setFs(values.expressions);
  };

  const handleToggleShowHelp = () => {
    setShowHelp(!showHelp);
  };

  return (
    <div>
      <div>
        <button className="helpButton" onClick={() => handleToggleShowHelp()}>?</button>
      </div>
      {showHelp && (<OverlayMessageBox label="OK" action={() => handleToggleShowHelp()} beModal={false}>
        <HelpContent />
      </OverlayMessageBox>)}
      <div style={{ height: 0, width: '100%', paddingBottom: '100%', position: 'relative' }}>
        <Plot
          data={plotlyData}
          layout={{
            title: `score: ${score}`,
            legend: {
              itemclick: false,
              itemdoubleclick: false,
            },
            xaxis: {
              range: [-10, 10]
            },
            yaxis: {
              range: [-10, 10],
              scaleanchor: 'x',
            },
            modebar: {
              remove: ['autoScale2d', 'lasso2d', 'pan2d', 'select2d', 'zoom2d', 'zoomIn2d', 'zoomOut2d'],
            },
            shapes: shapes,
            autosize: true,
          }}
          config={{
            doubleClick: 'reset',
            responsive: true,
          }}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        />
      </div>
      <ExpressionsForm onSubmit={plot} />
    </div>
  );
};

export default App;
