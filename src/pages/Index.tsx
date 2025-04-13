
import { useState } from 'react';
import MnemonicGenerator from '@/components/MnemonicGenerator';
import AddressDisplay from '@/components/AddressDisplay';
import MessageSigner from '@/components/MessageSigner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WalletProvider } from '@/hooks/useWallet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Wallet, MessageSquare, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const queryClient = new QueryClient();

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>('addresses');

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <div className="min-h-screen bg-background text-foreground">
          <header className="py-6 px-4 border-b">
            <div className="container mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-tellet-primary rounded-full p-2">
                    <Wallet className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold">Tellet-Test Wallet</h1>
                </div>
              </div>
            </div>
          </header>
          
          <main className="container mx-auto py-8 px-4">
            <Alert className="mb-8">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Demo Mode</AlertTitle>
              <AlertDescription>
                This is a test wallet that uses simulated blockchain data. In a production environment, 
                Trust Wallet Core would be used for cryptographic operations, and real blockchain RPC 
                providers would be used for balance fetching.
              </AlertDescription>
            </Alert>
            
            <div className="mb-8">
              <MnemonicGenerator />
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="addresses" className="flex items-center">
                  <Wallet className="mr-2 h-4 w-4" />
                  <span>Addresses</span>
                </TabsTrigger>
                <TabsTrigger value="sign" className="flex items-center">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Sign Message</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="addresses" className="mt-4">
                <AddressDisplay />
              </TabsContent>
              <TabsContent value="sign" className="mt-4">
                <MessageSigner />
              </TabsContent>
            </Tabs>
          </main>
          
          <footer className="py-6 px-4 border-t">
            <div className="container mx-auto">
              <div className="text-center text-sm text-muted-foreground">
                Tellet-Test Wallet &copy; {new Date().getFullYear()} | Multi-Chain Test Wallet using Trust Wallet Core
              </div>
            </div>
          </footer>
        </div>
      </WalletProvider>
    </QueryClientProvider>
  );
};

export default Index;
