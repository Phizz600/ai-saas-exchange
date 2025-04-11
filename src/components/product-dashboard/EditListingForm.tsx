
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditProductDialog } from "./EditProductDialog";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Edit, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// This component handles displaying and editing product listing details
export const EditListingForm = () => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch the user's products
  const { data: products, isLoading } = useQuery({
    queryKey: ["user-products"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        return [];
      }

      return data;
    },
  });

  // Selected product details
  const selectedProduct = products?.find(p => p.id === selectedProductId);

  // Opens edit dialog with the selected product
  const handleEditProduct = () => {
    if (selectedProduct) {
      setIsEditDialogOpen(true);
    }
  };

  // Get completion score for the product listing (percentage of fields filled)
  const getCompletionScore = (product: any) => {
    if (!product) return 0;
    
    // Define key fields to check for completeness
    const keyFields = [
      'title', 'description', 'price', 'category', 'stage', 'industry',
      'monthly_revenue', 'monthly_traffic', 'active_users', 'tech_stack',
      'team_size', 'competitors', 'demo_url'
    ];
    
    const optionalFields = [
      'monthly_profit', 'gross_profit_margin', 'customer_acquisition_cost',
      'monetization', 'business_model', 'product_age', 'image_url'
    ];
    
    // Count completed fields
    const completedRequired = keyFields.filter(field => {
      const value = product[field];
      return value !== null && value !== undefined && value !== '' && 
        !(Array.isArray(value) && value.length === 0);
    }).length;
    
    const completedOptional = optionalFields.filter(field => {
      const value = product[field];
      return value !== null && value !== undefined && value !== '' && 
        !(Array.isArray(value) && value.length === 0);
    }).length;
    
    // Calculate score (required fields count more than optional)
    const requiredWeight = 0.8;
    const optionalWeight = 0.2;
    
    const requiredScore = (completedRequired / keyFields.length) * requiredWeight;
    const optionalScore = (completedOptional / optionalFields.length) * optionalWeight;
    
    return Math.floor((requiredScore + optionalScore) * 100);
  };

  // Determine missing fields for the selected product
  const getMissingFields = (product: any): string[] => {
    if (!product) return [];
    
    const importantFields: {[key: string]: string} = {
      'title': 'Title',
      'description': 'Description',
      'price': 'Price',
      'category': 'Category',
      'stage': 'Development Stage',
      'industry': 'Industry',
      'monthly_revenue': 'Monthly Revenue',
      'image_url': 'Product Image',
      'demo_url': 'Demo URL',
      'tech_stack': 'Tech Stack'
    };
    
    return Object.entries(importantFields)
      .filter(([key, _]) => {
        const value = product[key];
        return !value || 
               value === '' || 
               (Array.isArray(value) && value.length === 0) ||
               (typeof value === 'number' && value <= 0);
      })
      .map(([_, label]) => label);
  };

  // Group product fields by category for better organization
  const fieldGroups = [
    {
      name: "Basic Information",
      fields: [
        { key: "title", label: "Title" },
        { key: "description", label: "Description" },
        { key: "price", label: "Price", format: (val: number) => `$${val?.toLocaleString() || 0}` },
        { key: "category", label: "Category" },
        { key: "industry", label: "Industry" },
        { key: "stage", label: "Development Stage" },
        { key: "image_url", label: "Product Image", type: "image" }
      ]
    },
    {
      name: "Metrics & Traffic",
      fields: [
        { key: "monthly_revenue", label: "Monthly Revenue", format: (val: number) => `$${val?.toLocaleString() || 0}` },
        { key: "monthly_profit", label: "Monthly Profit", format: (val: number) => `$${val?.toLocaleString() || 0}` },
        { key: "gross_profit_margin", label: "Profit Margin", format: (val: number) => `${val || 0}%` },
        { key: "monthly_traffic", label: "Monthly Traffic", format: (val: number) => val?.toLocaleString() || 0 },
        { key: "active_users", label: "Active Users" },
        { key: "customer_acquisition_cost", label: "Customer Acquisition Cost", format: (val: number) => `$${val?.toLocaleString() || 0}` }
      ]
    },
    {
      name: "Technical Details",
      fields: [
        { key: "tech_stack", label: "Tech Stack", type: "array" },
        { key: "team_size", label: "Team Size" },
        { key: "has_patents", label: "Has Patents", type: "boolean" },
        { key: "demo_url", label: "Demo URL", type: "url" },
        { key: "product_age", label: "Product Age" }
      ]
    },
    {
      name: "Business Details",
      fields: [
        { key: "business_model", label: "Business Model" },
        { key: "monetization", label: "Monetization" },
        { key: "competitors", label: "Competitors" },
        { key: "business_type", label: "Business Type" },
        { key: "business_location", label: "Business Location" },
        { key: "number_of_employees", label: "Number of Employees" }
      ]
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-gray-200 animate-pulse rounded-md"></div>
        <div className="h-64 bg-gray-200 animate-pulse rounded-md"></div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <Info className="h-12 w-12 text-gray-400" />
          <div>
            <h3 className="text-lg font-semibold mb-2">No Products Listed</h3>
            <p className="text-gray-600 mb-4">
              You haven't listed any products yet. Start by creating your first listing.
            </p>
            <Button asChild>
              <a href="/list-product">List a Product</a>
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold exo-2-heading">Edit Your Listings</h2>
        
        <div className="w-full sm:w-auto">
          <Select 
            value={selectedProductId || ""} 
            onValueChange={(value) => setSelectedProductId(value)}
          >
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Select a product to edit" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.title}
                  <span className="ml-2 opacity-70">
                    ({getCompletionScore(product)}% complete)
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedProduct ? (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold">{selectedProduct.title}</h3>
              <div className="flex items-center mt-1 gap-3">
                <Badge 
                  variant={selectedProduct.status === 'approved' ? 'default' : 
                          selectedProduct.status === 'pending' ? 'secondary' : 'destructive'}
                  className={selectedProduct.status === 'approved' ? 'bg-green-500 hover:bg-green-600' : 
                             selectedProduct.status === 'pending' ? 'bg-amber-500 hover:bg-amber-600' : ''}
                >
                  {selectedProduct.status.charAt(0).toUpperCase() + selectedProduct.status.slice(1)}
                </Badge>
                
                <div className="flex items-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Listing Completion:</span>
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              getCompletionScore(selectedProduct) >= 80 ? 'bg-green-500' : 
                              getCompletionScore(selectedProduct) >= 50 ? 'bg-amber-500' : 
                              'bg-red-500'
                            }`} 
                            style={{width: `${getCompletionScore(selectedProduct)}%`}}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm font-medium">
                          {getCompletionScore(selectedProduct)}%
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Improve your listing by filling in all details</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleEditProduct} 
              className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 transition-opacity"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Listing
            </Button>
          </div>
          
          {getMissingFields(selectedProduct).length > 0 && (
            <div className="mb-6 p-4 border border-amber-200 bg-amber-50 rounded-md">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">Improve your listing</h4>
                  <p className="text-sm text-amber-700 mb-2">
                    The following information is missing:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-amber-700">
                    {getMissingFields(selectedProduct).map((field, index) => (
                      <li key={index}>{field}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          <Tabs defaultValue={fieldGroups[0].name.toLowerCase().replace(/\s/g, '-')}>
            <TabsList className="mb-4">
              {fieldGroups.map((group) => (
                <TabsTrigger 
                  key={group.name} 
                  value={group.name.toLowerCase().replace(/\s/g, '-')}
                >
                  {group.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {fieldGroups.map((group) => (
              <TabsContent 
                key={group.name} 
                value={group.name.toLowerCase().replace(/\s/g, '-')}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {group.fields.map((field) => (
                    <div key={field.key} className="space-y-1">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-500">{field.label}</p>
                        {selectedProduct[field.key] && (
                          <CheckCircle2 className="h-4 w-4 text-green-500 ml-2" />
                        )}
                      </div>
                      
                      {field.type === 'image' && selectedProduct[field.key] ? (
                        <div className="relative h-36 w-36 rounded-md overflow-hidden border">
                          <img 
                            src={selectedProduct[field.key]} 
                            alt={selectedProduct.title} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : field.type === 'array' && Array.isArray(selectedProduct[field.key]) ? (
                        <p className="font-medium">
                          {selectedProduct[field.key].length > 0 
                            ? selectedProduct[field.key].join(', ') 
                            : <span className="text-gray-400 italic">Not provided</span>}
                        </p>
                      ) : field.type === 'boolean' ? (
                        <p className="font-medium">
                          {selectedProduct[field.key] ? 'Yes' : 'No'}
                        </p>
                      ) : field.type === 'url' && selectedProduct[field.key] ? (
                        <a 
                          href={selectedProduct[field.key]} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {selectedProduct[field.key]}
                        </a>
                      ) : (
                        <p className="font-medium">
                          {field.format 
                            ? field.format(selectedProduct[field.key]) 
                            : selectedProduct[field.key] || <span className="text-gray-400 italic">Not provided</span>}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Card>
      ) : (
        <Card className="p-6 bg-gray-50 border-dashed text-center">
          <p className="text-gray-600">
            Select a product from the dropdown to view and edit its details
          </p>
        </Card>
      )}
      
      {selectedProduct && (
        <EditProductDialog
          product={selectedProduct}
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            queryClient.invalidateQueries({ queryKey: ["user-products"] });
          }}
        />
      )}
    </div>
  );
};
