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
      access_requests: {
        Row: {
          created_at: string
          documents: Json | null
          email: string
          id: string
          justification: string
          name: string
          organization_id: string | null
          requested_role: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          documents?: Json | null
          email: string
          id?: string
          justification: string
          name: string
          organization_id?: string | null
          requested_role: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          documents?: Json | null
          email?: string
          id?: string
          justification?: string
          name?: string
          organization_id?: string | null
          requested_role?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "access_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_email_queue: {
        Row: {
          content: string
          created_at: string | null
          data: Json | null
          email_type: string
          error_message: string | null
          id: string
          notification_id: string | null
          recipient_emails: string[]
          sent: boolean | null
          sent_at: string | null
          subject: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          data?: Json | null
          email_type: string
          error_message?: string | null
          id?: string
          notification_id?: string | null
          recipient_emails: string[]
          sent?: boolean | null
          sent_at?: string | null
          subject: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          data?: Json | null
          email_type?: string
          error_message?: string | null
          id?: string
          notification_id?: string | null
          recipient_emails?: string[]
          sent?: boolean | null
          sent_at?: string | null
          subject?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_email_queue_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "admin_notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      archival_fund_extensions: {
        Row: {
          created_at: string | null
          fund_id: string | null
          id: string
          quantity: string | null
          support_type: string | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          fund_id?: string | null
          id?: string
          quantity?: string | null
          support_type?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          fund_id?: string | null
          id?: string
          quantity?: string | null
          support_type?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "archival_fund_extensions_fund_id_fkey"
            columns: ["fund_id"]
            isOneToOne: false
            referencedRelation: "archival_funds"
            referencedColumns: ["id"]
          },
        ]
      }
      archival_funds: {
        Row: {
          access_restrictions: string | null
          code: string | null
          complementary_notes: string | null
          constitution_nature: string | null
          constitution_other: string | null
          created_at: string
          description: string | null
          description_date: string | null
          description_level: string | null
          description_responsible: string | null
          end_date: string | null
          evaluation_temporality: string | null
          extension_number: string | null
          extension_unit: string | null
          extensions: Json | null
          id: string
          last_update_date: string | null
          location: string | null
          name: string
          observations: string | null
          organization: string | null
          organization_id: string
          origin_trajectory: string | null
          predominant_languages: string | null
          producer_name: string | null
          related_authority_ids: Json | null
          related_fund_ids: Json | null
          related_funds: string | null
          research_instruments: Json | null
          research_instruments_description: string | null
          scope_content: string | null
          start_date: string | null
          status: string
          support_type: string | null
          total_boxes: number | null
          total_documents: number | null
          updated_at: string
          used_standards: string | null
        }
        Insert: {
          access_restrictions?: string | null
          code?: string | null
          complementary_notes?: string | null
          constitution_nature?: string | null
          constitution_other?: string | null
          created_at?: string
          description?: string | null
          description_date?: string | null
          description_level?: string | null
          description_responsible?: string | null
          end_date?: string | null
          evaluation_temporality?: string | null
          extension_number?: string | null
          extension_unit?: string | null
          extensions?: Json | null
          id?: string
          last_update_date?: string | null
          location?: string | null
          name: string
          observations?: string | null
          organization?: string | null
          organization_id: string
          origin_trajectory?: string | null
          predominant_languages?: string | null
          producer_name?: string | null
          related_authority_ids?: Json | null
          related_fund_ids?: Json | null
          related_funds?: string | null
          research_instruments?: Json | null
          research_instruments_description?: string | null
          scope_content?: string | null
          start_date?: string | null
          status?: string
          support_type?: string | null
          total_boxes?: number | null
          total_documents?: number | null
          updated_at?: string
          used_standards?: string | null
        }
        Update: {
          access_restrictions?: string | null
          code?: string | null
          complementary_notes?: string | null
          constitution_nature?: string | null
          constitution_other?: string | null
          created_at?: string
          description?: string | null
          description_date?: string | null
          description_level?: string | null
          description_responsible?: string | null
          end_date?: string | null
          evaluation_temporality?: string | null
          extension_number?: string | null
          extension_unit?: string | null
          extensions?: Json | null
          id?: string
          last_update_date?: string | null
          location?: string | null
          name?: string
          observations?: string | null
          organization?: string | null
          organization_id?: string
          origin_trajectory?: string | null
          predominant_languages?: string | null
          producer_name?: string | null
          related_authority_ids?: Json | null
          related_fund_ids?: Json | null
          related_funds?: string | null
          research_instruments?: Json | null
          research_instruments_description?: string | null
          scope_content?: string | null
          start_date?: string | null
          status?: string
          support_type?: string | null
          total_boxes?: number | null
          total_documents?: number | null
          updated_at?: string
          used_standards?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "archival_funds_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      archive_sectors: {
        Row: {
          created_at: string
          id: string
          location: string | null
          manager: string | null
          organization_id: string
          storage_capacity: string | null
          team_size: string | null
          updated_at: string
          working_hours: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          location?: string | null
          manager?: string | null
          organization_id: string
          storage_capacity?: string | null
          team_size?: string | null
          updated_at?: string
          working_hours?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          location?: string | null
          manager?: string | null
          organization_id?: string
          storage_capacity?: string | null
          team_size?: string | null
          updated_at?: string
          working_hours?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "archive_sectors_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_control: {
        Row: {
          created_at: string
          created_by: string | null
          date: string
          hours_expected: number | null
          hours_paid: number | null
          hours_worked: number | null
          id: string
          justification: string | null
          observations: string | null
          researcher_id: string
          shift: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          date: string
          hours_expected?: number | null
          hours_paid?: number | null
          hours_worked?: number | null
          id?: string
          justification?: string | null
          observations?: string | null
          researcher_id: string
          shift: string
          status: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          date?: string
          hours_expected?: number | null
          hours_paid?: number | null
          hours_worked?: number | null
          id?: string
          justification?: string | null
          observations?: string | null
          researcher_id?: string
          shift?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_control_researcher_id_fkey"
            columns: ["researcher_id"]
            isOneToOne: false
            referencedRelation: "researchers"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_records: {
        Row: {
          activities: string | null
          approved: boolean | null
          approved_at: string | null
          approved_by: string | null
          created_at: string
          date: string
          hours_worked: number
          id: string
          observations: string | null
          researcher_id: string | null
          updated_at: string
        }
        Insert: {
          activities?: string | null
          approved?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          date: string
          hours_worked: number
          id?: string
          observations?: string | null
          researcher_id?: string | null
          updated_at?: string
        }
        Update: {
          activities?: string | null
          approved?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          date?: string
          hours_worked?: number
          id?: string
          observations?: string | null
          researcher_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_researcher_id_fkey"
            columns: ["researcher_id"]
            isOneToOne: false
            referencedRelation: "researchers"
            referencedColumns: ["id"]
          },
        ]
      }
      authorities: {
        Row: {
          biography: string | null
          contact_info: Json | null
          created_at: string
          end_date: string | null
          fund_id: string | null
          id: string
          image_url: string | null
          name: string
          organization_id: string
          position: string | null
          start_date: string | null
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          biography?: string | null
          contact_info?: Json | null
          created_at?: string
          end_date?: string | null
          fund_id?: string | null
          id?: string
          image_url?: string | null
          name: string
          organization_id: string
          position?: string | null
          start_date?: string | null
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          biography?: string | null
          contact_info?: Json | null
          created_at?: string
          end_date?: string | null
          fund_id?: string | null
          id?: string
          image_url?: string | null
          name?: string
          organization_id?: string
          position?: string | null
          start_date?: string | null
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "authorities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      casas: {
        Row: {
          ativa: boolean
          cod_siorg: number | null
          criado_em: string
          data_criacao: string | null
          email_organizacao: string | null
          id: string
          id_vinculo: number
          localizacao: string | null
          logo_url: string | null
          nome_organizacao: string
          observacao: string | null
          setor_arquivo: string | null
          sigla: string | null
        }
        Insert: {
          ativa?: boolean
          cod_siorg?: number | null
          criado_em?: string
          data_criacao?: string | null
          email_organizacao?: string | null
          id?: string
          id_vinculo: number
          localizacao?: string | null
          logo_url?: string | null
          nome_organizacao: string
          observacao?: string | null
          setor_arquivo?: string | null
          sigla?: string | null
        }
        Update: {
          ativa?: boolean
          cod_siorg?: number | null
          criado_em?: string
          data_criacao?: string | null
          email_organizacao?: string | null
          id?: string
          id_vinculo?: number
          localizacao?: string | null
          logo_url?: string | null
          nome_organizacao?: string
          observacao?: string | null
          setor_arquivo?: string | null
          sigla?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizacoes_id_vinculo_fkey"
            columns: ["id_vinculo"]
            isOneToOne: false
            referencedRelation: "casas_vinculos"
            referencedColumns: ["id"]
          },
        ]
      }
      casas_vinculos: {
        Row: {
          id: number
          nome_vinculo: string | null
        }
        Insert: {
          id?: number
          nome_vinculo?: string | null
        }
        Update: {
          id?: number
          nome_vinculo?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          classification: Json | null
          content: string
          id: string
          session_id: string
          timestamp: string
          type: string
        }
        Insert: {
          classification?: Json | null
          content: string
          id?: string
          session_id: string
          timestamp?: string
          type: string
        }
        Update: {
          classification?: Json | null
          content?: string
          id?: string
          session_id?: string
          timestamp?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string
          id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      classification_items: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          description: string
          destination: string | null
          examples: Json | null
          id: string
          is_active: boolean | null
          keywords: Json | null
          temporality: string | null
          title: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          description: string
          destination?: string | null
          examples?: Json | null
          id?: string
          is_active?: boolean | null
          keywords?: Json | null
          temporality?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          description?: string
          destination?: string | null
          examples?: Json | null
          id?: string
          is_active?: boolean | null
          keywords?: Json | null
          temporality?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      community_posts: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          last_activity: string
          replies: number | null
          solved: boolean | null
          subcategory: string | null
          tags: string[] | null
          title: string
          type: string
          updated_at: string
          user_id: string
          views: number | null
          votes: number | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          id?: string
          last_activity?: string
          replies?: number | null
          solved?: boolean | null
          subcategory?: string | null
          tags?: string[] | null
          title: string
          type: string
          updated_at?: string
          user_id: string
          views?: number | null
          votes?: number | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          last_activity?: string
          replies?: number | null
          solved?: boolean | null
          subcategory?: string | null
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
          views?: number | null
          votes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_replies: {
        Row: {
          content: string
          created_at: string
          id: string
          is_solution: boolean | null
          post_id: string
          updated_at: string
          user_id: string
          votes: number | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_solution?: boolean | null
          post_id: string
          updated_at?: string
          user_id: string
          votes?: number | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_solution?: boolean | null
          post_id?: string
          updated_at?: string
          user_id?: string
          votes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "community_replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_replies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          name: string
          organ: string
          reputation: number | null
          role: string
          updated_at: string
          user_id: string
          verified: boolean | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name: string
          organ: string
          reputation?: number | null
          role: string
          updated_at?: string
          user_id: string
          verified?: boolean | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string
          organ?: string
          reputation?: number | null
          role?: string
          updated_at?: string
          user_id?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "community_user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_votes: {
        Row: {
          created_at: string
          id: string
          post_id: string | null
          reply_id: string | null
          user_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id?: string | null
          reply_id?: string | null
          user_id: string
          vote_type: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string | null
          reply_id?: string | null
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_votes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_votes_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "community_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_products: {
        Row: {
          created_at: string
          goal_id: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          goal_id?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          goal_id?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_products_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "project_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_responsibles: {
        Row: {
          created_at: string
          goal_id: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          goal_id?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          goal_id?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_responsibles_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "project_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      incident_reports: {
        Row: {
          closure_date: string | null
          corrective_actions: string | null
          created_at: string
          final_report: string | null
          future_recommendations: string | null
          id: string
          identified_causes: string | null
          incident_id: string
          status: string
          technical_responsible: string | null
          updated_at: string
        }
        Insert: {
          closure_date?: string | null
          corrective_actions?: string | null
          created_at?: string
          final_report?: string | null
          future_recommendations?: string | null
          id?: string
          identified_causes?: string | null
          incident_id: string
          status?: string
          technical_responsible?: string | null
          updated_at?: string
        }
        Update: {
          closure_date?: string | null
          corrective_actions?: string | null
          created_at?: string
          final_report?: string | null
          future_recommendations?: string | null
          id?: string
          identified_causes?: string | null
          incident_id?: string
          status?: string
          technical_responsible?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "incident_reports_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      incidents: {
        Row: {
          consequences: string | null
          created_at: string
          date: string
          description: string
          estimated_volume: string | null
          external_support: string | null
          id: string
          location: string | null
          measures_adopted: string | null
          organization_id: string
          responsible: string | null
          severity: string
          status: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          consequences?: string | null
          created_at?: string
          date: string
          description: string
          estimated_volume?: string | null
          external_support?: string | null
          id?: string
          location?: string | null
          measures_adopted?: string | null
          organization_id: string
          responsible?: string | null
          severity: string
          status?: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          consequences?: string | null
          created_at?: string
          date?: string
          description?: string
          estimated_volume?: string | null
          external_support?: string | null
          id?: string
          location?: string | null
          measures_adopted?: string | null
          organization_id?: string
          responsible?: string | null
          severity?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      knowledge_base_expansions: {
        Row: {
          approved: boolean | null
          approved_at: string | null
          approved_by: string | null
          code: string
          created_at: string | null
          created_by: string | null
          description: string | null
          destination: string | null
          examples: Json | null
          id: string
          keywords: Json | null
          temporality: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          approved?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          code: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          destination?: string | null
          examples?: Json | null
          id?: string
          keywords?: Json | null
          temporality?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          approved?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          code?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          destination?: string | null
          examples?: Json | null
          id?: string
          keywords?: Json | null
          temporality?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      mapeamento_usuarios: {
        Row: {
          email: string
          id_antigo: string | null
          id_novo: string | null
        }
        Insert: {
          email: string
          id_antigo?: string | null
          id_novo?: string | null
        }
        Update: {
          email?: string
          id_antigo?: string | null
          id_novo?: string | null
        }
        Relationships: []
      }
      maturity_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id: string
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      maturity_category_results: {
        Row: {
          answered_questions: number
          average_score: number
          category_id: string
          created_at: string
          deficiencies_comportamental: number | null
          deficiencies_ferramental: number | null
          deficiencies_tecnica: number | null
          evaluation_id: string
          id: string
          maturity_level: string | null
          recommendations: string[] | null
          total_questions: number
          updated_at: string
        }
        Insert: {
          answered_questions?: number
          average_score?: number
          category_id: string
          created_at?: string
          deficiencies_comportamental?: number | null
          deficiencies_ferramental?: number | null
          deficiencies_tecnica?: number | null
          evaluation_id: string
          id?: string
          maturity_level?: string | null
          recommendations?: string[] | null
          total_questions?: number
          updated_at?: string
        }
        Update: {
          answered_questions?: number
          average_score?: number
          category_id?: string
          created_at?: string
          deficiencies_comportamental?: number | null
          deficiencies_ferramental?: number | null
          deficiencies_tecnica?: number | null
          evaluation_id?: string
          id?: string
          maturity_level?: string | null
          recommendations?: string[] | null
          total_questions?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maturity_category_results_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "maturity_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maturity_category_results_evaluation_id_fkey"
            columns: ["evaluation_id"]
            isOneToOne: false
            referencedRelation: "maturity_evaluations"
            referencedColumns: ["id"]
          },
        ]
      }
      maturity_evaluation_responses: {
        Row: {
          answered_at: string
          created_at: string
          evaluation_id: string
          id: string
          notes: string | null
          question_id: string
          response_option_id: string
          updated_at: string
        }
        Insert: {
          answered_at?: string
          created_at?: string
          evaluation_id: string
          id?: string
          notes?: string | null
          question_id: string
          response_option_id: string
          updated_at?: string
        }
        Update: {
          answered_at?: string
          created_at?: string
          evaluation_id?: string
          id?: string
          notes?: string | null
          question_id?: string
          response_option_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maturity_evaluation_responses_evaluation_id_fkey"
            columns: ["evaluation_id"]
            isOneToOne: false
            referencedRelation: "maturity_evaluations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maturity_evaluation_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "maturity_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maturity_evaluation_responses_response_option_id_fkey"
            columns: ["response_option_id"]
            isOneToOne: false
            referencedRelation: "maturity_response_options"
            referencedColumns: ["id"]
          },
        ]
      }
      maturity_evaluations: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          id: string
          organization_id: string | null
          started_at: string
          status: string
          title: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          organization_id?: string | null
          started_at?: string
          status?: string
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          organization_id?: string | null
          started_at?: string
          status?: string
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maturity_evaluations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maturity_evaluations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      maturity_questions: {
        Row: {
          created_at: string
          deficiency_types: string[] | null
          id: string
          question: string
          sort_order: number | null
          subcategory_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deficiency_types?: string[] | null
          id: string
          question: string
          sort_order?: number | null
          subcategory_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deficiency_types?: string[] | null
          id?: string
          question?: string
          sort_order?: number | null
          subcategory_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_question_subcategory"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "maturity_subcategories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maturity_questions_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "maturity_subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      maturity_response_options: {
        Row: {
          created_at: string
          deficiency_type: string[] | null
          explanation: string | null
          feedback: string
          id: string
          label: string
          level: number
          question_id: string
          updated_at: string
          weight: number | null
        }
        Insert: {
          created_at?: string
          deficiency_type?: string[] | null
          explanation?: string | null
          feedback: string
          id?: string
          label: string
          level: number
          question_id: string
          updated_at?: string
          weight?: number | null
        }
        Update: {
          created_at?: string
          deficiency_type?: string[] | null
          explanation?: string | null
          feedback?: string
          id?: string
          label?: string
          level?: number
          question_id?: string
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_response_question"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "maturity_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maturity_response_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "maturity_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      maturity_subcategories: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          id: string
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          id: string
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          id?: string
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_subcategory_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "maturity_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maturity_subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "maturity_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      maturity_subcategory_results: {
        Row: {
          answered_questions: number
          average_score: number
          created_at: string
          deficiencies_comportamental: number | null
          deficiencies_ferramental: number | null
          deficiencies_tecnica: number | null
          evaluation_id: string
          id: string
          maturity_level: string | null
          subcategory_id: string
          total_questions: number
          updated_at: string
        }
        Insert: {
          answered_questions?: number
          average_score?: number
          created_at?: string
          deficiencies_comportamental?: number | null
          deficiencies_ferramental?: number | null
          deficiencies_tecnica?: number | null
          evaluation_id: string
          id?: string
          maturity_level?: string | null
          subcategory_id: string
          total_questions?: number
          updated_at?: string
        }
        Update: {
          answered_questions?: number
          average_score?: number
          created_at?: string
          deficiencies_comportamental?: number | null
          deficiencies_ferramental?: number | null
          deficiencies_tecnica?: number | null
          evaluation_id?: string
          id?: string
          maturity_level?: string | null
          subcategory_id?: string
          total_questions?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maturity_subcategory_results_evaluation_id_fkey"
            columns: ["evaluation_id"]
            isOneToOne: false
            referencedRelation: "maturity_evaluations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maturity_subcategory_results_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "maturity_subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_attendance_reports: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          attendance_rate: number | null
          created_at: string
          id: string
          month: number
          researcher_id: string
          status: string | null
          submitted_at: string | null
          total_absent_days: number | null
          total_hours_expected: number | null
          total_hours_worked: number | null
          total_partial_days: number | null
          total_present_days: number | null
          updated_at: string
          year: number
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          attendance_rate?: number | null
          created_at?: string
          id?: string
          month: number
          researcher_id: string
          status?: string | null
          submitted_at?: string | null
          total_absent_days?: number | null
          total_hours_expected?: number | null
          total_hours_worked?: number | null
          total_partial_days?: number | null
          total_present_days?: number | null
          updated_at?: string
          year: number
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          attendance_rate?: number | null
          created_at?: string
          id?: string
          month?: number
          researcher_id?: string
          status?: string | null
          submitted_at?: string | null
          total_absent_days?: number | null
          total_hours_expected?: number | null
          total_hours_worked?: number | null
          total_partial_days?: number | null
          total_present_days?: number | null
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      organization_sectors: {
        Row: {
          acronym: string | null
          area_type: string | null
          city: string | null
          code: string | null
          competence: string | null
          contact_email: string | null
          contact_info: Json | null
          contact_phone: string | null
          created_at: string
          description: string | null
          id: string
          location: string | null
          mission: string | null
          name: string
          organization_id: string
          parent_sector_id: string | null
          parent_siorg_code: string | null
          purpose: string | null
          responsible_id: string | null
          siorg_code: string | null
          state: string | null
          status: string
          updated_at: string
        }
        Insert: {
          acronym?: string | null
          area_type?: string | null
          city?: string | null
          code?: string | null
          competence?: string | null
          contact_email?: string | null
          contact_info?: Json | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          mission?: string | null
          name: string
          organization_id: string
          parent_sector_id?: string | null
          parent_siorg_code?: string | null
          purpose?: string | null
          responsible_id?: string | null
          siorg_code?: string | null
          state?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          acronym?: string | null
          area_type?: string | null
          city?: string | null
          code?: string | null
          competence?: string | null
          contact_email?: string | null
          contact_info?: Json | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          mission?: string | null
          name?: string
          organization_id?: string
          parent_sector_id?: string | null
          parent_siorg_code?: string | null
          purpose?: string | null
          responsible_id?: string | null
          siorg_code?: string | null
          state?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_sectors_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_sectors_parent_sector_id_fkey"
            columns: ["parent_sector_id"]
            isOneToOne: false
            referencedRelation: "organization_sectors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_sectors_responsible_id_fkey"
            columns: ["responsible_id"]
            isOneToOne: false
            referencedRelation: "organization_team"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_team: {
        Row: {
          created_at: string
          department: string | null
          email: string
          employment_type: string | null
          end_date: string | null
          formation_area: string | null
          id: string
          name: string
          organization_id: string
          permissions: Json | null
          phone: string | null
          position: string
          role: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          email: string
          employment_type?: string | null
          end_date?: string | null
          formation_area?: string | null
          id?: string
          name: string
          organization_id: string
          permissions?: Json | null
          phone?: string | null
          position: string
          role: string
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          email?: string
          employment_type?: string | null
          end_date?: string | null
          formation_area?: string | null
          id?: string
          name?: string
          organization_id?: string
          permissions?: Json | null
          phone?: string | null
          position?: string
          role?: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_team_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_unb_goal_deliverables: {
        Row: {
          completed: boolean | null
          completion_date: string | null
          created_at: string
          description: string | null
          goal_id: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          completed?: boolean | null
          completion_date?: string | null
          created_at?: string
          description?: string | null
          goal_id: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          completed?: boolean | null
          completion_date?: string | null
          created_at?: string
          description?: string | null
          goal_id?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_unb_goal_deliverables_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "organization_unb_project_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_unb_goal_physical_scope: {
        Row: {
          created_at: string
          current_quantity: number
          goal_id: string
          id: string
          indicator: string
          service_type: string
          target_quantity: number
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_quantity?: number
          goal_id: string
          id?: string
          indicator: string
          service_type: string
          target_quantity?: number
          unit: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_quantity?: number
          goal_id?: string
          id?: string
          indicator?: string
          service_type?: string
          target_quantity?: number
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_unb_goal_physical_scope_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "organization_unb_project_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_unb_goal_products: {
        Row: {
          created_at: string
          goal_id: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          goal_id: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          goal_id?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_unb_goal_products_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "organization_unb_project_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_unb_project_goals: {
        Row: {
          created_at: string
          description: string
          end_date: string | null
          id: string
          number: string
          progress: number | null
          progress_type: string | null
          project_id: string
          responsible: string | null
          start_date: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          end_date?: string | null
          id?: string
          number: string
          progress?: number | null
          progress_type?: string | null
          project_id: string
          responsible?: string | null
          start_date?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          end_date?: string | null
          id?: string
          number?: string
          progress?: number | null
          progress_type?: string | null
          project_id?: string
          responsible?: string | null
          start_date?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_unb_project_goals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "organization_unb_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_unb_project_responsibles: {
        Row: {
          created_at: string
          id: string
          name: string
          project_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          project_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_unb_project_responsibles_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "organization_unb_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_unb_projects: {
        Row: {
          boxes_to_describe: number | null
          boxes_to_digitalize: number | null
          created_at: string
          description: string | null
          documents_meters: number | null
          end_date: string | null
          external_link: string | null
          id: string
          instrument_number: string | null
          legal_instrument: string | null
          object: string | null
          organization_id: string
          progress: number | null
          project_type: string | null
          researchers_count: number | null
          start_date: string
          status: string
          title: string
          total_value: number | null
          updated_at: string
        }
        Insert: {
          boxes_to_describe?: number | null
          boxes_to_digitalize?: number | null
          created_at?: string
          description?: string | null
          documents_meters?: number | null
          end_date?: string | null
          external_link?: string | null
          id?: string
          instrument_number?: string | null
          legal_instrument?: string | null
          object?: string | null
          organization_id: string
          progress?: number | null
          project_type?: string | null
          researchers_count?: number | null
          start_date: string
          status?: string
          title: string
          total_value?: number | null
          updated_at?: string
        }
        Update: {
          boxes_to_describe?: number | null
          boxes_to_digitalize?: number | null
          created_at?: string
          description?: string | null
          documents_meters?: number | null
          end_date?: string | null
          external_link?: string | null
          id?: string
          instrument_number?: string | null
          legal_instrument?: string | null
          object?: string | null
          organization_id?: string
          progress?: number | null
          project_type?: string | null
          researchers_count?: number | null
          start_date?: string
          status?: string
          title?: string
          total_value?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_unb_projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          acronym: string | null
          address: string | null
          cep: string | null
          city: string | null
          cnpj: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          id: string
          logo_url: string | null
          name: string
          state: string | null
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          acronym?: string | null
          address?: string | null
          cep?: string | null
          city?: string | null
          cnpj?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          state?: string | null
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          acronym?: string | null
          address?: string | null
          cep?: string | null
          city?: string | null
          cnpj?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          state?: string | null
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      password_setup_tokens: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          token: string
          used: boolean
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          token: string
          used?: boolean
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          token?: string
          used?: boolean
          used_at?: string | null
        }
        Relationships: []
      }
      project_amendments: {
        Row: {
          amendment_number: number
          amendment_type: string
          approved_at: string | null
          approved_by: string | null
          created_at: string
          description: string | null
          id: string
          justification: string | null
          new_end_date: string | null
          new_value: number | null
          original_end_date: string | null
          original_value: number | null
          project_id: string
          requested_at: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          amendment_number: number
          amendment_type: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          description?: string | null
          id?: string
          justification?: string | null
          new_end_date?: string | null
          new_value?: number | null
          original_end_date?: string | null
          original_value?: number | null
          project_id: string
          requested_at?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          amendment_number?: number
          amendment_type?: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          description?: string | null
          id?: string
          justification?: string | null
          new_end_date?: string | null
          new_value?: number | null
          original_end_date?: string | null
          original_value?: number | null
          project_id?: string
          requested_at?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_project_amendments_project_id"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_documents: {
        Row: {
          created_at: string
          document_number: string | null
          expiry_date: string | null
          file_url: string | null
          id: string
          project_id: string | null
          signed_date: string | null
          status: string
          title: string
          type: string
          updated_at: string
          value: number | null
          version: number
        }
        Insert: {
          created_at?: string
          document_number?: string | null
          expiry_date?: string | null
          file_url?: string | null
          id?: string
          project_id?: string | null
          signed_date?: string | null
          status?: string
          title: string
          type: string
          updated_at?: string
          value?: number | null
          version?: number
        }
        Update: {
          created_at?: string
          document_number?: string | null
          expiry_date?: string | null
          file_url?: string | null
          id?: string
          project_id?: string | null
          signed_date?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
          value?: number | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_goals: {
        Row: {
          created_at: string
          description: string
          end_date: string | null
          id: string
          number: string
          progress: number | null
          progress_type: string | null
          project_id: string | null
          responsible: string | null
          start_date: string | null
          updated_at: string
          value: number | null
        }
        Insert: {
          created_at?: string
          description: string
          end_date?: string | null
          id?: string
          number: string
          progress?: number | null
          progress_type?: string | null
          project_id?: string | null
          responsible?: string | null
          start_date?: string | null
          updated_at?: string
          value?: number | null
        }
        Update: {
          created_at?: string
          description?: string
          end_date?: string | null
          id?: string
          number?: string
          progress?: number | null
          progress_type?: string | null
          project_id?: string | null
          responsible?: string | null
          start_date?: string | null
          updated_at?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_goals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_responsibles: {
        Row: {
          created_at: string
          id: string
          name: string
          project_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          project_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_responsibles_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          boxes_to_describe: number | null
          boxes_to_digitalize: number | null
          created_at: string
          description: string | null
          documents_meters: number | null
          end_date: string | null
          external_link: string | null
          id: string
          instrument_number: string | null
          legal_instrument: string | null
          object: string | null
          objectives: string | null
          organization_id: string | null
          progress: number | null
          project_type: string | null
          proposal_id: string | null
          researchers_count: number | null
          start_date: string
          status: string
          title: string
          total_value: number | null
          updated_at: string
        }
        Insert: {
          boxes_to_describe?: number | null
          boxes_to_digitalize?: number | null
          created_at?: string
          description?: string | null
          documents_meters?: number | null
          end_date?: string | null
          external_link?: string | null
          id?: string
          instrument_number?: string | null
          legal_instrument?: string | null
          object?: string | null
          objectives?: string | null
          organization_id?: string | null
          progress?: number | null
          project_type?: string | null
          proposal_id?: string | null
          researchers_count?: number | null
          start_date: string
          status?: string
          title: string
          total_value?: number | null
          updated_at?: string
        }
        Update: {
          boxes_to_describe?: number | null
          boxes_to_digitalize?: number | null
          created_at?: string
          description?: string | null
          documents_meters?: number | null
          end_date?: string | null
          external_link?: string | null
          id?: string
          instrument_number?: string | null
          legal_instrument?: string | null
          object?: string | null
          objectives?: string | null
          organization_id?: string | null
          progress?: number | null
          project_type?: string | null
          proposal_id?: string | null
          researchers_count?: number | null
          start_date?: string
          status?: string
          title?: string
          total_value?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      proposal_documents: {
        Row: {
          created_at: string
          document_number: string | null
          expiry_date: string | null
          file_url: string | null
          id: string
          proposal_id: string | null
          signed_date: string | null
          status: string
          title: string
          type: string
          updated_at: string
          value: number | null
          version: number
        }
        Insert: {
          created_at?: string
          document_number?: string | null
          expiry_date?: string | null
          file_url?: string | null
          id?: string
          proposal_id?: string | null
          signed_date?: string | null
          status?: string
          title: string
          type: string
          updated_at?: string
          value?: number | null
          version?: number
        }
        Update: {
          created_at?: string
          document_number?: string | null
          expiry_date?: string | null
          file_url?: string | null
          id?: string
          proposal_id?: string | null
          signed_date?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
          value?: number | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "proposal_documents_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          analysis_deadline: string | null
          created_at: string
          description: string | null
          estimated_duration_months: number | null
          estimated_value: number | null
          external_link: string | null
          id: string
          observations: string | null
          organization_id: string | null
          status: string
          submission_date: string
          tipo_instrumento: string | null
          tipo_projeto: string | null
          title: string
          updated_at: string
        }
        Insert: {
          analysis_deadline?: string | null
          created_at?: string
          description?: string | null
          estimated_duration_months?: number | null
          estimated_value?: number | null
          external_link?: string | null
          id?: string
          observations?: string | null
          organization_id?: string | null
          status?: string
          submission_date?: string
          tipo_instrumento?: string | null
          tipo_projeto?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          analysis_deadline?: string | null
          created_at?: string
          description?: string | null
          estimated_duration_months?: number | null
          estimated_value?: number | null
          external_link?: string | null
          id?: string
          observations?: string | null
          organization_id?: string | null
          status?: string
          submission_date?: string
          tipo_instrumento?: string | null
          tipo_projeto?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposals_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      query_statistics: {
        Row: {
          avg_confidence_score: number | null
          created_at: string
          date: string
          failed_classifications: number | null
          id: string
          successful_classifications: number | null
          total_queries: number | null
          updated_at: string
        }
        Insert: {
          avg_confidence_score?: number | null
          created_at?: string
          date?: string
          failed_classifications?: number | null
          id?: string
          successful_classifications?: number | null
          total_queries?: number | null
          updated_at?: string
        }
        Update: {
          avg_confidence_score?: number | null
          created_at?: string
          date?: string
          failed_classifications?: number | null
          id?: string
          successful_classifications?: number | null
          total_queries?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      registro_swot_analises: {
        Row: {
          criado_em: string
          criado_por: string
          id: string
          id_organizacao: string
        }
        Insert: {
          criado_em?: string
          criado_por: string
          id?: string
          id_organizacao: string
        }
        Update: {
          criado_em?: string
          criado_por?: string
          id?: string
          id_organizacao?: string
        }
        Relationships: [
          {
            foreignKeyName: "registro_swot_analises_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_swot_analises_id_organizacao_fkey"
            columns: ["id_organizacao"]
            isOneToOne: false
            referencedRelation: "casas"
            referencedColumns: ["id"]
          },
        ]
      }
      registro_swot_itens: {
        Row: {
          atualizado_em: string | null
          criado_em: string
          criado_por: string
          descricao: string
          id: string
          id_analise: string
          id_categoria: number
          id_fator: number
          id_importancia: number
          id_intensidade: number | null
          id_tendencia: number
          id_urgencia: number | null
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string
          criado_por: string
          descricao: string
          id?: string
          id_analise: string
          id_categoria: number
          id_fator: number
          id_importancia: number
          id_intensidade?: number | null
          id_tendencia: number
          id_urgencia?: number | null
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string
          criado_por?: string
          descricao?: string
          id?: string
          id_analise?: string
          id_categoria?: number
          id_fator?: number
          id_importancia?: number
          id_intensidade?: number | null
          id_tendencia?: number
          id_urgencia?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "registro_swot_itens_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_swot_itens_id_analise_fkey"
            columns: ["id_analise"]
            isOneToOne: false
            referencedRelation: "registro_swot_analises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_swot_itens_id_analise_fkey"
            columns: ["id_analise"]
            isOneToOne: false
            referencedRelation: "vw_registro_swot_analises_indice_favorabilidade"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_swot_itens_id_categoria_fkey"
            columns: ["id_categoria"]
            isOneToOne: false
            referencedRelation: "swot_categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_swot_itens_id_fator_fkey"
            columns: ["id_fator"]
            isOneToOne: false
            referencedRelation: "swot_fatores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_swot_itens_id_importancia_fkey"
            columns: ["id_importancia"]
            isOneToOne: false
            referencedRelation: "swot_importacia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_swot_itens_id_intensidade_fkey"
            columns: ["id_intensidade"]
            isOneToOne: false
            referencedRelation: "swot_intensidade"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_swot_itens_id_tendencia_fkey"
            columns: ["id_tendencia"]
            isOneToOne: false
            referencedRelation: "swot_tendencia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_swot_itens_id_urgencia_fkey"
            columns: ["id_urgencia"]
            isOneToOne: false
            referencedRelation: "swot_urgencia"
            referencedColumns: ["id"]
          },
        ]
      }
      researcher_allocations: {
        Row: {
          allocated_at: string | null
          created_by: string | null
          deallocated_at: string | null
          id: string
          organization_id: string | null
          permissions: Json | null
          project_id: string | null
          researcher_id: string | null
        }
        Insert: {
          allocated_at?: string | null
          created_by?: string | null
          deallocated_at?: string | null
          id?: string
          organization_id?: string | null
          permissions?: Json | null
          project_id?: string | null
          researcher_id?: string | null
        }
        Update: {
          allocated_at?: string | null
          created_by?: string | null
          deallocated_at?: string | null
          id?: string
          organization_id?: string | null
          permissions?: Json | null
          project_id?: string | null
          researcher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "researcher_allocations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "researcher_allocations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "researcher_allocations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "researcher_allocations_researcher_id_fkey"
            columns: ["researcher_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      researcher_goals: {
        Row: {
          created_at: string
          goal_id: string | null
          id: string
          researcher_id: string | null
        }
        Insert: {
          created_at?: string
          goal_id?: string | null
          id?: string
          researcher_id?: string | null
        }
        Update: {
          created_at?: string
          goal_id?: string | null
          id?: string
          researcher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "researcher_goals_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "project_goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "researcher_goals_researcher_id_fkey"
            columns: ["researcher_id"]
            isOneToOne: false
            referencedRelation: "researchers"
            referencedColumns: ["id"]
          },
        ]
      }
      researcher_organization_links: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          permissions: Json | null
          researcher_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          permissions?: Json | null
          researcher_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          permissions?: Json | null
          researcher_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "researcher_organization_links_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "researcher_organization_links_researcher_id_fkey"
            columns: ["researcher_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      researchers: {
        Row: {
          academic_level: string
          academic_status: string
          activities: string | null
          course: string | null
          cpf: string | null
          created_at: string
          dismissal_date: string | null
          dismissal_reason: string | null
          dismissed_by: string | null
          email: string
          end_date: string | null
          function: string
          id: string
          institution: string
          is_active: boolean | null
          lattes_url: string | null
          modality: string
          name: string
          observations: string | null
          phone: string | null
          project_id: string | null
          selected_goals: string[] | null
          shift: string | null
          specialization: string | null
          start_date: string
          status: string | null
          updated_at: string
          workload: number | null
        }
        Insert: {
          academic_level: string
          academic_status: string
          activities?: string | null
          course?: string | null
          cpf?: string | null
          created_at?: string
          dismissal_date?: string | null
          dismissal_reason?: string | null
          dismissed_by?: string | null
          email: string
          end_date?: string | null
          function: string
          id?: string
          institution: string
          is_active?: boolean | null
          lattes_url?: string | null
          modality: string
          name: string
          observations?: string | null
          phone?: string | null
          project_id?: string | null
          selected_goals?: string[] | null
          shift?: string | null
          specialization?: string | null
          start_date: string
          status?: string | null
          updated_at?: string
          workload?: number | null
        }
        Update: {
          academic_level?: string
          academic_status?: string
          activities?: string | null
          course?: string | null
          cpf?: string | null
          created_at?: string
          dismissal_date?: string | null
          dismissal_reason?: string | null
          dismissed_by?: string | null
          email?: string
          end_date?: string | null
          function?: string
          id?: string
          institution?: string
          is_active?: boolean | null
          lattes_url?: string | null
          modality?: string
          name?: string
          observations?: string | null
          phone?: string | null
          project_id?: string | null
          selected_goals?: string[] | null
          shift?: string | null
          specialization?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string
          workload?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "researchers_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      service_type_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          description: string | null
          examples: string | null
          id: string
          justification: string | null
          organization_id: string | null
          requested_by: string | null
          requested_type_name: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          suggested_indicator: string | null
          suggested_unit: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          description?: string | null
          examples?: string | null
          id?: string
          justification?: string | null
          organization_id?: string | null
          requested_by?: string | null
          requested_type_name: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          suggested_indicator?: string | null
          suggested_unit?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          description?: string | null
          examples?: string | null
          id?: string
          justification?: string | null
          organization_id?: string | null
          requested_by?: string | null
          requested_type_name?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          suggested_indicator?: string | null
          suggested_unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_type_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          archival_fund_id: string | null
          created_at: string
          custom_unit: string | null
          description: string | null
          end_date: string | null
          id: string
          indicator: string
          metric: number
          organization_id: string
          responsible_person: string
          start_date: string
          status: string
          support_type: string | null
          target_sector: string
          title: string
          type: string
          unit: string
          updated_at: string
        }
        Insert: {
          archival_fund_id?: string | null
          created_at?: string
          custom_unit?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          indicator: string
          metric?: number
          organization_id: string
          responsible_person: string
          start_date: string
          status?: string
          support_type?: string | null
          target_sector: string
          title: string
          type: string
          unit: string
          updated_at?: string
        }
        Update: {
          archival_fund_id?: string | null
          created_at?: string
          custom_unit?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          indicator?: string
          metric?: number
          organization_id?: string
          responsible_person?: string
          start_date?: string
          status?: string
          support_type?: string | null
          target_sector?: string
          title?: string
          type?: string
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_archival_fund_id_fkey"
            columns: ["archival_fund_id"]
            isOneToOne: false
            referencedRelation: "archival_funds"
            referencedColumns: ["id"]
          },
        ]
      }
      storage_locations: {
        Row: {
          address: string | null
          capacity_percentage: number | null
          created_at: string
          description: string | null
          document_types: Json | null
          id: string
          name: string
          organization_id: string
          responsible_person: string | null
          status: string
          total_documents: number | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          capacity_percentage?: number | null
          created_at?: string
          description?: string | null
          document_types?: Json | null
          id?: string
          name: string
          organization_id: string
          responsible_person?: string | null
          status?: string
          total_documents?: number | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          capacity_percentage?: number | null
          created_at?: string
          description?: string | null
          document_types?: Json | null
          id?: string
          name?: string
          organization_id?: string
          responsible_person?: string | null
          status?: string
          total_documents?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "storage_locations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      strategic_plan_actions: {
        Row: {
          created_at: string
          current_value: number | null
          description: string | null
          end_date: string | null
          id: string
          objective_id: string
          progress: number | null
          progress_type: string | null
          responsible_person: string | null
          service_type: string | null
          start_date: string | null
          status: string | null
          target_metric: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_value?: number | null
          description?: string | null
          end_date?: string | null
          id?: string
          objective_id: string
          progress?: number | null
          progress_type?: string | null
          responsible_person?: string | null
          service_type?: string | null
          start_date?: string | null
          status?: string | null
          target_metric?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_value?: number | null
          description?: string | null
          end_date?: string | null
          id?: string
          objective_id?: string
          progress?: number | null
          progress_type?: string | null
          responsible_person?: string | null
          service_type?: string | null
          start_date?: string | null
          status?: string | null
          target_metric?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategic_plan_actions_objective_id_fkey"
            columns: ["objective_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_objectives"
            referencedColumns: ["id"]
          },
        ]
      }
      strategic_plan_objectives: {
        Row: {
          completed: boolean | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          plan_id: string
          progress: number | null
          start_date: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          plan_id: string
          progress?: number | null
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          plan_id?: string
          progress?: number | null
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategic_plan_objectives_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "strategic_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      strategic_plan_team_members: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          plan_id: string
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          plan_id: string
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          plan_id?: string
          role?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategic_plan_team_members_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "strategic_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      strategic_plans: {
        Row: {
          created_at: string
          description: string | null
          duration: number
          end_date: string | null
          id: string
          mission: string | null
          name: string
          organization_id: string
          progress: number | null
          start_date: string
          status: string
          updated_at: string
          values: Json | null
          vision: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration: number
          end_date?: string | null
          id?: string
          mission?: string | null
          name: string
          organization_id: string
          progress?: number | null
          start_date: string
          status?: string
          updated_at?: string
          values?: Json | null
          vision?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: number
          end_date?: string | null
          id?: string
          mission?: string | null
          name?: string
          organization_id?: string
          progress?: number | null
          start_date?: string
          status?: string
          updated_at?: string
          values?: Json | null
          vision?: string | null
        }
        Relationships: []
      }
      swot_categorias: {
        Row: {
          criado_em: string
          id: number
          id_fator: number
          nome: string
        }
        Insert: {
          criado_em?: string
          id?: number
          id_fator: number
          nome: string
        }
        Update: {
          criado_em?: string
          id?: number
          id_fator?: number
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "swot_categorias_id_fator_fkey"
            columns: ["id_fator"]
            isOneToOne: false
            referencedRelation: "swot_fatores"
            referencedColumns: ["id"]
          },
        ]
      }
      swot_fatores: {
        Row: {
          criado_em: string
          descricao: string | null
          id: number
          nome_fator: string
        }
        Insert: {
          criado_em?: string
          descricao?: string | null
          id?: number
          nome_fator: string
        }
        Update: {
          criado_em?: string
          descricao?: string | null
          id?: number
          nome_fator?: string
        }
        Relationships: []
      }
      swot_importacia: {
        Row: {
          criado_em: string
          id: number
          peso: number
          titulo: string
        }
        Insert: {
          criado_em?: string
          id?: number
          peso: number
          titulo: string
        }
        Update: {
          criado_em?: string
          id?: number
          peso?: number
          titulo?: string
        }
        Relationships: []
      }
      swot_indices_favorabilidade: {
        Row: {
          criado_em: string
          descricao: string
          id: number
          indice_maximo: number
          indice_minimo: number
          titulo: string
        }
        Insert: {
          criado_em?: string
          descricao: string
          id?: number
          indice_maximo: number
          indice_minimo: number
          titulo: string
        }
        Update: {
          criado_em?: string
          descricao?: string
          id?: number
          indice_maximo?: number
          indice_minimo?: number
          titulo?: string
        }
        Relationships: []
      }
      swot_intensidade: {
        Row: {
          criado_em: string
          id: number
          peso: number
          titulo: string
        }
        Insert: {
          criado_em?: string
          id?: number
          peso: number
          titulo: string
        }
        Update: {
          criado_em?: string
          id?: number
          peso?: number
          titulo?: string
        }
        Relationships: []
      }
      swot_tendencia: {
        Row: {
          criado_em: string
          id: number
          titulo: string
        }
        Insert: {
          criado_em?: string
          id?: number
          titulo: string
        }
        Update: {
          criado_em?: string
          id?: number
          titulo?: string
        }
        Relationships: []
      }
      swot_tendencia_categoria: {
        Row: {
          criado_em: string
          id: number
          id_categoria: number
          id_tendencia: number
          peso: number
        }
        Insert: {
          criado_em?: string
          id?: number
          id_categoria: number
          id_tendencia: number
          peso: number
        }
        Update: {
          criado_em?: string
          id?: number
          id_categoria?: number
          id_tendencia?: number
          peso?: number
        }
        Relationships: [
          {
            foreignKeyName: "swot_tendencia_categoria_id_categoria_fkey"
            columns: ["id_categoria"]
            isOneToOne: false
            referencedRelation: "swot_categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swot_tendencia_categoria_id_tendencia_fkey"
            columns: ["id_tendencia"]
            isOneToOne: false
            referencedRelation: "swot_tendencia"
            referencedColumns: ["id"]
          },
        ]
      }
      swot_urgencia: {
        Row: {
          criado_em: string
          id: number
          peso: number
          titulo: string
        }
        Insert: {
          criado_em?: string
          id?: number
          peso: number
          titulo: string
        }
        Update: {
          criado_em?: string
          id?: number
          peso?: number
          titulo?: string
        }
        Relationships: []
      }
      system_notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          recipient_email: string
          recipient_role: string | null
          sent: boolean | null
          sent_at: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          recipient_email: string
          recipient_role?: string | null
          sent?: boolean | null
          sent_at?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          recipient_email?: string
          recipient_role?: string | null
          sent?: boolean | null
          sent_at?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assignee: string
          column_id: string
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string
          id: string
          labels: Json | null
          organization_id: string
          priority: string
          title: string
          updated_at: string
        }
        Insert: {
          assignee: string
          column_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date: string
          id?: string
          labels?: Json | null
          organization_id: string
          priority: string
          title: string
          updated_at?: string
        }
        Update: {
          assignee?: string
          column_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string
          id?: string
          labels?: Json | null
          organization_id?: string
          priority?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      unclassified_queries: {
        Row: {
          admin_notes: string | null
          confidence_level: string | null
          created_at: string | null
          id: string
          query_text: string
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          suggested_classification: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          confidence_level?: string | null
          created_at?: string | null
          id?: string
          query_text: string
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          suggested_classification?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          confidence_level?: string | null
          created_at?: string | null
          id?: string
          query_text?: string
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          suggested_classification?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          name: string
          organization_id: string | null
          phone: string | null
          position: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          name: string
          organization_id?: string | null
          phone?: string | null
          position?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          name?: string
          organization_id?: string | null
          phone?: string | null
          position?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_profiles_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          admin: boolean
          ativo: boolean
          criado_em: string
          email: string
          foto_url: string | null
          id: string
          id_organizacao_princiapal: string
          id_solicitacao: string
          nome_usuario: string
          observacao: string | null
          telefone: string | null
        }
        Insert: {
          admin?: boolean
          ativo?: boolean
          criado_em?: string
          email: string
          foto_url?: string | null
          id: string
          id_organizacao_princiapal: string
          id_solicitacao: string
          nome_usuario: string
          observacao?: string | null
          telefone?: string | null
        }
        Update: {
          admin?: boolean
          ativo?: boolean
          criado_em?: string
          email?: string
          foto_url?: string | null
          id?: string
          id_organizacao_princiapal?: string
          id_solicitacao?: string
          nome_usuario?: string
          observacao?: string | null
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_id_organizacao_princiapal_fkey"
            columns: ["id_organizacao_princiapal"]
            isOneToOne: false
            referencedRelation: "casas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuarios_id_solicitacao_fkey"
            columns: ["id_solicitacao"]
            isOneToOne: false
            referencedRelation: "usuarios_solicitacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios_solicitacoes: {
        Row: {
          codigo_cadastro: string | null
          conta_criada: boolean
          criado_em: string
          data_resposta: string | null
          email: string
          id: string
          id_organizacao_aprovacao: string | null
          nome: string
          observacao: string | null
          organizacao_solicitacao: string
          permissao: number | null
          status_solicitacao: number
          vinculo: number
        }
        Insert: {
          codigo_cadastro?: string | null
          conta_criada?: boolean
          criado_em?: string
          data_resposta?: string | null
          email: string
          id?: string
          id_organizacao_aprovacao?: string | null
          nome: string
          observacao?: string | null
          organizacao_solicitacao: string
          permissao?: number | null
          status_solicitacao: number
          vinculo: number
        }
        Update: {
          codigo_cadastro?: string | null
          conta_criada?: boolean
          criado_em?: string
          data_resposta?: string | null
          email?: string
          id?: string
          id_organizacao_aprovacao?: string | null
          nome?: string
          observacao?: string | null
          organizacao_solicitacao?: string
          permissao?: number | null
          status_solicitacao?: number
          vinculo?: number
        }
        Relationships: []
      }
    }
    Views: {
      vw_registro_swot_analises_indice_favorabilidade: {
        Row: {
          criado_em: string | null
          criado_por: string | null
          descricao_favorabilidade: string | null
          id: string | null
          id_favorabilidade: number | null
          id_organizacao: string | null
          indice_favorabilidade: number | null
          titulo_favorabilidade: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registro_swot_analises_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_swot_analises_id_organizacao_fkey"
            columns: ["id_organizacao"]
            isOneToOne: false
            referencedRelation: "casas"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_registro_swot_analises_pontuacao_categoria: {
        Row: {
          id_analise: string | null
          id_categoria: number | null
          nome_categoria: string | null
          pontuacao_total: number | null
        }
        Relationships: [
          {
            foreignKeyName: "registro_swot_itens_id_analise_fkey"
            columns: ["id_analise"]
            isOneToOne: false
            referencedRelation: "registro_swot_analises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_swot_itens_id_analise_fkey"
            columns: ["id_analise"]
            isOneToOne: false
            referencedRelation: "vw_registro_swot_analises_indice_favorabilidade"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_swot_itens_id_categoria_fkey"
            columns: ["id_categoria"]
            isOneToOne: false
            referencedRelation: "swot_categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_registro_swot_itens_pontuacao: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          criado_por: string | null
          descricao: string | null
          id: string | null
          id_analise: string | null
          id_categoria: number | null
          id_fator: number | null
          id_importancia: number | null
          id_intensidade: number | null
          id_tendencia: number | null
          id_urgencia: number | null
          pontuacao: number | null
          titulo_importancia: string | null
          titulo_intensidade: string | null
          titulo_tendencia: string | null
          titulo_urgencia: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registro_swot_itens_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_swot_itens_id_analise_fkey"
            columns: ["id_analise"]
            isOneToOne: false
            referencedRelation: "registro_swot_analises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_swot_itens_id_analise_fkey"
            columns: ["id_analise"]
            isOneToOne: false
            referencedRelation: "vw_registro_swot_analises_indice_favorabilidade"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_swot_itens_id_categoria_fkey"
            columns: ["id_categoria"]
            isOneToOne: false
            referencedRelation: "swot_categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_swot_itens_id_fator_fkey"
            columns: ["id_fator"]
            isOneToOne: false
            referencedRelation: "swot_fatores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_swot_itens_id_importancia_fkey"
            columns: ["id_importancia"]
            isOneToOne: false
            referencedRelation: "swot_importacia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_swot_itens_id_intensidade_fkey"
            columns: ["id_intensidade"]
            isOneToOne: false
            referencedRelation: "swot_intensidade"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_swot_itens_id_tendencia_fkey"
            columns: ["id_tendencia"]
            isOneToOne: false
            referencedRelation: "swot_tendencia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_swot_itens_id_urgencia_fkey"
            columns: ["id_urgencia"]
            isOneToOne: false
            referencedRelation: "swot_urgencia"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_objective_progress: {
        Args: { objective_id_param: string }
        Returns: number
      }
      get_current_user_organization_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_real_time_statistics: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_user_organization_id: {
        Args: Record<PropertyKey, never> | { user_id: string }
        Returns: string
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
      is_objective_completed: {
        Args: { objective_id_param: string }
        Returns: boolean
      }
      is_unb_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_unb_user: {
        Args: { user_id: string }
        Returns: boolean
      }
      track_query_statistics: {
        Args: { p_success?: boolean; p_classification_code?: string }
        Returns: undefined
      }
      update_daily_statistics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      user_role:
        | "student"
        | "public_organ"
        | "partner_organ"
        | "unb_researcher"
        | "admin"
        | "unb_admin"
        | "partner_admin"
        | "partner_user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: [
        "student",
        "public_organ",
        "partner_organ",
        "unb_researcher",
        "admin",
        "unb_admin",
        "partner_admin",
        "partner_user",
      ],
    },
  },
} as const
