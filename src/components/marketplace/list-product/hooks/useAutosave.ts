
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ListProductFormData } from "../types";
import { UseFormReturn } from "react-hook-form";
import { toast } from "@/hooks/use-toast";

export const useAutosave = (form: UseFormReturn<ListProductFormData>, currentSection: number, draftIdParam?: string) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [draftId, setDraftId] = useState<string | null>(null);

  // Load existing draft
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        let drafts = null;
        let error = null;

        if (draftIdParam) {
          // Load specific draft by ID
          const result = await supabase
            .from('draft_products')
            .select('*')
            .eq('user_id', user.id)
            .eq('id', draftIdParam)
            .single();
          
          drafts = result.data;
          error = result.error;
        } else {
          // Load latest draft
          const result = await supabase
            .from('draft_products')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle();
          
          drafts = result.data;
          error = result.error;
        }

        if (error) {
          console.error('Error loading draft:', error);
          return;
        }

        if (drafts) {
          form.reset(drafts.form_data as ListProductFormData);
          setDraftId(drafts.id);
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDraft();
  }, [form, draftIdParam]);

  const saveDraft = async (showToast = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const formData = form.getValues();
      
      if (draftId) {
        const { error } = await supabase
          .from('draft_products')
          .update({
            form_data: formData,
            form_section: currentSection,
            updated_at: new Date().toISOString()
          })
          .eq('id', draftId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('draft_products')
          .insert({
            user_id: user.id,
            form_data: formData,
            form_section: currentSection
          })
          .select()
          .single();

        if (error) throw error;
        setDraftId(data.id);
      }

      if (showToast) {
        toast({
          description: "Draft saved"
        });
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      if (showToast) {
        toast({
          variant: "destructive",
          title: "Error saving draft",
          description: "Please try again later"
        });
      }
    }
  };

  const saveForLater = async () => {
    await saveDraft(true); // Save with toast notification
    
    // Navigate to product dashboard after saving
    setTimeout(() => {
      navigate('/product-dashboard');
    }, 500); // Small delay to ensure toast is visible
  };

  return { isLoading, saveForLater };
};
