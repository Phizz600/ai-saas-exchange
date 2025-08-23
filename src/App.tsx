
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/hooks/use-toast";
import { CleanAuthProvider } from "@/contexts/CleanAuthContext";
import { RouteProvider } from "@/routes/RouteProvider";
import "./App.css";

function App() {
  // Create a new QueryClient instance inside the component
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <CleanAuthProvider>
          <RouteProvider />
          <Toaster />
        </CleanAuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
