import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

export type UserType = 'ai_builder' | 'ai_investor';

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: UserType;
  subscribeNewsletter?: boolean;
}

export interface SigninData {
  email: string;
  password: string;
}

export class NewAuthService {
  // Sign up with email and password
  static async signUp(data: SignupData) {
    try {
      console.log('NewAuthService: Starting signup for:', data.email);
      
      const redirectUrl = `${window.location.origin}/auth`;
      console.log('NewAuthService: Using redirect URL:', redirectUrl);
      
      // Step 1: Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl,
        }
      });

      if (authError) {
        console.error('NewAuthService: Auth signup error:', authError);
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('No user returned from signup');
      }

      console.log('NewAuthService: Auth user created successfully:', authData.user.id);

      // Step 2: Create profile manually (no triggers)
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          first_name: data.firstName,
          last_name: data.lastName,
          user_type: data.userType,
          liked_products: [],
          saved_products: []
        });

      // Step 3: Handle newsletter subscription
      if (data.subscribeNewsletter) {
        try {
          const { error: emailPrefError } = await supabase
            .from('email_preferences')
            .insert({
              user_id: authData.user.id,
              newsletter: true,
              marketing_emails: true,
              transaction_notifications: true,
              product_updates: true
            });
          
          if (emailPrefError) {
            console.error('NewAuthService: Email preferences error:', emailPrefError);
          } else {
            console.log('NewAuthService: Newsletter subscription created');
          }
        } catch (emailError) {
          console.error('NewAuthService: Newsletter subscription failed:', emailError);
        }
      }

      if (profileError) {
        console.error('NewAuthService: Profile creation error:', profileError);
        // Continue anyway - profile can be created later
      } else {
        console.log('NewAuthService: Profile created successfully');
      }

      // Send welcome email if user is confirmed
      if (authData.session) {
        try {
          const { data: functions } = await supabase.functions.invoke('send-auth-email', {
            body: {
              email: data.email,
              firstName: data.firstName,
              userType: data.userType,
              type: 'welcome'
            }
          });
          console.log('NewAuthService: Welcome email sent:', functions);
        } catch (emailError) {
          console.error('NewAuthService: Welcome email failed:', emailError);
          // Don't block signup if email fails
        }
      } else {
        // Send confirmation email for unconfirmed users
        try {
          const { data: functions } = await supabase.functions.invoke('send-auth-email', {
            body: {
              email: data.email,
              firstName: data.firstName,
              type: 'signup',
              confirmationUrl: `${window.location.origin}/auth?type=signup`
            }
          });
          console.log('NewAuthService: Confirmation email sent:', functions);
        } catch (emailError) {
          console.error('NewAuthService: Confirmation email failed:', emailError);
          // Don't block signup if email fails
        }
      }

      return {
        user: authData.user,
        session: authData.session,
        needsEmailVerification: !authData.session
      };

    } catch (error: any) {
      console.error('NewAuthService: Signup failed:', error);
      throw new Error(error.message || 'Signup failed');
    }
  }

  // Sign in with email and password
  static async signIn(data: SigninData) {
    try {
      console.log('NewAuthService: Starting signin for:', data.email);
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (authError) {
        console.error('NewAuthService: Signin error:', authError);
        throw new Error(authError.message);
      }

      console.log('NewAuthService: Signin successful');
      return {
        user: authData.user,
        session: authData.session
      };

    } catch (error: any) {
      console.error('NewAuthService: Signin failed:', error);
      throw new Error(error.message || 'Signin failed');
    }
  }

  // Sign in with Google
  static async signInWithGoogle() {
    try {
      console.log('NewAuthService: Starting Google signin');
      
      const redirectUrl = `${window.location.origin}/auth`;
      console.log('NewAuthService: Using redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('NewAuthService: Google signin error:', error);
        throw new Error(error.message);
      }

      console.log('NewAuthService: Google signin initiated successfully');
      return data;
    } catch (error: any) {
      console.error('NewAuthService: Google signin failed:', error);
      throw new Error(error.message || 'Google signin failed');
    }
  }

  // Sign in with LinkedIn
  static async signInWithLinkedIn() {
    try {
      console.log('NewAuthService: Starting LinkedIn signin');
      
      const redirectUrl = `${window.location.origin}/auth`;
      console.log('NewAuthService: Using redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        console.error('NewAuthService: LinkedIn signin error:', error);
        throw new Error(error.message);
      }

      console.log('NewAuthService: LinkedIn signin initiated successfully');
      return data;
    } catch (error: any) {
      console.error('NewAuthService: LinkedIn signin failed:', error);
      throw new Error(error.message || 'LinkedIn signin failed');
    }
  }

  // Sign out
  static async signOut() {
    try {
      console.log('NewAuthService: Signing out');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('NewAuthService: Signout error:', error);
        throw new Error(error.message);
      }

      console.log('NewAuthService: Signout successful');
    } catch (error: any) {
      console.error('NewAuthService: Signout failed:', error);
      throw new Error(error.message || 'Signout failed');
    }
  }

  // Get current session
  static async getCurrentSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('NewAuthService: Get session error:', error);
        return null;
      }

      return data.session;
    } catch (error) {
      console.error('NewAuthService: Get session failed:', error);
      return null;
    }
  }

  // Get user profile
  static async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('NewAuthService: Get profile error:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('NewAuthService: Get profile failed:', error);
      return null;
    }
  }
}