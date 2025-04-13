
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWallet } from '@/hooks/useWallet';
import { AlertTriangle, Copy, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const MnemonicGenerator = () => {
  const { mnemonic, generateNewWallet, isGenerating, resetWallet } = useWallet();
  const [showMnemonic, setShowMnemonic] = useState(false);

  const copyToClipboard = () => {
    if (!mnemonic) return;
    
    navigator.clipboard.writeText(mnemonic)
      .then(() => toast.success('Mnemonic copied to clipboard'))
      .catch(() => toast.error('Failed to copy mnemonic'));
  };

  const toggleShowMnemonic = () => {
    setShowMnemonic(prev => !prev);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Wallet Mnemonic</span>
          {mnemonic && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetWallet}
              className="text-destructive"
            >
              Reset Wallet
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          Generate a new 12-word mnemonic phrase or reset your current wallet
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mnemonic ? (
          <>
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Never share your mnemonic phrase with anyone. Anyone with this phrase can access all your funds.
              </AlertDescription>
            </Alert>
            
            <div className="relative">
              <div className={`grid grid-cols-3 gap-2 md:grid-cols-4 ${!showMnemonic ? 'blur-sm select-none' : ''}`}>
                {mnemonic.split(' ').map((word, i) => (
                  <div key={i} className="p-2 bg-secondary rounded-md text-center">
                    <span className="text-muted-foreground text-xs mr-1">{i + 1}.</span>
                    <span className="font-mono">{word}</span>
                  </div>
                ))}
              </div>
              
              {!showMnemonic && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button variant="secondary" onClick={toggleShowMnemonic}>
                    <Eye className="mr-2 h-4 w-4" />
                    Show Phrase
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No wallet generated yet. Click the button below to create one.
            </p>
            <Button 
              onClick={generateNewWallet} 
              disabled={isGenerating}
              className="bg-tellet-primary hover:bg-tellet-secondary text-white"
            >
              {isGenerating ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Generate New Wallet
            </Button>
          </div>
        )}
      </CardContent>
      {mnemonic && showMnemonic && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm" onClick={toggleShowMnemonic}>
            <EyeOff className="mr-2 h-4 w-4" />
            Hide Phrase
          </Button>
          <Button variant="secondary" size="sm" onClick={copyToClipboard}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Phrase
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default MnemonicGenerator;
