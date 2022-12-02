const OverlayMessageBox = ({ children, label, action, beModal }: { children: React.ReactNode, label: string, action: () => void, beModal: boolean }) => {

  return (
    <>
      <div className="darkBG overlayOutside" onClick={beModal ? () => { return; } : action} />
      <div className="overlayBox">
        <div className="overlayVertical">
          <div className="overlayContent">
            {children}
          </div>
          <button className="button overlayButton" onClick={action}>{label}</button>
        </div>
      </div>
    </>
  );
};

OverlayMessageBox.displayName = 'OverlayMessageBox';

export default OverlayMessageBox;
