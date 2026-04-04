// 2. Mapeador de Dados
// Mapeia os dados do sistema para o formato do Supabase e vice-versa

export const MapeadorDeDados = {
  paraSupabaseAluno: (alunoLocal: any) => {
    return {
      nome: alunoLocal.name,
      turma: alunoLocal.turma,
      status: alunoLocal.status,
      data_nascimento: alunoLocal.dataNascimento,
      nome_responsavel: alunoLocal.nomeResponsavel,
      telefone_responsavel: alunoLocal.telefoneResponsavel,
      email: alunoLocal.email,
      valor_mensalidade: alunoLocal.valorMensalidade,
      vencimento: alunoLocal.vencimento
    };
  },

  paraSistemaAluno: (alunoSupabase: any) => {
    return {
      id: alunoSupabase.id,
      name: alunoSupabase.nome || 'Sem Nome',
      turma: alunoSupabase.turma || 'Sem Turma',
      status: alunoSupabase.status || 'ATIVO',
      email: alunoSupabase.email || '',
      dataNascimento: alunoSupabase.data_nascimento || '',
      nomeResponsavel: alunoSupabase.nome_responsavel || '',
      telefoneResponsavel: alunoSupabase.telefone_responsavel || '',
      valorMensalidade: alunoSupabase.valor_mensalidade || '',
      vencimento: alunoSupabase.vencimento || ''
    };
  }
};
