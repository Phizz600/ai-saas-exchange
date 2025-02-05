import { DashboardLayout } from "@/components/product-dashboard/DashboardLayout";

export function Promote() {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Promote Your Product</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Package */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Basic Promotion</h2>
            <p className="text-gray-600 mb-4">Get your product featured in the marketplace for 7 days</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Featured listing
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Priority search placement
              </li>
            </ul>
            <button className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors">
              Select Basic - $49
            </button>
          </div>

          {/* Premium Package */}
          <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-lg shadow-md border-2 border-primary">
            <div className="absolute -top-3 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm">
              Popular
            </div>
            <h2 className="text-xl font-semibold mb-4">Premium Promotion</h2>
            <p className="text-gray-600 mb-4">Maximum visibility for 14 days with enhanced features</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Featured listing
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Top search placement
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Social media promotion
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Newsletter feature
              </li>
            </ul>
            <button className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors">
              Select Premium - $99
            </button>
          </div>

          {/* Spotlight Package */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Spotlight Package</h2>
            <p className="text-gray-600 mb-4">30-day comprehensive promotion package</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                All Premium features
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Homepage spotlight
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Email campaign feature
              </li>
            </ul>
            <button className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors">
              Select Spotlight - $199
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}