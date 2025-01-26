import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pause, TrendingUp, Percent } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const QuickActions = () => {
  const { toast } = useToast();

  const handlePauseListing = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        return;
      }

      const { error } = await supabase
        .from('products')
        .update({ status: 'paused' })
        .eq('seller_id', user.id)
        .eq('status', 'active');

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your listings have been paused",
      });
    } catch (error) {
      console.error('Error pausing listings:', error);
      toast({
        title: "Error",
        description: "Failed to pause listings",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 font-exo">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 h-auto py-4 bg-gradient-to-r hover:from-[#D946EE]/10 hover:via-[#8B5CF6]/10 hover:to-[#0EA4E9]/10"
          onClick={handlePauseListing}
        >
          <Pause className="h-4 w-4" />
          <div className="text-left">
            <div className="font-semibold">Pause Listings</div>
            <div className="text-sm text-gray-500">Temporarily hide all active listings</div>
          </div>
        </Button>

        <Button 
          variant="outline" 
          className="flex items-center gap-2 h-auto py-4 bg-gradient-to-r hover:from-[#D946EE]/10 hover:via-[#8B5CF6]/10 hover:to-[#0EA4E9]/10"
        >
          <TrendingUp className="h-4 w-4" />
          <div className="text-left">
            <div className="font-semibold">Promote Products</div>
            <div className="text-sm text-gray-500">Boost visibility of your listings</div>
          </div>
        </Button>

        <Button 
          variant="outline" 
          className="flex items-center gap-2 h-auto py-4 bg-gradient-to-r hover:from-[#D946EE]/10 hover:via-[#8B5CF6]/10 hover:to-[#0EA4E9]/10"
        >
          <Percent className="h-4 w-4" />
          <div className="text-left">
            <div className="font-semibold">Offer Discounts</div>
            <div className="text-sm text-gray-500">Create special offers</div>
          </div>
        </Button>
      </div>
    </Card>
  );
};