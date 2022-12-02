const HelpContent = () => {

  return (
    <div>
      <h3>JSPollyNom</h3>
      <p>
        a math teaching tool pretending to be a game with levels by tristhaus. Code available on <a href="https://github.com/tristhaus/jspollynom">GitHub</a>.
      </p>
      <p>
        Enter a function of <span className="codeExample">x</span> in the textbox and press plot.
        Example: <span className="codeExample">Math.sqrt(x ** 3)</span>.
        Use it to hit the <span className="goodDotInactive">good dots ⬤</span> and turn them <span className="goodDotActive">active ⬤</span>.
        Do not hit the <span className="badDotInactive">bad dots ⬤</span>.
        Resulting score shown at the top.
      </p>
      <p>
        This is a technology demonstrator.
        The idea is that, eventually 1. the function will no longer be JavaScript using <span className="codeExample">eval</span>, but parsed,
        which will allow to restrict the input
        2. there will be more than one level
        3. there may be a user account system
      </p>
    </div>
  );
};

HelpContent.displayName = 'HelpContent';

export default HelpContent;
