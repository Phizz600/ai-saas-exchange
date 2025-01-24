import { ListProductForm } from "@/components/marketplace/list-product/ListProductForm";

export const ListProduct = () => {
  console.log('ListProduct page rendered');
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-exo font-bold text-gray-900">
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