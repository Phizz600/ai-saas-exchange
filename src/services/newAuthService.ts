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

export class NewAuthService {
  // Sign up with email and password
  static async signUp(data: SignupData) {
    try {
      console.log('NewAuthService: Starting signup for:', data.email);
      
      // Step 1: Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
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

      if (profileError) {
        console.error('NewAuthService: Profile creation error:', profileError);
        // Continue anyway - profile can be created later
      } else {
        console.log('NewAuthService: Profile created successfully');
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
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        console.error('NewAuthService: Google signin error:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error: any) {
      console.error('NewAuthService: Google signin failed:', error);
      throw new Error(error.message || 'Google signin failed');
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