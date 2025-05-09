
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/hooks/use-toast";
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
        <Router>
          <RouteProvider />
          <Toaster />
        </Router>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
