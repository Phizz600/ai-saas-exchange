
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { UserProfile } from "@/components/admin/UserProfile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [productToReject, setProductToReject] = useState<string | null>(null);

  // Check if user is admin
  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/");
      return;
    }

    const { data: isAdmin } = await supabase.rpc('has_role', {
      user_id: user.id,
      requested_role: 'admin'
    });

    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive"
      });
      navigate("/");
    }
  };

  useEffect(() => {
    checkAdminAccess();
  }, []);

  // Fetch pending listings
  const { data: pendingListings, refetch } = useQuery({
    queryKey: ['pendingListings', searchTerm, selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          seller:profiles(*)
        `)
        .eq('status', 'pending');

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    }
  });

  // Handle listing approval
  const handleApprove = async (productId: string) => {
    const { error } = await supabase
      .from('products')
      .update({ status: 'approved' })
      .eq('id', productId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to approve listing",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Listing approved successfully"
      });
      refetch();
    }
  };

  // Handle listing rejection
  const handleReject = async () => {
    if (!productToReject || !rejectionReason) return;

    const { error } = await supabase
      .from('products')
      .update({ 
        status: 'rejected',
        special_notes: rejectionReason 
      })
      .eq('id', productToReject);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to reject listing",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Listing rejected successfully"
      });
      setShowRejectionDialog(false);
      setRejectionReason("");
      setProductToReject(null);
      refetch();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search by title or description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          <option value="">All Categories</option>
          <option value="SaaS">SaaS</option>
          <option value="Mobile App">Mobile App</option>
          <option value="E-commerce">E-commerce</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Pending Listings Table */}
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Listing Title</TableHead>
              <TableHead>Submitted By</TableHead>
              <TableHead>Date Submitted</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingListings?.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell>{listing.title}</TableCell>
                <TableCell>
                  <button
                    onClick={() => setSelectedUserId(listing.seller_id)}
                    className="text-blue-600 hover:underline"
                  >
                    {listing.seller?.email}
                  </button>
                </TableCell>
                <TableCell>
                  {new Date(listing.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{listing.category}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {listing.description}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      onClick={() => handleApprove(listing.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setProductToReject(listing.id);
                        setShowRejectionDialog(true);
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Rejection Dialog */}
      <Dialog 
        open={showRejectionDialog} 
        onOpenChange={setShowRejectionDialog}
      >
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Reject Listing</h2>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full h-32 p-2 border rounded-md mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowRejectionDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!rejectionReason}
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* User Profile Sidebar */}
      {selectedUserId && (
        <UserProfile
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  );
}
