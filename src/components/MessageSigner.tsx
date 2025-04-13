
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useWallet } from '@/hooks/useWallet';
import { signMessage, verifyMessage, COIN_TYPES } from '@/lib/walletCore';
import { Copy, FileSignature, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const MessageSigner = () => {
  const { addresses, privateKeys } = useWallet();
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [recoveredAddress, setRecoveredAddress] = useState('');
  const [isSigning, setIsSigning] = useState(false);
  
  const ethAddress = addresses[COIN_TYPES.ETHEREUM] || '';
  const ethPrivateKey = privateKeys[COIN_TYPES.ETHEREUM] || '';

  const handleSign = async () => {
    if (!message || !ethPrivateKey) {
      toast.error('Message and Ethereum wallet are required');
      return;
    }
    
    try {
      setIsSigning(true);
      const sig = await signMessage(message, ethPrivateKey);
      setSignature(sig);
      
      // Also verify the message
      const recoveredAddr = verifyMessage(message, sig);
      setRecoveredAddress(recoveredAddr);
      
      toast.success('Message signed successfully');
    } catch (error) {
      console.error('Error signing message:', error);
      toast.error('Failed to sign message');
    } finally {
      setIsSigning(false);
    }
  };

  const reset = () => {
    setMessage('');
    setSignature('');
    setRecoveredAddress('');
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(`${type} copied to clipboard`))
      .catch(() => toast.error(`Failed to copy ${type}`));
  };

  const isWalletGenerated = !!ethAddress;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ethereum Message Signer</CardTitle>
        <CardDescription>
          Sign a message with your Ethereum private key and verify the signature
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isWalletGenerated ? (
          <div className="text-center py-4 text-muted-foreground">
            Generate a wallet first to use the message signer.
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="eth-address">Ethereum Address</Label>
              <div className="flex">
                <Input
                  id="eth-address"
                  value={ethAddress}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  className="ml-2"
                  size="icon"
                  onClick={() => copyToClipboard(ethAddress, 'Address')}
                >
                  <Copy size={16} />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter a message to sign..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-24"
              />
            </div>
            
            {signature && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="signature">Signature</Label>
                  <div className="flex">
                    <Input
                      id="signature"
                      value={signature}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      variant="outline"
                      className="ml-2"
                      size="icon"
                      onClick={() => copyToClipboard(signature, 'Signature')}
                    >
                      <Copy size={16} />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="recovered">Recovered Address</Label>
                  <Input
                    id="recovered"
                    value={recoveredAddress}
                    readOnly
                    className="font-mono text-sm"
                  />
                  {recoveredAddress.toLowerCase() === ethAddress.toLowerCase() ? (
                    <p className="text-green-500 text-sm mt-1">✓ Signature verified successfully</p>
                  ) : (
                    <p className="text-red-500 text-sm mt-1">× Signature verification failed</p>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
      {isWalletGenerated && (
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={reset}
            disabled={!message && !signature}
          >
            Reset
          </Button>
          <Button
            onClick={handleSign}
            disabled={!message || isSigning}
            className="bg-tellet-primary hover:bg-tellet-secondary text-white"
          >
            {isSigning ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Signing...
              </>
            ) : (
              <>
                <FileSignature className="mr-2 h-4 w-4" />
                Sign Message
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default MessageSigner;
