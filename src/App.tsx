import { useEffect, useState } from 'react';

import ExpressionsForm from './form/ExpressionsForm';

import { Problem } from './types';

import { generateDots } from './service/dot';
import OverlayMessageBox from './components/OverlayMessageBox';
import HelpContent from './components/HelpContent';
import PlotContainer from './components/PlotContainer';
import { useAppDispatch } from './hooks';
import { reset, updateExpression } from './reducers/game';

const App = () => {
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [problem, setProblem] = useState<Problem>(Problem.SquarePolynomial);

  const dispatch = useAppDispatch();

  const changeProblem = (newProblem: Problem) => {
    setProblem(newProblem);
    const { goodDots, badDots } = generateDots(newProblem);

    dispatch(reset({ goodInactive: goodDots, badInactive: badDots, goodActive: [], badActive: [] }));
  };

  useEffect(() => {
    changeProblem(problem);
    dispatch(updateExpression('sqrt(x^3)'));

  }, []);

  const handleProblemSelectChange = (newValue: Problem) => {
    changeProblem(newValue);
    dispatch(updateExpression(''));
  };

  const handleToggleShowHelp = () => {
    setShowHelp(!showHelp);
  };

  return (
    <div>
      <div className="topLine">
        <select value={problem} onChange={e => handleProblemSelectChange(e.target.value as Problem)}>
          <option value={Problem.SquarePolynomial}>Level 1 - easy</option>
          <option value={Problem.Sine}>Level 2 - medium</option>
          <option value={Problem.Rationals}>Level 3 - medium</option>
          <option value={Problem.Gaussian}>Level 4 - hard</option>
        </select>
        <button className="helpButton" onClick={() => handleToggleShowHelp()}>?</button>
      </div>
      {showHelp && (<OverlayMessageBox label="OK" action={() => handleToggleShowHelp()} beModal={false}>
        <HelpContent />
      </OverlayMessageBox>)}
      <PlotContainer />
      <ExpressionsForm />
    </div>
  );
};

export default App;
