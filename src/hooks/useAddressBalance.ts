
import { useQuery } from '@tanstack/react-query';

interface Balance {
  balance: string;
  usdValue: string;
  tokenPrice: string;
}

export const useAddressBalance = (address: string, chainId: string) => {
  return useQuery({
    queryKey: ['balance', chainId, address],
    queryFn: async (): Promise<Balance> => {
      // In a real app, this would make an API call to fetch the balance
      // For demo purposes, we'll simulate random balances
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Generate random balance between 0 and 10
      const randomBalance = Math.random() * 10;
      const formattedBalance = randomBalance.toFixed(4);
      
      // Generate random price between $10 and $5000
      const randomPrice = (Math.random() * 4990) + 10;
      const formattedPrice = randomPrice.toFixed(2);
      
      // Calculate USD value
      const usdValue = (randomBalance * randomPrice).toFixed(2);
      
      return {
        balance: formattedBalance,
        usdValue,
        tokenPrice: formattedPrice
      };
    },
    // Only fetch if we have an address
    enabled: !!address,
    staleTime: 60 * 1000, // 1 minute
  });
};

export default useAddressBalance;
