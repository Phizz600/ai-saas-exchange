import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

export type UserType = 'ai_builder' | 'ai_investor';

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: UserType;
}

export interface SigninData {
  email: string;
  password: string;
}

export class AuthService {
  // Sign up with email and password
  static async signUp(data: SignupData) {
    try {
      console.log('AuthService: Starting signup for:', data.email);
      
      // Step 1: Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            user_type: data.userType
          }
        }
      });

      if (authError) {
        console.error('AuthService: Auth signup error:', authError);
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('No user returned from signup');
      }

      console.log('AuthService: Auth user created:', authData.user.id);

      // Step 2: Create profile directly (don't rely on triggers)
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

      if (profileError) {
        console.error('AuthService: Profile creation error:', profileError);
        // If profile creation fails, we should still continue since auth user exists
        console.log('AuthService: Continuing despite profile error - will retry later');
      } else {
        console.log('AuthService: Profile created successfully');
      }

      // Step 3: Create investor preferences if needed
      if (data.userType === 'ai_investor') {
        const { error: prefsError } = await supabase
          .from('investor_preferences')
          .insert({
            user_id: authData.user.id,
            current_question: 0,
            preferred_categories: [],
            preferred_industries: [],
            required_integrations: [],
            risk_appetite: [],
            target_market: [],
            investment_stage: [],
            business_model: []
          });

        if (prefsError) {
          console.error('AuthService: Investor preferences error:', prefsError);
        } else {
          console.log('AuthService: Investor preferences created');
        }
      }

      return {
        user: authData.user,
        session: authData.session,
        needsEmailVerification: !authData.session
      };

    } catch (error: any) {
      console.error('AuthService: Signup failed:', error);
      throw new Error(error.message || 'Signup failed');
    }
  }

  // Sign in with email and password
  static async signIn(data: SigninData) {
    try {
      console.log('AuthService: Starting signin for:', data.email);
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (authError) {
        console.error('AuthService: Signin error:', authError);
        throw new Error(authError.message);
      }

      console.log('AuthService: Signin successful');
      return {
        user: authData.user,
        session: authData.session
      };

    } catch (error: any) {
      console.error('AuthService: Signin failed:', error);
      throw new Error(error.message || 'Signin failed');
    }
  }

  // Sign in with Google
  static async signInWithGoogle() {
    try {
      console.log('AuthService: Starting Google signin');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('AuthService: Google signin error:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error: any) {
      console.error('AuthService: Google signin failed:', error);
      throw new Error(error.message || 'Google signin failed');
    }
  }

  // Sign out
  static async signOut() {
    try {
      console.log('AuthService: Signing out');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('AuthService: Signout error:', error);
        throw new Error(error.message);
      }

      console.log('AuthService: Signout successful');
    } catch (error: any) {
      console.error('AuthService: Signout failed:', error);
      throw new Error(error.message || 'Signout failed');
    }
  }

  // Get current session
  static async getCurrentSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('AuthService: Get session error:', error);
        return null;
      }

      return data.session;
    } catch (error) {
      console.error('AuthService: Get session failed:', error);
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
        console.error('AuthService: Get profile error:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('AuthService: Get profile failed:', error);
      return null;
    }
  }

  // Reset password
  static async resetPassword(email: string) {
    try {
      console.log('AuthService: Sending password reset for:', email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        console.error('AuthService: Password reset error:', error);
        throw new Error(error.message);
      }

      console.log('AuthService: Password reset email sent');
    } catch (error: any) {
      console.error('AuthService: Password reset failed:', error);
      throw new Error(error.message || 'Password reset failed');
    }
  }
}