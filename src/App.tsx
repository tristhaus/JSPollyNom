import Plot from 'react-plotly.js';

const App = () => {
  return (
    <div>
      <Plot
        data={[
          {
            x: [1, 2, 3],
            y: [2, 6, 3],
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: 'red' },
          }
        ]}

        layout={{
          width: 500,
          height: 500,
          title: 'A Fancy Plot',
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
