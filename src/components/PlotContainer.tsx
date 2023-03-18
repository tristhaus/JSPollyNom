import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { Data as PlotlyData, Shape as PlotlyShape } from 'plotly.js';
import { useAppSelector } from '../hooks';
import { transform } from '../service/evaluation';
import { Dot } from '../service/dot';

const getGraphData = (): PlotlyData[] => {

  const graphData = useAppSelector(state => state.game.graphData);

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

  return decoratedGraphData;
};

const getDotInformation = (): Partial<PlotlyShape>[] => {

  const dotColors = {
    goodActive: '#00008B',   // DarkBlue 
    goodInactive: '#ADD8E6', // LightBlue
    badActive: '#FF4500',    // OrangeRed
    badInactive: '#FFB6C1'   // LightPink
  };

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

  const goodDotsActive = useAppSelector(state => state.game.goodDotsActive);
  const goodDotsInactive = useAppSelector(state => state.game.goodDotsInactive);
  const badDotsActive = useAppSelector(state => state.game.badDotsActive);
  const badDotsInactive = useAppSelector(state => state.game.badDotsInactive);

  const shapes: Partial<PlotlyShape>[] = [
    ...goodDotsActive.map(dot => createDotShape(dot, dotColors.goodActive)),
    ...goodDotsInactive.map(dot => createDotShape(dot, dotColors.goodInactive)),
    ...badDotsActive.map(dot => createDotShape(dot, dotColors.badActive)),
    ...badDotsInactive.map(dot => createDotShape(dot, dotColors.badInactive))
  ];

  return shapes;
};

const PlotContainer = () => {

  const plotlyData = getGraphData();

  const shapes = getDotInformation();

  const score = useAppSelector(state => state.game.score);

  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleWindowResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  const availableHeight = height - 120;
  const effectiveMeasure = Math.min(availableHeight, width);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ height: 0, width: effectiveMeasure, paddingBottom: effectiveMeasure, position: 'relative' }}>
        <Plot
          data={plotlyData}
          layout={{
            title: `score: ${score}%`,
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
    </div>
  );
};

PlotContainer.displayName = 'PlotContainer';

export default PlotContainer;