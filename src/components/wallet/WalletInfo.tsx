import { useWallet } from '@/context/WalletContext';

export function WalletInfo() {
  const { connectedWallet, walletAddress, disconnectWallet } = useWallet();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!connectedWallet || !walletAddress) {
    return null;
  }

  return (
    <div className="wallet-info">
      <span className="address">
        {connectedWallet === 'MagicEden' ? 'ME: ' : 'XV: '}
        {formatAddress(walletAddress)}
      </span>
      <button 
        className={`wallet-button ${connectedWallet.toLowerCase()}`}
        onClick={disconnectWallet}
      >
        Disconnect
      </button>
    </div>
  );
} 