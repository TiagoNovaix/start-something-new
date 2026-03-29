export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      categorias: {
        Row: {
          classificacao_dre: string | null
          cor: string | null
          created_at: string | null
          icone: string | null
          id: string
          nome: string
          tipo: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          classificacao_dre?: string | null
          cor?: string | null
          created_at?: string | null
          icone?: string | null
          id?: string
          nome: string
          tipo: string
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          classificacao_dre?: string | null
          cor?: string | null
          created_at?: string | null
          icone?: string | null
          id?: string
          nome?: string
          tipo?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      configuracoes: {
        Row: {
          created_at: string | null
          empresa_logo: string | null
          empresa_nome: string | null
          id: string
          moeda: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          empresa_logo?: string | null
          empresa_nome?: string | null
          id?: string
          moeda?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          empresa_logo?: string | null
          empresa_nome?: string | null
          id?: string
          moeda?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      contas: {
        Row: {
          banco: string | null
          cor: string | null
          created_at: string | null
          id: string
          nome: string
          saldo_inicial: number | null
          tipo: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          banco?: string | null
          cor?: string | null
          created_at?: string | null
          id?: string
          nome: string
          saldo_inicial?: number | null
          tipo?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          banco?: string | null
          cor?: string | null
          created_at?: string | null
          id?: string
          nome?: string
          saldo_inicial?: number | null
          tipo?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      fechamentos: {
        Row: {
          ano: number
          data_fechamento: string | null
          id: string
          mes: number
          status: string | null
          user_id: string
        }
        Insert: {
          ano: number
          data_fechamento?: string | null
          id?: string
          mes: number
          status?: string | null
          user_id: string
        }
        Update: {
          ano?: number
          data_fechamento?: string | null
          id?: string
          mes?: number
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      lancamentos: {
        Row: {
          categoria_id: string | null
          comprovante_url: string | null
          conta_destino_id: string | null
          conta_id: string | null
          created_at: string | null
          data: string
          data_pagamento: string | null
          descricao: string
          frequencia_recorrencia: string | null
          id: string
          metadata: Json | null
          metodo_pagamento: string | null
          numero_parcela: number | null
          observacoes: string | null
          parcelado: boolean | null
          recorrente: boolean | null
          socio_id: string | null
          status: string | null
          tipo_movimentacao: string | null
          total_parcelas: number | null
          updated_at: string | null
          user_id: string
          valor: number
        }
        Insert: {
          categoria_id?: string | null
          comprovante_url?: string | null
          conta_destino_id?: string | null
          conta_id?: string | null
          created_at?: string | null
          data?: string
          data_pagamento?: string | null
          descricao: string
          frequencia_recorrencia?: string | null
          id?: string
          metadata?: Json | null
          metodo_pagamento?: string | null
          numero_parcela?: number | null
          observacoes?: string | null
          parcelado?: boolean | null
          recorrente?: boolean | null
          socio_id?: string | null
          status?: string | null
          tipo_movimentacao?: string | null
          total_parcelas?: number | null
          updated_at?: string | null
          user_id?: string
          valor: number
        }
        Update: {
          categoria_id?: string | null
          comprovante_url?: string | null
          conta_destino_id?: string | null
          conta_id?: string | null
          created_at?: string | null
          data?: string
          data_pagamento?: string | null
          descricao?: string
          frequencia_recorrencia?: string | null
          id?: string
          metadata?: Json | null
          metodo_pagamento?: string | null
          numero_parcela?: number | null
          observacoes?: string | null
          parcelado?: boolean | null
          recorrente?: boolean | null
          socio_id?: string | null
          status?: string | null
          tipo_movimentacao?: string | null
          total_parcelas?: number | null
          updated_at?: string | null
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "lancamentos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_conta_destino_id_fkey"
            columns: ["conta_destino_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_socio_id_fkey"
            columns: ["socio_id"]
            isOneToOne: false
            referencedRelation: "socios"
            referencedColumns: ["id"]
          },
        ]
      }
      modelos_recorrentes: {
        Row: {
          ativo: boolean | null
          categoria_id: string | null
          conta_id: string | null
          created_at: string | null
          descricao: string
          dia_vencimento: number | null
          frequencia: string | null
          id: string
          proxima_execucao: string | null
          tipo: string
          updated_at: string | null
          user_id: string
          valor: number
        }
        Insert: {
          ativo?: boolean | null
          categoria_id?: string | null
          conta_id?: string | null
          created_at?: string | null
          descricao: string
          dia_vencimento?: number | null
          frequencia?: string | null
          id?: string
          proxima_execucao?: string | null
          tipo: string
          updated_at?: string | null
          user_id?: string
          valor: number
        }
        Update: {
          ativo?: boolean | null
          categoria_id?: string | null
          conta_id?: string | null
          created_at?: string | null
          descricao?: string
          dia_vencimento?: number | null
          frequencia?: string | null
          id?: string
          proxima_execucao?: string | null
          tipo?: string
          updated_at?: string | null
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "modelos_recorrentes_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "modelos_recorrentes_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
        ]
      }
      orcamentos: {
        Row: {
          ano: number
          categoria_id: string | null
          created_at: string | null
          id: string
          mes: number
          updated_at: string | null
          user_id: string
          valor_planejado: number
        }
        Insert: {
          ano: number
          categoria_id?: string | null
          created_at?: string | null
          id?: string
          mes: number
          updated_at?: string | null
          user_id?: string
          valor_planejado?: number
        }
        Update: {
          ano?: number
          categoria_id?: string | null
          created_at?: string | null
          id?: string
          mes?: number
          updated_at?: string | null
          user_id?: string
          valor_planejado?: number
        }
        Relationships: [
          {
            foreignKeyName: "orcamentos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reservas: {
        Row: {
          conta_id: string | null
          cor: string | null
          created_at: string | null
          id: string
          meta: number | null
          nome: string
          saldo_atual: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          conta_id?: string | null
          cor?: string | null
          created_at?: string | null
          id?: string
          meta?: number | null
          nome: string
          saldo_atual?: number
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          conta_id?: string | null
          cor?: string | null
          created_at?: string | null
          id?: string
          meta?: number | null
          nome?: string
          saldo_atual?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservas_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
        ]
      }
      socios: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          email: string | null
          id: string
          nome: string
          participacao: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          email?: string | null
          id?: string
          nome: string
          participacao?: number
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          email?: string | null
          id?: string
          nome?: string
          participacao?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      transferencias: {
        Row: {
          created_at: string | null
          destino_lancamento_id: string | null
          id: string
          origem_lancamento_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          destino_lancamento_id?: string | null
          id?: string
          origem_lancamento_id?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          destino_lancamento_id?: string | null
          id?: string
          origem_lancamento_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transferencias_destino_lancamento_id_fkey"
            columns: ["destino_lancamento_id"]
            isOneToOne: false
            referencedRelation: "lancamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transferencias_origem_lancamento_id_fkey"
            columns: ["origem_lancamento_id"]
            isOneToOne: false
            referencedRelation: "lancamentos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_documents: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
      match_vector_soluv: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
