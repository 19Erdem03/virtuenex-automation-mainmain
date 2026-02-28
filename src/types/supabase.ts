export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action_type: string
          description: string | null
          id: string
          timestamp: string
          user_id: string
        }
        Insert: {
          action_type: string
          description?: string | null
          id?: string
          timestamp?: string
          user_id: string
        }
        Update: {
          action_type?: string
          description?: string | null
          id?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      bookings: {
        Row: {
          cancellation_reason: string | null
          created_at: string
          id: string
          scheduled_for: string
          status: Database["public"]["Enums"]["booking_status"]
          tour_id: string
          user_id: string
        }
        Insert: {
          cancellation_reason?: string | null
          created_at?: string
          id?: string
          scheduled_for: string
          status?: Database["public"]["Enums"]["booking_status"]
          tour_id: string
          user_id: string
        }
        Update: {
          cancellation_reason?: string | null
          created_at?: string
          id?: string
          scheduled_for?: string
          status?: Database["public"]["Enums"]["booking_status"]
          tour_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      lead_captures: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          captured_at: string
          city: string | null
          client_id: string
          country: string | null
          county: string | null
          id: string
          interaction_logs: Json
          lead_contact: string
          lead_name: string
          phone_number: string | null
          phone_prefix: string | null
          post_code: string | null
          system_deployment_id: string | null
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          captured_at?: string
          city?: string | null
          client_id: string
          country?: string | null
          county?: string | null
          id?: string
          interaction_logs?: Json
          lead_contact: string
          lead_name: string
          phone_number?: string | null
          phone_prefix?: string | null
          post_code?: string | null
          system_deployment_id?: string | null
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          captured_at?: string
          city?: string | null
          client_id?: string
          country?: string | null
          county?: string | null
          id?: string
          interaction_logs?: Json
          lead_contact?: string
          lead_name?: string
          phone_number?: string | null
          phone_prefix?: string | null
          post_code?: string | null
          system_deployment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_captures_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_captures_system_deployment_id_fkey"
            columns: ["system_deployment_id"]
            isOneToOne: false
            referencedRelation: "system_deployments"
            referencedColumns: ["id"]
          }
        ]
      }
      payments: {
        Row: {
          amount_paid: number
          client_id: string
          created_at: string
          id: string
          payment_status: Database["public"]["Enums"]["payment_status"]
          transaction_hash: string
          verified_by: string | null
        }
        Insert: {
          amount_paid: number
          client_id: string
          created_at?: string
          id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          transaction_hash: string
          verified_by?: string | null
        }
        Update: {
          amount_paid?: number
          client_id?: string
          created_at?: string
          id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          transaction_hash?: string
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          last_login: string | null
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["user_status"]
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          last_login?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          last_login?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      properties: {
        Row: {
          client_id: string | null
          created_at: string
          id: string
          location: string
          price: number
          sqft: number | null
          status: Database["public"]["Enums"]["property_status"]
          title: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          id?: string
          location: string
          price: number
          sqft?: number | null
          status?: Database["public"]["Enums"]["property_status"]
          title: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          id?: string
          location?: string
          price?: number
          sqft?: number | null
          status?: Database["public"]["Enums"]["property_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      system_deployments: {
        Row: {
          client_id: string
          created_at: string
          end_date: string | null
          id: string
          metrics: Json
          start_date: string
          status: Database["public"]["Enums"]["deployment_status"]
          system_type_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          end_date?: string | null
          id?: string
          metrics?: Json
          start_date?: string
          status?: Database["public"]["Enums"]["deployment_status"]
          system_type_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          end_date?: string | null
          id?: string
          metrics?: Json
          start_date?: string
          status?: Database["public"]["Enums"]["deployment_status"]
          system_type_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_deployments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_deployments_system_type_id_fkey"
            columns: ["system_type_id"]
            isOneToOne: false
            referencedRelation: "system_types"
            referencedColumns: ["id"]
          }
        ]
      }
      system_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      tour_availability: {
        Row: {
          end_time: string
          id: string
          is_ongoing: boolean
          rules: Json
          start_time: string
          tour_id: string
        }
        Insert: {
          end_time: string
          id?: string
          is_ongoing?: boolean
          rules?: Json
          start_time: string
          tour_id: string
        }
        Update: {
          end_time?: string
          id?: string
          is_ongoing?: boolean
          rules?: Json
          start_time?: string
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_availability_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          }
        ]
      }
      tours: {
        Row: {
          created_at: string
          duration_minutes: number
          id: string
          max_slots: number
          property_id: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number
          id?: string
          max_slots?: number
          property_id: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number
          id?: string
          max_slots?: number
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tours_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      booking_status: "Scheduled" | "Rescheduled" | "Cancelled" | "Completed"
      deployment_status: "Planning" | "Building" | "Active" | "Paused"
      payment_status: "Pending" | "Verified" | "Rejected"
      property_status: "Active" | "Pending" | "Sold"
      user_role: "Lead" | "Client" | "Admin"
      user_status: "Active" | "Banned" | "Rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

