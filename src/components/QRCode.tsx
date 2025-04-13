
import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { QrCode } from 'lucide-react';

interface QRCodeProps {
  data: string;
  size?: number;
  chain: string;
}

const QRCode = ({ data, size = 128, chain }: QRCodeProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <QrCode size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{chain} Address QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center p-6">
          <QRCodeSVG value={data} size={size} />
        </div>
        <div className="text-center text-sm font-mono break-all p-2 bg-secondary rounded-md">
          {data}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCode;
