
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/hooks/useWallet';
import { Copy, Download, Eye, EyeOff, Loader2 } from 'lucide-react';
import QRCode from './QRCode';
import { SUPPORTED_CHAINS } from '@/lib/walletCore';
import { toast } from '@/components/ui/sonner';
import useAddressBalance from '@/hooks/useAddressBalance';

const AddressDisplay = () => {
  const { addresses, privateKeys, showPrivateKeys, setShowPrivateKeys, exportAddresses } = useWallet();
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  
  const copyToClipboard = (text: string, chainId: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedAddress(chainId);
        toast.success('Address copied to clipboard');
        setTimeout(() => setCopiedAddress(null), 2000);
      })
      .catch(() => toast.error('Failed to copy address'));
  };

  const toggleShowPrivateKeys = () => {
    if (!showPrivateKeys) {
      // Show warning when enabling private keys
      const confirmed = window.confirm(
        'Warning: Displaying private keys on screen is a security risk. ' +
        'Make sure no one is watching your screen and you are on a secure device. Continue?'
      );
      if (!confirmed) return;
    }
    
    setShowPrivateKeys(!showPrivateKeys);
  };

  if (Object.keys(addresses).length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Derived Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No wallet generated yet. Generate a wallet to see derived addresses.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Derived Addresses</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleShowPrivateKeys}
            className={showPrivateKeys ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
          >
            {showPrivateKeys ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Hide Private Keys
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Show Private Keys
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportAddresses}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SUPPORTED_CHAINS.map((chain) => (
          <ChainCard
            key={chain.id}
            chain={chain}
            address={addresses[chain.id] || ''}
            privateKey={privateKeys[chain.id] || ''}
            showPrivateKey={showPrivateKeys}
            copyToClipboard={copyToClipboard}
            isCopied={copiedAddress === chain.id}
          />
        ))}
      </div>
    </div>
  );
};

interface ChainCardProps {
  chain: {
    id: string;
    name: string;
    symbol: string;
    icon: string;
    color: string;
    note?: string;
  };
  address: string;
  privateKey: string;
  showPrivateKey: boolean;
  copyToClipboard: (text: string, chainId: string) => void;
  isCopied: boolean;
}

const ChainCard = ({ chain, address, privateKey, showPrivateKey, copyToClipboard, isCopied }: ChainCardProps) => {
  const { data: balanceData, isLoading: isBalanceLoading } = useAddressBalance(address, chain.id);
  
  return (
    <Card className="chain-card overflow-hidden">
      <div className="h-1" style={{ backgroundColor: chain.color }}></div>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2 text-xl" style={{ color: chain.color }}>{chain.icon}</span>
            <span>{chain.name}</span>
            {chain.note && <span className="text-xs ml-2 text-muted-foreground">{chain.note}</span>}
          </div>
          <QRCode data={address} chain={chain.name} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-1">Address</div>
          <div className="flex items-center justify-between">
            <div className="crypto-address">{address}</div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => copyToClipboard(address, chain.id)}
            >
              {isCopied ? <span className="text-green-500 text-xs">✓</span> : <Copy size={12} />}
            </Button>
          </div>
        </div>
        
        {showPrivateKey && (
          <div>
            <div className="text-xs font-medium text-destructive mb-1">Private Key (Danger!)</div>
            <div className="crypto-address bg-destructive/10 p-2 rounded-md text-destructive">
              {privateKey}
            </div>
          </div>
        )}
        
        {/* Balance display */}
        <div className="mt-2">
          <div className="text-xs font-medium text-muted-foreground mb-1">Balance</div>
          {isBalanceLoading ? (
            <div className="flex items-center text-sm text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              Loading...
            </div>
          ) : balanceData ? (
            <div className="flex justify-between items-center">
              <div className="font-medium">
                {balanceData.balance} {chain.symbol}
              </div>
              <div className="text-sm text-muted-foreground">
                ${balanceData.usdValue}
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              0.0000 {chain.symbol}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressDisplay;
