
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PendingProductsTable } from "@/components/admin/PendingProductsTable";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const AdminDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { count: pendingCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: approvedCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      const { count: rejectedCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'rejected');

      return {
        pending: pendingCount || 0,
        approved: approvedCount || 0,
        rejected: rejectedCount || 0,
      };
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Admin Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-sm font-medium text-gray-500 uppercase">Pending Review</h3>
              <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-[#8B5CF6] to-[#D946EE] bg-clip-text text-transparent">
                {stats?.pending || 0}
              </p>
            </Card>
            <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-sm font-medium text-gray-500 uppercase">Approved</h3>
              <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-[#8B5CF6] to-[#D946EE] bg-clip-text text-transparent">
                {stats?.approved || 0}
              </p>
            </Card>
            <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-sm font-medium text-gray-500 uppercase">Rejected</h3>
              <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-[#8B5CF6] to-[#D946EE] bg-clip-text text-transparent">
                {stats?.rejected || 0}
              </p>
            </Card>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-900">Pending Products</h2>
          <PendingProductsTable />
        </div>
      </div>
    </AdminLayout>
  );
};
