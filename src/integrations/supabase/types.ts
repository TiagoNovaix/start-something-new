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
      audit_logs: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          justification: string | null
          socio_id: string | null
          tipo_evento: string
          user_id: string
          valor_antigo: Json | null
          valor_novo: Json | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          justification?: string | null
          socio_id?: string | null
          tipo_evento: string
          user_id: string
          valor_antigo?: Json | null
          valor_novo?: Json | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          justification?: string | null
          socio_id?: string | null
          tipo_evento?: string
          user_id?: string
          valor_antigo?: Json | null
          valor_novo?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_socio_id_fkey"
            columns: ["socio_id"]
            isOneToOne: false
            referencedRelation: "socios"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_accounts: {
        Row: {
          company_id: string
          created_at: string
          current_balance: number | null
          id: string
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          current_balance?: number | null
          id?: string
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          current_balance?: number | null
          id?: string
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_accounts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias: {
        Row: {
          ativo: boolean | null
          classificacao_dre: string | null
          company_id: string | null
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
          company_id?: string | null
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
          company_id?: string | null
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
            foreignKeyName: "categorias_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
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
          company_id: string | null
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
          company_id?: string | null
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
          company_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "centros_custo_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          cnpj: string | null
          created_at: string
          id: string
          name: string
          tax_regime: string | null
          updated_at: string
        }
        Insert: {
          cnpj?: string | null
          created_at?: string
          id?: string
          name: string
          tax_regime?: string | null
          updated_at?: string
        }
        Update: {
          cnpj?: string | null
          created_at?: string
          id?: string
          name?: string
          tax_regime?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      configuracoes: {
        Row: {
          caixa_operacional_minimo_meses: number | null
          cnpj: string | null
          company_id: string | null
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
          caixa_operacional_minimo_meses?: number | null
          cnpj?: string | null
          company_id?: string | null
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
          caixa_operacional_minimo_meses?: number | null
          cnpj?: string | null
          company_id?: string | null
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
        Relationships: [
          {
            foreignKeyName: "configuracoes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      contas: {
        Row: {
          ativo: boolean | null
          banco: string | null
          company_id: string | null
          cor: string | null
          created_at: string | null
          deleted_at: string | null
          id: string
          nome: string
          saldo_atual: number | null
          saldo_inicial: number | null
          tipo: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ativo?: boolean | null
          banco?: string | null
          company_id?: string | null
          cor?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          nome: string
          saldo_atual?: number | null
          saldo_inicial?: number | null
          tipo?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          ativo?: boolean | null
          banco?: string | null
          company_id?: string | null
          cor?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          nome?: string
          saldo_atual?: number | null
          saldo_inicial?: number | null
          tipo?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contas_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      distribuicoes_lucro: {
        Row: {
          company_id: string | null
          created_at: string
          despesas_operacionais: number
          disponivel_distribuicao: number
          ebitda: number
          financeiro: number
          id: string
          impostos: number
          lucro_liquido: number
          mes_referencia: string
          pro_labore_total: number
          receita_bruta: number
          reservas_provisionadas: number
          total_distribuido: number
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          despesas_operacionais?: number
          disponivel_distribuicao?: number
          ebitda?: number
          financeiro?: number
          id?: string
          impostos?: number
          lucro_liquido?: number
          mes_referencia: string
          pro_labore_total?: number
          receita_bruta?: number
          reservas_provisionadas?: number
          total_distribuido?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          despesas_operacionais?: number
          disponivel_distribuicao?: number
          ebitda?: number
          financeiro?: number
          id?: string
          impostos?: number
          lucro_liquido?: number
          mes_referencia?: string
          pro_labore_total?: number
          receita_bruta?: number
          reservas_provisionadas?: number
          total_distribuido?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "distribuicoes_lucro_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      distribuicoes_lucro_itens: {
        Row: {
          company_id: string | null
          created_at: string
          distribuicao_id: string
          id: string
          percentual_societario: number
          socio_id: string
          valor_recebido: number
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          distribuicao_id: string
          id?: string
          percentual_societario: number
          socio_id: string
          valor_recebido: number
        }
        Update: {
          company_id?: string | null
          created_at?: string
          distribuicao_id?: string
          id?: string
          percentual_societario?: number
          socio_id?: string
          valor_recebido?: number
        }
        Relationships: [
          {
            foreignKeyName: "distribuicoes_lucro_itens_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "distribuicoes_lucro_itens_distribuicao_id_fkey"
            columns: ["distribuicao_id"]
            isOneToOne: false
            referencedRelation: "distribuicoes_lucro"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "distribuicoes_lucro_itens_socio_id_fkey"
            columns: ["socio_id"]
            isOneToOne: false
            referencedRelation: "socios"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          company_id: string | null
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      grupos_parcelas: {
        Row: {
          categoria_id: string | null
          centro_custo_id: string | null
          company_id: string | null
          conta_id: string | null
          created_at: string
          deleted_at: string | null
          descricao: string | null
          id: string
          socio_id: string | null
          subtipo: string | null
          total_parcelas: number
          updated_at: string
          user_id: string
          valor_total: number
        }
        Insert: {
          categoria_id?: string | null
          centro_custo_id?: string | null
          company_id?: string | null
          conta_id?: string | null
          created_at?: string
          deleted_at?: string | null
          descricao?: string | null
          id?: string
          socio_id?: string | null
          subtipo?: string | null
          total_parcelas: number
          updated_at?: string
          user_id: string
          valor_total: number
        }
        Update: {
          categoria_id?: string | null
          centro_custo_id?: string | null
          company_id?: string | null
          conta_id?: string | null
          created_at?: string
          deleted_at?: string | null
          descricao?: string | null
          id?: string
          socio_id?: string | null
          subtipo?: string | null
          total_parcelas?: number
          updated_at?: string
          user_id?: string
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "grupos_parcelas_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grupos_parcelas_centro_custo_id_fkey"
            columns: ["centro_custo_id"]
            isOneToOne: false
            referencedRelation: "centros_custo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grupos_parcelas_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grupos_parcelas_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grupos_parcelas_socio_id_fkey"
            columns: ["socio_id"]
            isOneToOne: false
            referencedRelation: "socios"
            referencedColumns: ["id"]
          },
        ]
      }
      lancamentos: {
        Row: {
          categoria_id: string | null
          centro_custo_id: string | null
          company_id: string | null
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
          company_id?: string | null
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
          company_id?: string | null
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
            foreignKeyName: "lancamentos_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
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
          company_id: string | null
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
          company_id?: string | null
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
          company_id?: string | null
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
        Relationships: [
          {
            foreignKeyName: "metas_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      modelos_recorrentes: {
        Row: {
          ativo: boolean | null
          categoria_id: string | null
          company_id: string | null
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
          company_id?: string | null
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
          company_id?: string | null
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
            foreignKeyName: "modelos_recorrentes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
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
      monthly_closings: {
        Row: {
          ano: number
          closed_at: string | null
          closed_by: string | null
          company_id: string | null
          data_fechamento: string | null
          deleted_at: string | null
          id: string
          justification: string | null
          mes: number
          snapshot_dre: Json | null
          status: string | null
          user_id: string
        }
        Insert: {
          ano: number
          closed_at?: string | null
          closed_by?: string | null
          company_id?: string | null
          data_fechamento?: string | null
          deleted_at?: string | null
          id?: string
          justification?: string | null
          mes: number
          snapshot_dre?: Json | null
          status?: string | null
          user_id: string
        }
        Update: {
          ano?: number
          closed_at?: string | null
          closed_by?: string | null
          company_id?: string | null
          data_fechamento?: string | null
          deleted_at?: string | null
          id?: string
          justification?: string | null
          mes?: number
          snapshot_dre?: Json | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "monthly_closings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      movimentacoes_reservas: {
        Row: {
          company_id: string | null
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
          company_id?: string | null
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
          company_id?: string | null
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
            foreignKeyName: "movimentacoes_reservas_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
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
          company_id: string | null
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
          company_id?: string | null
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
          company_id?: string | null
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
          {
            foreignKeyName: "orcamentos_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
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
          role: string | null
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
          role?: string | null
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
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      regras_recorrencia: {
        Row: {
          categoria_id: string | null
          centro_custo_id: string | null
          company_id: string | null
          conta_destino_id: string | null
          conta_id: string | null
          created_at: string
          data_fim: string | null
          data_inicio: string
          deleted_at: string | null
          descricao: string | null
          frequencia: string
          id: string
          socio_id: string | null
          subtipo: string | null
          updated_at: string
          user_id: string
          valor: number | null
        }
        Insert: {
          categoria_id?: string | null
          centro_custo_id?: string | null
          company_id?: string | null
          conta_destino_id?: string | null
          conta_id?: string | null
          created_at?: string
          data_fim?: string | null
          data_inicio: string
          deleted_at?: string | null
          descricao?: string | null
          frequencia: string
          id?: string
          socio_id?: string | null
          subtipo?: string | null
          updated_at?: string
          user_id: string
          valor?: number | null
        }
        Update: {
          categoria_id?: string | null
          centro_custo_id?: string | null
          company_id?: string | null
          conta_destino_id?: string | null
          conta_id?: string | null
          created_at?: string
          data_fim?: string | null
          data_inicio?: string
          deleted_at?: string | null
          descricao?: string | null
          frequencia?: string
          id?: string
          socio_id?: string | null
          subtipo?: string | null
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
            foreignKeyName: "regras_recorrencia_centro_custo_id_fkey"
            columns: ["centro_custo_id"]
            isOneToOne: false
            referencedRelation: "centros_custo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "regras_recorrencia_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "regras_recorrencia_conta_destino_id_fkey"
            columns: ["conta_destino_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "regras_recorrencia_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "regras_recorrencia_socio_id_fkey"
            columns: ["socio_id"]
            isOneToOne: false
            referencedRelation: "socios"
            referencedColumns: ["id"]
          },
        ]
      }
      reservas: {
        Row: {
          automatico: boolean | null
          categorias_especificas: string[] | null
          company_id: string | null
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
          company_id?: string | null
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
          company_id?: string | null
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
            foreignKeyName: "reservas_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
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
          company_id: string | null
          created_at: string | null
          deleted_at: string | null
          email: string | null
          id: string
          nome: string
          participacao: number
          pro_labore: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ativo?: boolean | null
          company_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          id?: string
          nome: string
          participacao?: number
          pro_labore?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          ativo?: boolean | null
          company_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          id?: string
          nome?: string
          participacao?: number
          pro_labore?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "socios_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      transferencias: {
        Row: {
          company_id: string | null
          created_at: string | null
          deleted_at: string | null
          destino_lancamento_id: string | null
          id: string
          origem_lancamento_id: string | null
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          destino_lancamento_id?: string | null
          id?: string
          origem_lancamento_id?: string | null
          user_id?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          destino_lancamento_id?: string | null
          id?: string
          origem_lancamento_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transferencias_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
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
      users_companies: {
        Row: {
          company_id: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      vector_soluv: {
        Row: {
          company_id: string | null
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vector_soluv_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      vw_dashboard_resumo: {
        Row: {
          ano: number | null
          company_id: string | null
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
        Relationships: [
          {
            foreignKeyName: "lancamentos_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_dre: {
        Row: {
          ano: number | null
          categoria_nome: string | null
          classificacao_dre: string | null
          company_id: string | null
          mes: number | null
          subgrupo: string | null
          tipo_movimentacao: string | null
          user_id: string | null
          valor_total: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lancamentos_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      check_user_company_access: {
        Args: { check_company_id: string }
        Returns: boolean
      }
      check_user_is_company_admin: {
        Args: { check_company_id: string }
        Returns: boolean
      }
      is_month_closed: {
        Args: { target_month: number; target_year: number }
        Returns: boolean
      }
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
      sync_conta_saldo: { Args: { target_id: string }; Returns: undefined }
      sync_reserva_saldo: { Args: { target_id: string }; Returns: undefined }
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
