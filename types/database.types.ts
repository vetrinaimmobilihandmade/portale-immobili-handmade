export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          role: 'admin' | 'editor' | 'inserzionista' | 'viewer';
          avatar_url: string | null;
          bio: string | null;
          is_active: boolean;
          email_verified: boolean;
          accept_agency_contact: boolean; // 🆕 AGGIUNTO
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          role?: 'admin' | 'editor' | 'inserzionista' | 'viewer';
          avatar_url?: string | null;
          bio?: string | null;
          is_active?: boolean;
          email_verified?: boolean;
          accept_agency_contact?: boolean; // 🆕 AGGIUNTO
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          role?: 'admin' | 'editor' | 'inserzionista' | 'viewer';
          avatar_url?: string | null;
          bio?: string | null;
          is_active?: boolean;
          email_verified?: boolean;
          accept_agency_contact?: boolean; // 🆕 AGGIUNTO
          created_at?: string;
          updated_at?: string;
        };
      };
      regions: {
        Row: {
          id: number;
          code: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          code: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          code?: string;
          name?: string;
          created_at?: string;
        };
      };
      provinces: {
        Row: {
          id: number;
          code: string;
          name: string;
          region_id: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          code: string;
          name: string;
          region_id: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          code?: string;
          name?: string;
          region_id?: number;
          created_at?: string;
        };
      };
      properties: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          property_type: 'vendita' | 'affitto' | 'affitto_breve';
          property_category: 'appartamento' | 'villa' | 'terreno' | 'ufficio' | 'negozio' | 'garage' | 'altro';
          region_id: number | null;
          province_id: number | null;
          municipality_name: string | null;
          address: string | null;
          latitude: number | null;
          longitude: number | null;
          surface_mq: number | null;
          rooms: number | null;
          bedrooms: number | null;
          bathrooms: number | null;
          floor: number | null;
          total_floors: number | null;
          year_built: number | null;
          energy_class: string | null;
          features: Json;
          contact_name: string | null;
          contact_phone: string | null;
          contact_email: string | null;
          cover_image_url: string | null;
          status: 'pending' | 'approved' | 'rejected' | 'archived';
          rejected_reason: string | null;
          approved_at: string | null;
          approved_by: string | null;
          views_count: number;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          property_type: 'vendita' | 'affitto' | 'affitto_breve';
          property_category: 'appartamento' | 'villa' | 'terreno' | 'ufficio' | 'negozio' | 'garage' | 'altro';
          region_id?: number | null;
          province_id?: number | null;
          municipality_name?: string | null;
          address?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          surface_mq?: number | null;
          rooms?: number | null;
          bedrooms?: number | null;
          bathrooms?: number | null;
          floor?: number | null;
          total_floors?: number | null;
          year_built?: number | null;
          energy_class?: string | null;
          features?: Json;
          contact_name?: string | null;
          contact_phone?: string | null;
          contact_email?: string | null;
          cover_image_url?: string | null;
          status?: 'pending' | 'approved' | 'rejected' | 'archived';
          rejected_reason?: string | null;
          approved_at?: string | null;
          approved_by?: string | null;
          views_count?: number;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          property_type?: 'vendita' | 'affitto' | 'affitto_breve';
          property_category?: 'appartamento' | 'villa' | 'terreno' | 'ufficio' | 'negozio' | 'garage' | 'altro';
          region_id?: number | null;
          province_id?: number | null;
          municipality_name?: string | null;
          address?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          surface_mq?: number | null;
          rooms?: number | null;
          bedrooms?: number | null;
          bathrooms?: number | null;
          floor?: number | null;
          total_floors?: number | null;
          year_built?: number | null;
          energy_class?: string | null;
          features?: Json;
          contact_name?: string | null;
          contact_phone?: string | null;
          contact_email?: string | null;
          cover_image_url?: string | null;
          status?: 'pending' | 'approved' | 'rejected' | 'archived';
          rejected_reason?: string | null;
          approved_at?: string | null;
          approved_by?: string | null;
          views_count?: number;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      property_images: {
        Row: {
          id: string;
          property_id: string;
          thumbnail_url: string;
          full_url: string;
          display_order: number;
          file_size: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          thumbnail_url: string;
          full_url: string;
          display_order?: number;
          file_size?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          thumbnail_url?: string;
          full_url?: string;
          display_order?: number;
          file_size?: number | null;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          user_id: string;
          category_id: string | null;
          title: string;
          description: string | null;
          materials: string | null;
          dimensions: string | null;
          weight_grams: number | null;
          production_time_days: number | null;
          is_customizable: boolean;
          customization_notes: string | null;
          region_id: number | null;
          province_id: number | null;
          municipality_name: string | null;
          contact_name: string | null;
          contact_phone: string | null;
          contact_email: string | null;
          cover_image_url: string | null;
          status: 'pending' | 'approved' | 'rejected' | 'archived';
          rejected_reason: string | null;
          approved_at: string | null;
          approved_by: string | null;
          views_count: number;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id?: string | null;
          title: string;
          description?: string | null;
          materials?: string | null;
          dimensions?: string | null;
          weight_grams?: number | null;
          production_time_days?: number | null;
          is_customizable?: boolean;
          customization_notes?: string | null;
          region_id?: number | null;
          province_id?: number | null;
          municipality_name?: string | null;
          contact_name?: string | null;
          contact_phone?: string | null;
          contact_email?: string | null;
          cover_image_url?: string | null;
          status?: 'pending' | 'approved' | 'rejected' | 'archived';
          rejected_reason?: string | null;
          approved_at?: string | null;
          approved_by?: string | null;
          views_count?: number;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string | null;
          title?: string;
          description?: string | null;
          materials?: string | null;
          dimensions?: string | null;
          weight_grams?: number | null;
          production_time_days?: number | null;
          is_customizable?: boolean;
          customization_notes?: string | null;
          region_id?: number | null;
          province_id?: number | null;
          municipality_name?: string | null;
          contact_name?: string | null;
          contact_phone?: string | null;
          contact_email?: string | null;
          cover_image_url?: string | null;
          status?: 'pending' | 'approved' | 'rejected' | 'archived';
          rejected_reason?: string | null;
          approved_at?: string | null;
          approved_by?: string | null;
          views_count?: number;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          thumbnail_url: string;
          full_url: string;
          display_order: number;
          file_size: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          thumbnail_url: string;
          full_url: string;
          display_order?: number;
          file_size?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          thumbnail_url?: string;
          full_url?: string;
          display_order?: number;
          file_size?: number | null;
          created_at?: string;
        };
      };
      product_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          parent_id: string | null;
          status: 'pending' | 'approved' | 'rejected' | 'archived';
          created_by: string | null;
          approved_by: string | null;
          approved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          parent_id?: string | null;
          status?: 'pending' | 'approved' | 'rejected' | 'archived';
          created_by?: string | null;
          approved_by?: string | null;
          approved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          parent_id?: string | null;
          status?: 'pending' | 'approved' | 'rejected' | 'archived';
          created_by?: string | null;
          approved_by?: string | null;
          approved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          user1_id: string;
          user2_id: string;
          property_id: string | null;
          product_id: string | null;
          last_message_at: string;
          is_archived: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user1_id: string;
          user2_id: string;
          property_id?: string | null;
          product_id?: string | null;
          last_message_at?: string;
          is_archived?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user1_id?: string;
          user2_id?: string;
          property_id?: string | null;
          product_id?: string | null;
          last_message_at?: string;
          is_archived?: boolean;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          is_read: boolean;
          read_at: string | null;
          created_at: string;
          expires_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          is_read?: boolean;
          read_at?: string | null;
          created_at?: string;
          expires_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_id?: string;
          content?: string;
          is_read?: boolean;
          read_at?: string | null;
          created_at?: string;
          expires_at?: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          property_id: string | null;
          product_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          property_id?: string | null;
          product_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          property_id?: string | null;
          product_id?: string | null;
          created_at?: string;
        };
      };
      saved_searches: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          search_type: string;
          filters: Json;
          last_used_at: string;
          created_at: string;
          expires_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          search_type: string;
          filters: Json;
          last_used_at?: string;
          created_at?: string;
          expires_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          search_type?: string;
          filters?: Json;
          last_used_at?: string;
          created_at?: string;
          expires_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          content: string | null;
          link: string | null;
          is_read: boolean;
          read_at: string | null;
          created_at: string;
          expires_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          content?: string | null;
          link?: string | null;
          is_read?: boolean;
          read_at?: string | null;
          created_at?: string;
          expires_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          content?: string | null;
          link?: string | null;
          is_read?: boolean;
          read_at?: string | null;
          created_at?: string;
          expires_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
