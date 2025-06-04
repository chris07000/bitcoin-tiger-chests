import { useWallet } from '@/context/WalletContext';
import Image from 'next/image';

interface WalletButtonProps {
  type: 'xverse' | 'magiceden';
}

export default function WalletButton({ type }: WalletButtonProps) {
  const { connectXverse, connectMagicEden, connectedWallet } = useWallet();

  const handleClick = () => {
    if (type === 'xverse') {
      connectXverse();
    } else if (type === 'magiceden') {
      connectMagicEden();
    }
  };

  // Check if this wallet type is active
  const isActive = connectedWallet?.toLowerCase() === type.toLowerCase();
  const buttonText = type === 'xverse' ? 'Connect Xverse' : 'Connect Magic Eden';
  const imageSrc = type === 'xverse' ? '/xverse-logo.png' : '/magiceden-logo.png';

  return (
    <button 
      className={`wallet-button ${type} ${isActive ? 'active' : ''}`}
      onClick={handleClick}
      disabled={connectedWallet !== null && connectedWallet.toLowerCase() !== type.toLowerCase()}
    >
      <Image src={imageSrc} alt={`${type} logo`} width={24} height={24} />
      <span>{buttonText}</span>
    </button>
  );
} 