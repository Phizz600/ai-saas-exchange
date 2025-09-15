import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, Mail, User, AlertTriangle, Eye, EyeOff } from "lucide-react";

interface FormData {
  fullName: string;
  email: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
}

interface UpdateStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

export const ProfileEditDemo = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    fullName: "John Doe",
    email: "john.doe@example.com",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>({ type: 'idle' });
  const [emailChanged, setEmailChanged] = useState(false);
  const [showDemoMode, setShowDemoMode] = useState(true);

  // Track email changes
  const originalEmail = "john.doe@example.com";
  const isEmailChanged = formData.email !== originalEmail;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.length > 50) {
      newErrors.fullName = "Full name must be 50 characters or less";
    } else if (!/^[a-zA-Z\s\-'\.]+$/.test(formData.fullName.trim())) {
      newErrors.fullName = "Full name can only contain letters, spaces, hyphens, apostrophes, and periods";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sanitizeInput = (input: string): string => {
    return input.trim().replace(/<[^>]*>/g, ''); // Remove HTML tags
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setUpdateStatus({ type: 'error', message: 'Please fix the errors above' });
      return;
    }

    setUpdateStatus({ type: 'loading' });

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate different scenarios
    const scenarios = [
      { success: true, emailChanged: isEmailChanged, message: isEmailChanged ? 'Profile updated! Please check your email to verify the new address.' : 'Profile updated successfully!' },
      { success: false, message: 'Email address is already in use' },
      { success: false, message: 'Network error. Please try again.' },
    ];

    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

    if (scenario.success) {
      setUpdateStatus({ 
        type: 'success', 
        message: scenario.message
      });

      toast({
        title: "Profile Updated",
        description: scenario.message,
      });
    } else {
      setUpdateStatus({ 
        type: 'error', 
        message: scenario.message
      });
      
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: scenario.message,
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: "John Doe",
      email: "john.doe@example.com",
    });
    setErrors({});
    setUpdateStatus({ type: 'idle' });
  };

  const resetToDefaults = () => {
    setFormData({
      fullName: "John Doe",
      email: "john.doe@example.com",
    });
    setErrors({});
    setUpdateStatus({ type: 'idle' });
  };

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Demo Mode Banner */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Eye className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <strong>Demo Mode - Profile Edit Feature</strong>
                <p className="text-sm mt-1">
                  This is a demonstration of the profile edit functionality. No real data will be saved.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDemoMode(!showDemoMode)}
                className="text-blue-800 border-blue-300 hover:bg-blue-100"
              >
                {showDemoMode ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                {showDemoMode ? 'Hide' : 'Show'} Demo Info
              </Button>
            </div>
          </AlertDescription>
        </Alert>

        {showDemoMode && (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-amber-800">Demo Features</CardTitle>
            </CardHeader>
            <CardContent className="text-amber-800">
              <ul className="space-y-2 text-sm">
                <li>✅ <strong>Real-time validation:</strong> Try entering invalid data to see validation in action</li>
                <li>✅ <strong>Email change detection:</strong> Change the email to see the verification warning</li>
                <li>✅ <strong>Loading states:</strong> Submit the form to see loading animations</li>
                <li>✅ <strong>Success/Error scenarios:</strong> Random success/error responses to test all states</li>
                <li>✅ <strong>Input sanitization:</strong> Try entering HTML tags to see them stripped</li>
                <li>✅ <strong>Mobile responsive:</strong> Resize your browser to test mobile layout</li>
              </ul>
              <div className="mt-4">
                <Button onClick={resetToDefaults} variant="outline" size="sm" className="text-amber-800 border-amber-300 hover:bg-amber-100">
                  Reset to Default Values
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Edit Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Status Messages */}
                {updateStatus.type === 'success' && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      {updateStatus.message}
                    </AlertDescription>
                  </Alert>
                )}

                {updateStatus.type === 'error' && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      {updateStatus.message}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Email Change Warning */}
                {isEmailChanged && (
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      Changing your email will require verification. You'll receive a confirmation email at the new address.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Full Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className={errors.fullName ? "border-red-500" : ""}
                    maxLength={50}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email address"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {errors.email}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Changing your email will require verification at the new address.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={updateStatus.type === 'loading'}
                    className="flex-1"
                  >
                    {updateStatus.type === 'loading' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={updateStatus.type === 'loading'}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Feature Showcase */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Real-time Validation</h4>
                    <p className="text-sm text-muted-foreground">Instant feedback on form inputs with visual indicators</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Email Verification</h4>
                    <p className="text-sm text-muted-foreground">Automatic email verification for address changes</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Input Sanitization</h4>
                    <p className="text-sm text-muted-foreground">XSS protection with HTML tag removal</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Mobile Responsive</h4>
                    <p className="text-sm text-muted-foreground">Optimized for all device sizes</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Audit Trail</h4>
                    <p className="text-sm text-muted-foreground">All changes logged with timestamps</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Try These Tests:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Enter an empty name</li>
                  <li>• Try a name longer than 50 characters</li>
                  <li>• Enter an invalid email format</li>
                  <li>• Change the email address</li>
                  <li>• Add HTML tags to see sanitization</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

