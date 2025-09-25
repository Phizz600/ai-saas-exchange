import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

export function DraftListings() {
  const navigate = useNavigate();

  const { data: drafts, isLoading, refetch } = useQuery({
    queryKey: ['draft-listings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('draft_products')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching drafts:', error);
        return [];
      }

      return data;
    }
  });

  const handleEditDraft = (draftId: string) => {
    navigate(`/list-product?draft=${draftId}`);
  };

  const handleDeleteDraft = async (draftId: string) => {
    try {
      const { error } = await supabase
        .from('draft_products')
        .delete()
        .eq('id', draftId);

      if (error) throw error;

      toast({
        description: "Draft deleted successfully"
      });
      
      refetch();
    } catch (error) {
      console.error('Error deleting draft:', error);
      toast({
        variant: "destructive",
        title: "Error deleting draft",
        description: "Please try again later"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-white/10 backdrop-blur-lg border-white/20 animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-white/20 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-white/10 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!drafts || drafts.length === 0) {
    return (
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardContent className="p-6 text-center">
          <div className="text-white/60 mb-4">
            <Edit className="h-12 w-12 mx-auto mb-2" />
            <p>No draft listings found</p>
            <p className="text-sm">Start creating a listing to see drafts here</p>
          </div>
          <Button 
            onClick={() => navigate('/list-product')}
            className="bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] hover:from-[#D946EE]/80 hover:to-[#8B5CF6]/80 text-white"
          >
            Create New Listing
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {drafts.map((draft) => {
        const formData = draft.form_data as any;
        const title = formData?.title || 'Untitled Draft';
        const lastUpdated = format(new Date(draft.updated_at), 'MMM dd, yyyy - HH:mm');
        
        return (
          <Card key={draft.id} className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white text-lg">{title}</CardTitle>
                  <div className="flex items-center gap-2 text-white/60 text-sm mt-1">
                    <Calendar className="h-4 w-4" />
                    <span>Last saved: {lastUpdated}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditDraft(draft.id)}
                    className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Continue
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteDraft(draft.id)}
                    className="border-red-400/20 bg-red-400/10 hover:bg-red-400/20 text-red-300 hover:text-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-white/70 text-sm">
                <p>Section: {draft.form_section + 1} of 5</p>
                {formData?.description && (
                  <p className="mt-2 line-clamp-2">{formData.description}</p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}