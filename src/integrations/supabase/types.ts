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
          ativo: boolean | null
          classificacao_dre: string | null
          cor: string | null
          created_at: string | null
          deleted_at: string | null
          descricao: string | null
          icone: string | null
          id: string
          nome: string
          parent_id: string | null
          subgrupo: string | null
          tipo: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ativo?: boolean | null
          classificacao_dre?: string | null
          cor?: string | null
          created_at?: string | null
          deleted_at?: string | null
          descricao?: string | null
          icone?: string | null
          id?: string
          nome: string
          parent_id?: string | null
          subgrupo?: string | null
          tipo: string
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          ativo?: boolean | null
          classificacao_dre?: string | null
          cor?: string | null
          created_at?: string | null
          deleted_at?: string | null
          descricao?: string | null
          icone?: string | null
          id?: string
          nome?: string
          parent_id?: string | null
          subgrupo?: string | null
          tipo?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "categorias_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      centros_custo: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          deleted_at: string | null
          descricao: string | null
          id: string
          nome: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          deleted_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          deleted_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      configuracoes: {
        Row: {
          cnpj: string | null
          created_at: string | null
          deleted_at: string | null
          empresa_logo: string | null
          empresa_nome: string | null
          id: string
          moeda: string | null
          regime_tributario: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cnpj?: string | null
          created_at?: string | null
          deleted_at?: string | null
          empresa_logo?: string | null
          empresa_nome?: string | null
          id?: string
          moeda?: string | null
          regime_tributario?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cnpj?: string | null
          created_at?: string | null
          deleted_at?: string | null
          empresa_logo?: string | null
          empresa_nome?: string | null
          id?: string
          moeda?: string | null
          regime_tributario?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      contas: {
        Row: {
          ativo: boolean | null
          banco: string | null
          cor: string | null
          created_at: string | null
          deleted_at: string | null
          id: string
          nome: string
          saldo_inicial: number | null
          tipo: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ativo?: boolean | null
          banco?: string | null
          cor?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          nome: string
          saldo_inicial?: number | null
          tipo?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          ativo?: boolean | null
          banco?: string | null
          cor?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          nome?: string
          saldo_inicial?: number | null
          tipo?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      fechamentos: {
        Row: {
          ano: number
          data_fechamento: string | null
          deleted_at: string | null
          id: string
          mes: number
          status: string | null
          user_id: string
        }
        Insert: {
          ano: number
          data_fechamento?: string | null
          deleted_at?: string | null
          id?: string
          mes: number
          status?: string | null
          user_id: string
        }
        Update: {
          ano?: number
          data_fechamento?: string | null
          deleted_at?: string | null
          id?: string
          mes?: number
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      grupos_parcelas: {
        Row: {
          created_at: string
          deleted_at: string | null
          descricao: string | null
          id: string
          total_parcelas: number
          updated_at: string
          user_id: string
          valor_total: number
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          descricao?: string | null
          id?: string
          total_parcelas: number
          updated_at?: string
          user_id: string
          valor_total: number
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          descricao?: string | null
          id?: string
          total_parcelas?: number
          updated_at?: string
          user_id?: string
          valor_total?: number
        }
        Relationships: []
      }
      lancamentos: {
        Row: {
          categoria_id: string | null
          centro_custo_id: string | null
          comprovante_url: string | null
          conciliado: boolean | null
          conta_destino_id: string | null
          conta_id: string | null
          created_at: string | null
          data: string
          data_pagamento: string | null
          data_vencimento: string | null
          deleted_at: string | null
          descricao: string
          fixo: boolean | null
          frequencia_recorrencia: string | null
          grupo_parcelas_id: string | null
          id: string
          metadata: Json | null
          metodo_pagamento: string | null
          numero_parcela: number | null
          observacoes: string | null
          parcelado: boolean | null
          recorrente: boolean | null
          regra_recorrencia_id: string | null
          socio_id: string | null
          status: string | null
          subtipo: string | null
          tags: string[] | null
          tipo_movimentacao: string | null
          total_parcelas: number | null
          updated_at: string | null
          user_id: string
          valor: number
        }
        Insert: {
          categoria_id?: string | null
          centro_custo_id?: string | null
          comprovante_url?: string | null
          conciliado?: boolean | null
          conta_destino_id?: string | null
          conta_id?: string | null
          created_at?: string | null
          data?: string
          data_pagamento?: string | null
          data_vencimento?: string | null
          deleted_at?: string | null
          descricao: string
          fixo?: boolean | null
          frequencia_recorrencia?: string | null
          grupo_parcelas_id?: string | null
          id?: string
          metadata?: Json | null
          metodo_pagamento?: string | null
          numero_parcela?: number | null
          observacoes?: string | null
          parcelado?: boolean | null
          recorrente?: boolean | null
          regra_recorrencia_id?: string | null
          socio_id?: string | null
          status?: string | null
          subtipo?: string | null
          tags?: string[] | null
          tipo_movimentacao?: string | null
          total_parcelas?: number | null
          updated_at?: string | null
          user_id?: string
          valor: number
        }
        Update: {
          categoria_id?: string | null
          centro_custo_id?: string | null
          comprovante_url?: string | null
          conciliado?: boolean | null
          conta_destino_id?: string | null
          conta_id?: string | null
          created_at?: string | null
          data?: string
          data_pagamento?: string | null
          data_vencimento?: string | null
          deleted_at?: string | null
          descricao?: string
          fixo?: boolean | null
          frequencia_recorrencia?: string | null
          grupo_parcelas_id?: string | null
          id?: string
          metadata?: Json | null
          metodo_pagamento?: string | null
          numero_parcela?: number | null
          observacoes?: string | null
          parcelado?: boolean | null
          recorrente?: boolean | null
          regra_recorrencia_id?: string | null
          socio_id?: string | null
          status?: string | null
          subtipo?: string | null
          tags?: string[] | null
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
            foreignKeyName: "lancamentos_centro_custo_id_fkey"
            columns: ["centro_custo_id"]
            isOneToOne: false
            referencedRelation: "centros_custo"
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
            foreignKeyName: "lancamentos_grupo_parcelas_id_fkey"
            columns: ["grupo_parcelas_id"]
            isOneToOne: false
            referencedRelation: "grupos_parcelas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_regra_recorrencia_id_fkey"
            columns: ["regra_recorrencia_id"]
            isOneToOne: false
            referencedRelation: "regras_recorrencia"
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
      metas: {
        Row: {
          ativo: boolean | null
          cor: string | null
          created_at: string | null
          data_limite: string | null
          deleted_at: string | null
          icone: string | null
          id: string
          nome: string
          updated_at: string | null
          user_id: string
          valor_atual: number | null
          valor_objetivo: number
        }
        Insert: {
          ativo?: boolean | null
          cor?: string | null
          created_at?: string | null
          data_limite?: string | null
          deleted_at?: string | null
          icone?: string | null
          id?: string
          nome: string
          updated_at?: string | null
          user_id: string
          valor_atual?: number | null
          valor_objetivo: number
        }
        Update: {
          ativo?: boolean | null
          cor?: string | null
          created_at?: string | null
          data_limite?: string | null
          deleted_at?: string | null
          icone?: string | null
          id?: string
          nome?: string
          updated_at?: string | null
          user_id?: string
          valor_atual?: number | null
          valor_objetivo?: number
        }
        Relationships: []
      }
      modelos_recorrentes: {
        Row: {
          ativo: boolean | null
          categoria_id: string | null
          conta_id: string | null
          created_at: string | null
          deleted_at: string | null
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
          deleted_at?: string | null
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
          deleted_at?: string | null
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
      movimentacoes_reservas: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          observacao: string | null
          reserva_id: string
          tipo: string
          transacao_id: string | null
          user_id: string
          valor: number
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          observacao?: string | null
          reserva_id: string
          tipo: string
          transacao_id?: string | null
          user_id: string
          valor: number
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          observacao?: string | null
          reserva_id?: string
          tipo?: string
          transacao_id?: string | null
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "movimentacoes_reservas_reserva_id_fkey"
            columns: ["reserva_id"]
            isOneToOne: false
            referencedRelation: "reservas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimentacoes_reservas_transacao_id_fkey"
            columns: ["transacao_id"]
            isOneToOne: false
            referencedRelation: "lancamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      orcamentos: {
        Row: {
          ano: number
          categoria_id: string | null
          created_at: string | null
          deleted_at: string | null
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
          deleted_at?: string | null
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
          deleted_at?: string | null
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
          bio: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          preferencias: Json | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          preferencias?: Json | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          preferencias?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      regras_recorrencia: {
        Row: {
          categoria_id: string | null
          conta_id: string | null
          created_at: string
          data_fim: string | null
          data_inicio: string
          deleted_at: string | null
          descricao: string | null
          frequencia: string
          id: string
          updated_at: string
          user_id: string
          valor: number | null
        }
        Insert: {
          categoria_id?: string | null
          conta_id?: string | null
          created_at?: string
          data_fim?: string | null
          data_inicio: string
          deleted_at?: string | null
          descricao?: string | null
          frequencia: string
          id?: string
          updated_at?: string
          user_id: string
          valor?: number | null
        }
        Update: {
          categoria_id?: string | null
          conta_id?: string | null
          created_at?: string
          data_fim?: string | null
          data_inicio?: string
          deleted_at?: string | null
          descricao?: string | null
          frequencia?: string
          id?: string
          updated_at?: string
          user_id?: string
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "regras_recorrencia_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "regras_recorrencia_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
        ]
      }
      reservas: {
        Row: {
          automatico: boolean | null
          categorias_especificas: string[] | null
          conta_id: string | null
          cor: string | null
          created_at: string | null
          deleted_at: string | null
          destino_contabil: string | null
          id: string
          meta: number | null
          nome: string
          origem_tipo: string[] | null
          percentual: number | null
          permite_saque_livre: boolean | null
          saldo_atual: number
          status: string | null
          tipo: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          automatico?: boolean | null
          categorias_especificas?: string[] | null
          conta_id?: string | null
          cor?: string | null
          created_at?: string | null
          deleted_at?: string | null
          destino_contabil?: string | null
          id?: string
          meta?: number | null
          nome: string
          origem_tipo?: string[] | null
          percentual?: number | null
          permite_saque_livre?: boolean | null
          saldo_atual?: number
          status?: string | null
          tipo?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          automatico?: boolean | null
          categorias_especificas?: string[] | null
          conta_id?: string | null
          cor?: string | null
          created_at?: string | null
          deleted_at?: string | null
          destino_contabil?: string | null
          id?: string
          meta?: number | null
          nome?: string
          origem_tipo?: string[] | null
          percentual?: number | null
          permite_saque_livre?: boolean | null
          saldo_atual?: number
          status?: string | null
          tipo?: string | null
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
          deleted_at: string | null
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
          deleted_at?: string | null
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
          deleted_at?: string | null
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
          deleted_at: string | null
          destino_lancamento_id: string | null
          id: string
          origem_lancamento_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          destino_lancamento_id?: string | null
          id?: string
          origem_lancamento_id?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
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
      vector_soluv: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      vw_dashboard_resumo: {
        Row: {
          ano: number | null
          despesa_paga: number | null
          despesa_pendente: number | null
          despesa_total: number | null
          lucro_liquido_realizado: number | null
          mes: number | null
          receita_paga: number | null
          receita_pendente: number | null
          receita_total: number | null
          user_id: string | null
        }
        Relationships: []
      }
      vw_dre: {
        Row: {
          ano: number | null
          categoria_nome: string | null
          classificacao_dre: string | null
          mes: number | null
          subgrupo: string | null
          tipo_movimentacao: string | null
          user_id: string | null
          valor_total: number | null
        }
        Relationships: []
      }
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
