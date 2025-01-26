import { Header } from "@/components/Header";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <Header />
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="flex flex-col space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 font-exo">Hey there!</h1>
              <p className="text-gray-500 mt-2">Track, manage and analyze your AI products performance.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search products..." 
                  className="pl-10 w-[250px] bg-white border-gray-200"
                />
              </div>
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};