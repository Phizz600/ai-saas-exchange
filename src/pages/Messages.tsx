import { useState, useEffect } from "react";
import { useNavigate, useParams, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { ConversationList } from "@/components/messaging/ConversationList";
import { ChatWindow } from "@/components/messaging/ChatWindow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import ExpandableTabs from "@/components/ui/ExpandableTabs";
export const Messages = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const {
    conversationId
  } = useParams<{
    conversationId?: string;
  }>();
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      const isAuthed = !!session;
      setIsAuthenticated(isAuthed);
      if (!isAuthed) {
        navigate('/auth', {
          state: {
            redirect: '/messages'
          }
        });
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);
  if (loading) {
    return <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-20 pb-10">
          <div className="animate-pulse flex flex-col items-center justify-center mt-20">
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-100 rounded w-full max-w-2xl"></div>
          </div>
        </div>
      </div>;
  }
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }
  return <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 pt-20 pb-10">
        <ExpandableTabs />
        <h1 className="text-3xl font-bold mb-6 exo-2-heading bg-gradient-to-r from-[#D946EE] to-[#0EA4E9] bg-clip-text text-zinc-950">
          Messages
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`${conversationId ? 'hidden lg:block' : ''} lg:col-span-1`}>
            <h2 className="text-xl font-semibold mb-4">Conversations</h2>
            <ConversationList />
          </div>
          
          <div className={`${!conversationId ? 'hidden lg:block' : ''} lg:col-span-2`}>
            {conversationId ? <ChatWindow /> : <div className="h-[calc(100vh-14rem)] flex items-center justify-center bg-accent/10 rounded-lg p-6 text-center">
                <div>
                  <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
                  <p className="text-muted-foreground">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>}
          </div>
        </div>
      </div>
    </div>;
};
export default Messages;