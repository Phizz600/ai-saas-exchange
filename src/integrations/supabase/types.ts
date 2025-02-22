export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_activity_log: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          details: Json | null
          id: string
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          details?: Json | null
          id?: string
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          details?: Json | null
          id?: string
        }
        Relationships: []
      }
      admin_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      bids: {
        Row: {
          amount: number
          bidder_id: string
          created_at: string
          id: string
          product_id: string
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          bidder_id: string
          created_at?: string
          id?: string
          product_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          bidder_id?: string
          created_at?: string
          id?: string
          product_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bids_bidder_id_fkey"
            columns: ["bidder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bids_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "matched_products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "bids_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_product_views: {
        Row: {
          action: string
          id: string
          product_id: string
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          action: string
          id?: string
          product_id: string
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          action?: string
          id?: string
          product_id?: string
          user_id?: string
          viewed_at?: string | null
        }
        Relationships: []
      }
      draft_products: {
        Row: {
          created_at: string
          form_data: Json
          form_section: number
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          form_data: Json
          form_section?: number
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          form_data?: Json
          form_section?: number
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      investor_preferences: {
        Row: {
          business_model: string[] | null
          created_at: string
          current_question: number | null
          id: string
          investment_goals: string[] | null
          investment_stage:
            | Database["public"]["Enums"]["investment_preference"][]
            | null
          investment_timeline: string | null
          llm_preferences: string[] | null
          max_investment: number | null
          min_investment: number | null
          monetization_preferences: string[] | null
          preferred_categories: string[] | null
          preferred_industries: string[] | null
          required_integrations: string[] | null
          risk_appetite:
            | Database["public"]["Enums"]["investment_preference"][]
            | null
          target_market:
            | Database["public"]["Enums"]["investment_preference"][]
            | null
          technical_expertise: string | null
          traffic_importance: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          business_model?: string[] | null
          created_at?: string
          current_question?: number | null
          id?: string
          investment_goals?: string[] | null
          investment_stage?:
            | Database["public"]["Enums"]["investment_preference"][]
            | null
          investment_timeline?: string | null
          llm_preferences?: string[] | null
          max_investment?: number | null
          min_investment?: number | null
          monetization_preferences?: string[] | null
          preferred_categories?: string[] | null
          preferred_industries?: string[] | null
          required_integrations?: string[] | null
          risk_appetite?:
            | Database["public"]["Enums"]["investment_preference"][]
            | null
          target_market?:
            | Database["public"]["Enums"]["investment_preference"][]
            | null
          technical_expertise?: string | null
          traffic_importance?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          business_model?: string[] | null
          created_at?: string
          current_question?: number | null
          id?: string
          investment_goals?: string[] | null
          investment_stage?:
            | Database["public"]["Enums"]["investment_preference"][]
            | null
          investment_timeline?: string | null
          llm_preferences?: string[] | null
          max_investment?: number | null
          min_investment?: number | null
          monetization_preferences?: string[] | null
          preferred_categories?: string[] | null
          preferred_industries?: string[] | null
          required_integrations?: string[] | null
          risk_appetite?:
            | Database["public"]["Enums"]["investment_preference"][]
            | null
          target_market?:
            | Database["public"]["Enums"]["investment_preference"][]
            | null
          technical_expertise?: string | null
          traffic_importance?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investor_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_actions: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          id: string
          product_id: string
          reason: string | null
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          id?: string
          product_id: string
          reason?: string | null
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          id?: string
          product_id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_admin"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moderation_actions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "matched_products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "moderation_actions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean | null
          related_bid_id: string | null
          related_product_id: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          related_bid_id?: string | null
          related_product_id?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          related_bid_id?: string | null
          related_product_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_bid_id_fkey"
            columns: ["related_bid_id"]
            isOneToOne: false
            referencedRelation: "bids"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_product_id_fkey"
            columns: ["related_product_id"]
            isOneToOne: false
            referencedRelation: "matched_products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "notifications_related_product_id_fkey"
            columns: ["related_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          amount: number
          bidder_id: string
          created_at: string
          id: string
          message: string | null
          product_id: string
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          bidder_id: string
          created_at?: string
          id?: string
          message?: string | null
          product_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          bidder_id?: string
          created_at?: string
          id?: string
          message?: string | null
          product_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_bidder_id_fkey"
            columns: ["bidder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "matched_products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "offers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      price_history: {
        Row: {
          created_at: string
          id: string
          price: number
          product_id: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          price: number
          product_id: string
          type?: string
        }
        Update: {
          created_at?: string
          id?: string
          price?: number
          product_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "matched_products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "price_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_analytics: {
        Row: {
          bids: number | null
          clicks: number | null
          created_at: string
          date: string
          id: string
          likes: number | null
          product_id: string
          saves: number | null
          updated_at: string
          views: number | null
        }
        Insert: {
          bids?: number | null
          clicks?: number | null
          created_at?: string
          date?: string
          id?: string
          likes?: number | null
          product_id: string
          saves?: number | null
          updated_at?: string
          views?: number | null
        }
        Update: {
          bids?: number | null
          clicks?: number | null
          created_at?: string
          date?: string
          id?: string
          likes?: number | null
          product_id?: string
          saves?: number | null
          updated_at?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_analytics_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "matched_products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_analytics_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active_users: string | null
          admin_feedback: string | null
          auction_end_time: string | null
          auction_status: string | null
          business_location: string | null
          business_model: string | null
          category: string
          competitors: string | null
          created_at: string
          current_price: number | null
          customer_acquisition_cost: number | null
          demo_url: string | null
          description: string | null
          gross_profit_margin: number | null
          has_patents: boolean | null
          highest_bid: number | null
          highest_bidder_id: string | null
          id: string
          image_url: string | null
          industry: string | null
          integrations: string[] | null
          integrations_other: string | null
          investment_timeline: string | null
          is_code_audited: boolean | null
          is_revenue_verified: boolean | null
          is_traffic_verified: boolean | null
          is_verified: boolean | null
          llm_type: string | null
          llm_type_other: string | null
          min_price: number | null
          monetization: string | null
          monetization_other: string | null
          monthly_churn_rate: number | null
          monthly_profit: number | null
          monthly_revenue: number | null
          monthly_traffic: number | null
          number_of_employees: string | null
          price: number
          price_decrement: number | null
          price_decrement_interval: string | null
          product_age: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          seller_id: string
          special_notes: string | null
          stage: string
          starting_price: number | null
          status: string | null
          team_size: string | null
          tech_stack: string[]
          tech_stack_other: string | null
          title: string
          updated_at: string
        }
        Insert: {
          active_users?: string | null
          admin_feedback?: string | null
          auction_end_time?: string | null
          auction_status?: string | null
          business_location?: string | null
          business_model?: string | null
          category: string
          competitors?: string | null
          created_at?: string
          current_price?: number | null
          customer_acquisition_cost?: number | null
          demo_url?: string | null
          description?: string | null
          gross_profit_margin?: number | null
          has_patents?: boolean | null
          highest_bid?: number | null
          highest_bidder_id?: string | null
          id?: string
          image_url?: string | null
          industry?: string | null
          integrations?: string[] | null
          integrations_other?: string | null
          investment_timeline?: string | null
          is_code_audited?: boolean | null
          is_revenue_verified?: boolean | null
          is_traffic_verified?: boolean | null
          is_verified?: boolean | null
          llm_type?: string | null
          llm_type_other?: string | null
          min_price?: number | null
          monetization?: string | null
          monetization_other?: string | null
          monthly_churn_rate?: number | null
          monthly_profit?: number | null
          monthly_revenue?: number | null
          monthly_traffic?: number | null
          number_of_employees?: string | null
          price: number
          price_decrement?: number | null
          price_decrement_interval?: string | null
          product_age?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          seller_id: string
          special_notes?: string | null
          stage: string
          starting_price?: number | null
          status?: string | null
          team_size?: string | null
          tech_stack?: string[]
          tech_stack_other?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          active_users?: string | null
          admin_feedback?: string | null
          auction_end_time?: string | null
          auction_status?: string | null
          business_location?: string | null
          business_model?: string | null
          category?: string
          competitors?: string | null
          created_at?: string
          current_price?: number | null
          customer_acquisition_cost?: number | null
          demo_url?: string | null
          description?: string | null
          gross_profit_margin?: number | null
          has_patents?: boolean | null
          highest_bid?: number | null
          highest_bidder_id?: string | null
          id?: string
          image_url?: string | null
          industry?: string | null
          integrations?: string[] | null
          integrations_other?: string | null
          investment_timeline?: string | null
          is_code_audited?: boolean | null
          is_revenue_verified?: boolean | null
          is_traffic_verified?: boolean | null
          is_verified?: boolean | null
          llm_type?: string | null
          llm_type_other?: string | null
          min_price?: number | null
          monetization?: string | null
          monetization_other?: string | null
          monthly_churn_rate?: number | null
          monthly_profit?: number | null
          monthly_revenue?: number | null
          monthly_traffic?: number | null
          number_of_employees?: string | null
          price?: number
          price_decrement?: number | null
          price_decrement_interval?: string | null
          product_age?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          seller_id?: string
          special_notes?: string | null
          stage?: string
          starting_price?: number | null
          status?: string | null
          team_size?: string | null
          tech_stack?: string[]
          tech_stack_other?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          first_name: string | null
          full_name: string | null
          id: string
          liked_products: string[] | null
          saved_products: string[] | null
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"] | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          first_name?: string | null
          full_name?: string | null
          id: string
          liked_products?: string[] | null
          saved_products?: string[] | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"] | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          first_name?: string | null
          full_name?: string | null
          id?: string
          liked_products?: string[] | null
          saved_products?: string[] | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"] | null
          username?: string | null
        }
        Relationships: []
      }
      promotions: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          product_id: string
          seller_id: string
          start_date: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          product_id: string
          seller_id: string
          start_date?: string
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          product_id?: string
          seller_id?: string
          start_date?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "promotions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "matched_products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "promotions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotions_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      matched_products: {
        Row: {
          category: string | null
          description: string | null
          image_url: string | null
          investor_id: string | null
          match_score: number | null
          price: number | null
          product_id: string | null
          stage: string | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "investor_preferences_user_id_fkey"
            columns: ["investor_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_match_score: {
        Args: {
          product_id: string
          investor_id: string
        }
        Returns: number
      }
      check_auctions_ending_soon: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      check_high_traffic: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      check_product_liked: {
        Args: {
          check_user_id: string
          check_product_id: string
        }
        Returns: boolean
      }
      get_daily_views_count: {
        Args: {
          user_uuid: string
        }
        Returns: number
      }
      has_role: {
        Args: {
          user_id: string
          requested_role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      increment_product_views: {
        Args: {
          input_product_id: string
        }
        Returns: undefined
      }
      is_high_traffic: {
        Args: {
          p_views: number
          p_clicks: number
          p_saves: number
        }
        Returns: boolean
      }
      is_valid_user_type: {
        Args: {
          user_type: string
        }
        Returns: boolean
      }
      truncate_to_date: {
        Args: {
          ts: string
        }
        Returns: string
      }
      update_dutch_auction_prices: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      investment_preference:
        | "early_stage"
        | "growth_stage"
        | "established"
        | "high_risk"
        | "moderate_risk"
        | "low_risk"
        | "b2b"
        | "b2c"
        | "enterprise"
        | "healthcare"
        | "fintech"
        | "ecommerce"
        | "autonomous_vehicles"
        | "nlp"
        | "computer_vision"
        | "other"
      monetization_type:
        | "subscription"
        | "pay_per_use"
        | "freemium"
        | "one_time_purchase"
        | "usage_based"
        | "tiered_pricing"
        | "enterprise_licensing"
        | "marketplace_commission"
        | "advertising"
        | "data_monetization"
      notification_type:
        | "sale"
        | "liked_product_sold"
        | "product_liked"
        | "product_viewed"
        | "product_offer"
        | "high_traffic"
        | "product_saved"
        | "auction_ending_soon"
        | "auction_ended"
        | "new_bid"
      user_type: "ai_builder" | "ai_investor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
