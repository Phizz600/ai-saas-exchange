import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  User, 
  Bell, 
  TrendingUp, 
  Shield, 
  MapPin, 
  Calendar, 
  Globe2, 
  AlertCircle,
  Package,
  Heart,
  CheckCircle,
  Mail,
  Lock,
  Pencil,
  Save,
  X,
  AtSign,
  Info,
  Megaphone,
  ShoppingCart,
  ExternalLink,
  Plus,
  Trash2,
  AlertTriangle
} from "lucide-react";

export const ProfileDesignPreview = () => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    username: "johndoe",
    userType: "ai_builder" as "ai_builder" | "ai_investor",
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Promotional Banner */}
      <div className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] py-2 overflow-hidden">
        <div className="whitespace-nowrap overflow-hidden">
          <div className="inline-block">
            {[...Array(3)].map((_, i) => (
              <span key={i} className="inline-flex items-center text-white font-semibold px-4">
                📢 Selling your AI SaaS? Get a free valuation + listing — 
                <a href="https://aiexchange.club/ai-saas-quiz" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline ml-1">
                  Start Here
                </a>
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Navbar Placeholder */}
      <div className="h-16 bg-white border-b flex items-center justify-center">
        <span className="text-gray-600">Navbar Component (existing)</span>
      </div>

      <div className="container mx-auto px-3 py-8 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="md:col-span-4">
            <Card className="sticky top-8">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  {/* Avatar with upload functionality */}
                  <div className="relative group mb-4">
                    <div className="w-20 h-20 bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      JD
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
                          📷
                        </Button>
                        <Button variant="destructive" size="sm" className="bg-white/90 hover:bg-white">
                          ✕
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-semibold mb-1 mt-4 font-exo">
                    John Doe
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">@johndoe</p>
                  
                  <div className="w-full space-y-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>United States</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Member since Jan 15, 2024</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Globe2 className="w-4 h-4 mr-2" />
                      <span>English</span>
                    </div>
                  </div>

                  {/* Verification Badges */}
                  <div className="flex gap-2 mt-4">
                    <Badge variant="secondary" className="text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>

                  <div className="w-full mt-4 space-y-3">
                    <div className="flex items-center justify-center text-sm text-muted-foreground cursor-help">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      <span>Communication Policy</span>
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full"
                    >
                      Dashboard
                    </Button>
                    <Button 
                      className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white"
                    >
                      Create New Listing
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-8 space-y-6">
            {/* Profile Completion */}
            <Card className="animate-fade-in bg-gradient-to-r from-[#D946EE]/5 via-[#8B5CF6]/5 to-[#0EA4E9]/5">
              <CardHeader>
                <CardTitle className="text-lg font-exo flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#D946EE]" />
                  Profile Completion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Progress 
                      value={80} 
                      className="h-3 bg-gray-200"
                    />
                    <div 
                      className="absolute top-0 left-0 h-3 bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] rounded-full transition-all duration-500 ease-out"
                      style={{ width: "80%" }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">80% Complete</span>
                    <span className="text-xs text-muted-foreground">20% to go</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Complete your profile to increase visibility and trust with potential buyers.
                    <span className="block mt-2 text-xs">
                      Tip: Add more details to your profile to improve your chances of successful transactions.
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Bio Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-exo flex justify-between items-center">
                  <span>About Me</span>
                  <span className="text-sm text-muted-foreground">
                    45/500
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    AI developer with 5+ years of experience building machine learning solutions. 
                    Passionate about creating innovative products that solve real-world problems.
                  </p>
                  <Button variant="outline" size="sm">
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Bio
                  </Button>
                </div>
                <Progress value={9} className="h-1" />
              </CardContent>
            </Card>

            {/* Main Tabs */}
            <Tabs defaultValue="activity" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="activity" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden sm:inline">Activity</span>
                </TabsTrigger>
                <TabsTrigger value="account" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Account</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Security</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="activity" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Activity Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="listings">Listings</TabsTrigger>
                        <TabsTrigger value="likes">Likes</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 border rounded-lg">
                            <Package className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                            <div className="text-2xl font-bold">3</div>
                            <div className="text-sm text-muted-foreground">Total Listings</div>
                          </div>
                          <div className="text-center p-4 border rounded-lg">
                            <Heart className="h-8 w-8 mx-auto mb-2 text-red-600" />
                            <div className="text-2xl font-bold">12</div>
                            <div className="text-sm text-muted-foreground">Liked Products</div>
                          </div>
                          <div className="text-center p-4 border rounded-lg">
                            <Calendar className="h-8 w-8 mx-auto mb-2 text-green-600" />
                            <div className="text-sm font-medium">Jan 20, 2024</div>
                            <div className="text-sm text-muted-foreground">Last Updated</div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="listings" className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium">AI Chatbot Builder</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="default">active</Badge>
                                <span className="text-sm text-muted-foreground">$299</span>
                                <span className="text-sm text-muted-foreground">• Updated Jan 20</span>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="likes" className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium">Machine Learning API</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-muted-foreground">$199</span>
                                <span className="text-sm text-muted-foreground">• Liked Jan 18</span>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="account" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Account Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name
                      </Label>
                      <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                        <span className="text-sm">John Doe</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username" className="flex items-center gap-2">
                        <AtSign className="h-4 w-4" />
                        Username
                      </Label>
                      <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                        <span className="text-sm">@johndoe</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Account Type
                      </Label>
                    <div className="flex items-center justify-between p-4 border-2 border-[#D946EE] rounded-lg bg-gradient-to-r from-[#D946EE]/5 to-[#8B5CF6]/5">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">AI Builder</span>
                        <Badge className="bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] text-white border-0">Creator</Badge>
                      </div>
                    </div>
                    </div>

                    <Separator />

                    <div className="flex gap-3">
                      <Button className="flex-1">
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="newsletter" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Newsletter
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Weekly updates about new features and platform improvements
                        </p>
                      </div>
                      <Switch id="newsletter" defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="product_updates" className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Product Updates
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Notifications about updates to products you've purchased
                        </p>
                      </div>
                      <Switch id="product_updates" defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="transactions" className="flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4" />
                          Transaction Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Important updates about your purchases and sales
                        </p>
                      </div>
                      <Switch id="transactions" defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="marketing" className="flex items-center gap-2">
                          <Megaphone className="h-4 w-4" />
                          Marketing Emails
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Promotional offers and featured products
                        </p>
                      </div>
                      <Switch id="marketing" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Privacy & Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span className="font-medium">Email Address</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                        <span className="text-sm">john.doe@example.com</span>
                        <Button variant="outline" size="sm">
                          Change Email
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        <span className="font-medium">Password</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                        <span className="text-sm">••••••••</span>
                        <Button variant="outline" size="sm">
                          Change Password
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Security Features
                      </h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Two-factor authentication available</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Secure password requirements</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Email verification required</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-medium text-red-600 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Danger Zone
                      </h4>
                      
                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                          <div className="space-y-2">
                            <p className="font-medium">Delete Account</p>
                            <p className="text-sm">
                              Permanently delete your account and all associated data.
                            </p>
                            <Button variant="destructive" size="sm" className="mt-2">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Account
                            </Button>
                          </div>
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
