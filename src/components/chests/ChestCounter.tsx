interface ChestCounterProps {
  totalChestsOpened: number;
  bronzeTokens: number;
  silverTokens: number;
  goldTokens: number;
}

export default function ChestCounter({ 
  totalChestsOpened, 
  bronzeTokens, 
  silverTokens, 
  goldTokens 
}: ChestCounterProps) {
  return (
    <div className="chest-counter">
      <div className="counter-header">
        <h2 className="pixel-title">Total Chests Opened</h2>
        <div className="total-opened">{totalChestsOpened}</div>
      </div>
      
      <div className="token-grid">
        <div className="token bronze">
          <div className="token-count">{bronzeTokens}</div>
          <div className="token-label">Bronze Tokens</div>
        </div>
        
        <div className="token silver">
          <div className="token-count">{silverTokens}</div>
          <div className="token-label">Silver Tokens</div>
        </div>
        
        <div className="token gold">
          <div className="token-count">{goldTokens}</div>
          <div className="token-label">Gold Tokens</div>
        </div>
      </div>
    </div>
  );
} 