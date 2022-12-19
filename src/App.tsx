import { useEffect, useState } from 'react';

import ExpressionsForm from './form/ExpressionsForm';

import { generateDots } from './service/dot';
import OverlayMessageBox from './components/OverlayMessageBox';
import HelpContent from './components/HelpContent';
import PlotContainer from './components/PlotContainer';
import { useAppDispatch } from './hooks';
import { reset, updateExpression } from './reducers/game';

const App = () => {
  const [showHelp, setShowHelp] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const { goodDots, badDots } = generateDots();

    dispatch(reset({ goodInactive: goodDots, badInactive: badDots, goodActive: [], badActive: [] }));
    dispatch(updateExpression('sqrt(x^3)'));
  }, []);

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
      <PlotContainer />
      <ExpressionsForm />
    </div>
  );
};

export default App;
