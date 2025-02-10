
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ListProductFormData } from "../types";
import { UseFormReturn } from "react-hook-form";
import { toast } from "@/hooks/use-toast";

export const useAutosave = (form: UseFormReturn<ListProductFormData>, currentSection: number) => {
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

        const { data: drafts, error } = await supabase
          .from('draft_products')
          .select('*')
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
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
  }, [form]);

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
          description: "Draft saved",
          duration: 2000
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
  };

  return { isLoading, saveForLater };
};
