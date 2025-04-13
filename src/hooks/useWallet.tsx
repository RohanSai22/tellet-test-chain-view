
import { useState, createContext, useContext, ReactNode } from 'react';
import { generateMnemonic, deriveAddress, derivePrivateKey, SUPPORTED_CHAINS } from '@/lib/walletCore';
import { toast } from '@/components/ui/sonner';

interface WalletContextType {
  mnemonic: string;
  addresses: Record<string, string>;
  privateKeys: Record<string, string>;
  isGenerating: boolean;
  showPrivateKeys: boolean;
  setShowPrivateKeys: (show: boolean) => void;
  generateNewWallet: () => Promise<void>;
  resetWallet: () => void;
  exportAddresses: () => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [mnemonic, setMnemonic] = useState<string>('');
  const [addresses, setAddresses] = useState<Record<string, string>>({});
  const [privateKeys, setPrivateKeys] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showPrivateKeys, setShowPrivateKeys] = useState<boolean>(false);

  const generateNewWallet = async () => {
    try {
      setIsGenerating(true);
      
      // Generate mnemonic
      const newMnemonic = await generateMnemonic();
      setMnemonic(newMnemonic);
      
      // Derive addresses for all chains
      const newAddresses: Record<string, string> = {};
      const newPrivateKeys: Record<string, string> = {};
      
      SUPPORTED_CHAINS.forEach(chain => {
        newAddresses[chain.id] = deriveAddress(newMnemonic, chain.id);
        newPrivateKeys[chain.id] = derivePrivateKey(newMnemonic, chain.id);
      });
      
      setAddresses(newAddresses);
      setPrivateKeys(newPrivateKeys);
      
      toast.success('Wallet generated successfully!');
    } catch (error) {
      console.error('Error generating wallet:', error);
      toast.error('Failed to generate wallet');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetWallet = () => {
    setMnemonic('');
    setAddresses({});
    setPrivateKeys({});
    setShowPrivateKeys(false);
    toast.success('Wallet reset successfully!');
  };

  const exportAddresses = () => {
    if (Object.keys(addresses).length === 0) {
      toast.error('No addresses to export');
      return;
    }
    
    try {
      let csv = 'Chain,Symbol,Address\n';
      
      SUPPORTED_CHAINS.forEach(chain => {
        if (addresses[chain.id]) {
          csv += `${chain.name},${chain.symbol},${addresses[chain.id]}\n`;
        }
      });
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'tellet-addresses.csv');
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Addresses exported successfully!');
    } catch (error) {
      console.error('Error exporting addresses:', error);
      toast.error('Failed to export addresses');
    }
  };

  return (
    <WalletContext.Provider
      value={{
        mnemonic,
        addresses,
        privateKeys,
        isGenerating,
        showPrivateKeys,
        setShowPrivateKeys,
        generateNewWallet,
        resetWallet,
        exportAddresses,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export default useWallet;
