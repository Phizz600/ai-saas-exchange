
import { Bell, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { Link } from "react-router-dom";

interface BidNotificationProps {
  notification: {
    id: string;
    title: string;
    message: string;
    created_at: string;
    read: boolean;
    type: string;
    related_product_id?: string;
    related_bid_id?: string;
  };
  onMarkAsRead: (id: string) => void;
  productDetails?: {
    title: string;
    image_url?: string;
    current_price?: number;
  };
}

export function BidNotification({ 
  notification, 
  onMarkAsRead,
  productDetails
}: BidNotificationProps) {
  const isOutbid = notification.type === 'outbid';
  const isPriceDecrease = notification.type === 'price_decrease';
  const isEndingSoon = notification.type === 'auction_ending_soon';
  const isEnded = notification.type === 'auction_ended';
  
  return (
    <div className={`p-4 mb-2 rounded-lg border ${notification.read ? 'bg-gray-50' : 'bg-amber-50 border-amber-200'} transition-colors`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full flex-shrink-0 ${
          isOutbid ? 'bg-red-100' : 
          isPriceDecrease ? 'bg-green-100' : 
          isEndingSoon ? 'bg-amber-100' : 
          'bg-blue-100'
        }`}>
          {notification.read ? (
            <Bell className={`h-5 w-5 ${
              isOutbid ? 'text-red-500' : 
              isPriceDecrease ? 'text-green-500' : 
              isEndingSoon ? 'text-amber-500' : 
              'text-blue-500'
            }`} />
          ) : (
            <BellRing className={`h-5 w-5 ${
              isOutbid ? 'text-red-500' : 
              isPriceDecrease ? 'text-green-500' : 
              isEndingSoon ? 'text-amber-500' : 
              'text-blue-500'
            }`} />
          )}
        </div>
        
        <div className="space-y-1 flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-gray-900">{notification.title}</h4>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
            </span>
          </div>
          
          <p className="text-sm text-gray-600">{notification.message}</p>
          
          {productDetails && (
            <div className="mt-2 bg-white rounded p-2 border flex items-center gap-3">
              {productDetails.image_url && (
                <img 
                  src={productDetails.image_url} 
                  alt={productDetails.title} 
                  className="w-12 h-12 object-cover rounded" 
                />
              )}
              <div>
                <h5 className="font-medium text-sm">{productDetails.title}</h5>
                {productDetails.current_price !== undefined && (
                  <p className="text-sm text-green-600">
                    Current Price: {formatCurrency(productDetails.current_price)}
                  </p>
                )}
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center mt-3">
            {notification.related_product_id && (
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                className="text-xs"
              >
                <Link to={`/product/${notification.related_product_id}`}>
                  View Auction
                </Link>
              </Button>
            )}
            
            {!notification.read && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs"
                onClick={() => onMarkAsRead(notification.id)}
              >
                Mark as Read
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
