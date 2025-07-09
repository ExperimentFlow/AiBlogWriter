import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ShoppingCart, ExternalLink } from 'lucide-react';

interface CheckoutEmbedProps {
  subdomain: string;
  buttonText?: string;
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  buttonSize?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  openInNewTab?: boolean;
}

export default function CheckoutEmbed({
  subdomain,
  buttonText = 'Checkout',
  buttonVariant = 'default',
  buttonSize = 'default',
  className = '',
  openInNewTab = false
}: CheckoutEmbedProps) {
  const [isOpen, setIsOpen] = useState(false);

  const checkoutUrl = `${window.location.protocol}//${subdomain}.${window.location.hostname}/checkout`;

  const handleClick = () => {
    if (openInNewTab) {
      window.open(checkoutUrl, '_blank');
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <Button
        variant={buttonVariant}
        size={buttonSize}
        onClick={handleClick}
        className={className}
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        {buttonText}
      </Button>

      {!openInNewTab && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-4xl h-[80vh] p-0">
            <DialogHeader className="p-4 border-b">
              <DialogTitle className="flex items-center justify-between">
                <span>Checkout</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(checkoutUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </Button>
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 h-full">
              <iframe
                src={checkoutUrl}
                className="w-full h-full border-0"
                title="Checkout"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
} 