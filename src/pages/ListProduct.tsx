import { ListProductForm } from "@/components/marketplace/list-product/ListProductForm";

export const ListProduct = () => {
  console.log('ListProduct page rendered');
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9b87f5] via-[#D946EF] to-[#0EA5E9]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6 bg-white/90 rounded-xl shadow-xl p-8 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4">
            <img 
              src="/lovable-uploads/f74b20e6-6798-4aeb-badd-2da6c2dce40b.png"
              alt="AI Exchange Logo"
              className="w-24 h-24 object-contain animate-float"
            />
            <h1 className="text-4xl font-exo font-bold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-transparent bg-clip-text">
              List Your AI Product
            </h1>
            <p className="text-lg text-gray-600">
              Share your AI innovation with potential buyers and investors
            </p>
          </div>
          <ListProductForm />
        </div>
      </div>
    </div>
  );
};