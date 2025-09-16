import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  User,
  Database as DatabaseIcon
} from "lucide-react";

export const ProfileTestSimple = () => {
  const [authState, setAuthState] = useState({
    email: 'testuser1757920783862@gmail.com',
    password: 'testpassword123',
    loading: false,
    user: null as any,
    error: '',
    profile: null as any,
    products: [] as any[],
    likedProducts: [] as any[]
  });

  const handleSignIn = async () => {
    setAuthState(prev => ({ ...prev, loading: true, error: '' }));
    
    try {
      console.log('Testing sign in...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authState.email,
        password: authState.password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        console.log('Sign in successful:', data.user);
        setAuthState(prev => ({ 
          ...prev, 
          loading: false, 
          user: data.user,
          error: ''
        }));
        
        // Fetch profile data
        await fetchProfileData(data.user.id);
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
    }
  };

  const fetchProfileData = async (userId: string) => {
    try {
      console.log('Fetching profile data for user:', userId);
      
      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
      } else {
        console.log('Profile fetched:', profile);
        setAuthState(prev => ({ ...prev, profile }));
      }

      // Fetch user products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', userId);

      if (productsError) {
        console.error('Products fetch error:', productsError);
      } else {
        console.log('User products fetched:', products);
        setAuthState(prev => ({ ...prev, products: products || [] }));
      }

      // Fetch liked products
      if (profile?.liked_products?.length > 0) {
        const { data: likedProducts, error: likedError } = await supabase
          .from('products')
          .select('*')
          .in('id', profile.liked_products);

        if (likedError) {
          console.error('Liked products fetch error:', likedError);
        } else {
          console.log('Liked products fetched:', likedProducts);
          setAuthState(prev => ({ ...prev, likedProducts: likedProducts || [] }));
        }
      }

    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setAuthState(prev => ({ 
        ...prev, 
        user: null, 
        profile: null,
        products: [],
        likedProducts: [],
        error: ''
      }));
      console.log('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="container mx-auto max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DatabaseIcon className="h-5 w-5" />
              Simple Profile Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Authentication Status */}
            <div>
              <h3 className="font-semibold mb-3">Authentication Status</h3>
              <div className="flex items-center gap-2">
                {authState.user ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="font-medium">
                  {authState.user ? 'Authenticated' : 'Not Authenticated'}
                </span>
                {authState.user && (
                  <span className="text-sm text-muted-foreground">
                    ({authState.user.email})
                  </span>
                )}
              </div>
            </div>

            {/* Error Display */}
            {authState.error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{authState.error}</AlertDescription>
              </Alert>
            )}

            {/* Authentication Form */}
            {!authState.user && (
              <div className="space-y-4">
                <h3 className="font-semibold">Sign In to Test</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={authState.email}
                      onChange={(e) => setAuthState(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={authState.password}
                      onChange={(e) => setAuthState(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleSignIn} 
                  disabled={authState.loading}
                  className="w-full"
                >
                  {authState.loading ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            )}

            {/* Profile Data */}
            {authState.user && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Profile Data</h3>
                  <Button onClick={handleSignOut} variant="outline" size="sm">
                    Sign Out
                  </Button>
                </div>

                {/* Profile Info */}
                {authState.profile && (
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Profile Information</h4>
                    <div className="space-y-1 text-sm">
                      <div><strong>Name:</strong> {authState.profile.full_name || 'Not set'}</div>
                      <div><strong>Username:</strong> {authState.profile.username || 'Not set'}</div>
                      <div><strong>User Type:</strong> {authState.profile.user_type || 'Not set'}</div>
                      <div><strong>Bio:</strong> {authState.profile.bio || 'Not set'}</div>
                      <div><strong>Liked Products:</strong> {authState.profile.liked_products?.length || 0}</div>
                    </div>
                  </div>
                )}

                {/* User Products */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">User Products ({authState.products.length})</h4>
                  {authState.products.length > 0 ? (
                    <div className="space-y-2">
                      {authState.products.map((product) => (
                        <div key={product.id} className="text-sm p-2 bg-gray-50 rounded">
                          <div><strong>{product.title}</strong></div>
                          <div>Price: ${product.price?.toLocaleString()}</div>
                          <div>Status: {product.status}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">No products found</div>
                  )}
                </div>

                {/* Liked Products */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Liked Products ({authState.likedProducts.length})</h4>
                  {authState.likedProducts.length > 0 ? (
                    <div className="space-y-2">
                      {authState.likedProducts.map((product) => (
                        <div key={product.id} className="text-sm p-2 bg-gray-50 rounded">
                          <div><strong>{product.title}</strong></div>
                          <div>Price: ${product.price?.toLocaleString()}</div>
                          <div>Status: {product.status}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">No liked products found</div>
                  )}
                </div>
              </div>
            )}

            {/* Instructions */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Testing Steps:</strong>
                <br />1. Try to sign in with the provided credentials
                <br />2. Check if profile data loads correctly
                <br />3. Verify that products and liked products are fetched
                <br />4. Check browser console for detailed logs
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
