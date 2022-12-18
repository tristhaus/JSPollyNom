const HelpContent = () => {

  return (
    <div>
      <h3>JSPollyNom</h3>
      <p>
        a math teaching tool pretending to be a game with levels by tristhaus. Code available on <a href="https://github.com/tristhaus/jspollynom">GitHub</a>.
      </p>
      <p>
        Enter a function of <span className="codeExample">x</span> in the textbox and press plot.
        Example: <span className="codeExample">sqrt(x ^ 3)</span>, which is the square root of x raised to the power of 3.
        Use it to hit the <span className="goodDotInactive">good dots ⬤</span> and turn them <span className="goodDotActive">active ⬤</span>.
        Do not hit the <span className="badDotInactive">bad dots ⬤</span>.
        Resulting score shown at the top.
        Available functions are:<br/>
        <span className="codeExample">sqrt</span><span>, </span>
        <span className="codeExample">sin</span><span>, </span>
        <span className="codeExample">cos</span><span>, </span>
        <span className="codeExample">tan</span><span>, </span>
        <span className="codeExample">exp</span><span>, </span>
        <span className="codeExample">ln</span><span>, </span>
        <span className="codeExample">abs</span>
      </p>
      <p>
        This is a technology demonstrator.
        The idea is that, eventually 1. there will be more than one level
        2. there may be a user account system
      </p>
    </div>
  );
};

HelpContent.displayName = 'HelpContent';

export default HelpContent;
