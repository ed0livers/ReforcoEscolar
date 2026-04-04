import { useState, useEffect } from 'react';
import { ConectorSupabase, checkConnection } from './ConectorSupabase';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export function useSincronizador() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // States for DB contents
  const [alunos, setAlunos] = useState<any[]>([]);
  const [professores, setProfessores] = useState<any[]>([]);
  const [materiais, setMateriais] = useState<any[]>([]);
  const [mensalidades, setMensalidades] = useState<any[]>([]);
  const [turmas, setTurmas] = useState<any[]>([]);
  const [frequencias, setFrequencias] = useState<any[]>([]);
  const [configs, setConfigs] = useState<any>(null);

  // 1. Verificar conexão ao iniciar
  const verificarConexao = async () => {
    const isConnected = await checkConnection();
    setConnectionError(!isConnected);
    return isConnected;
  };

  // Sincronizar dados centralizado
  const sincronizar = async () => {
    setIsSyncing(true);
    
    const isConnected = await verificarConexao();
    if (!isConnected) {
      setIsSyncing(false);
      return;
    }

    try {
      const { data: { user } } = await ConectorSupabase.auth.getUser();
      if (!user) {
        setIsSyncing(false);
        return;
      }

      const [
        resAlunos,
        resProf,
        resMat,
        resMens,
        resTurmas,
        resFreq,
        resConf
      ] = await Promise.all([
        ConectorSupabase.from('alunos').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        ConectorSupabase.from('professores').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        ConectorSupabase.from('materiais').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        ConectorSupabase.from('mensalidades').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        ConectorSupabase.from('turmas').select('*').eq('user_id', user.id).order('created_at', { ascending: true }),
        ConectorSupabase.from('frequencias').select('*').eq('user_id', user.id).order('data', { ascending: false }),
        ConectorSupabase.from('configuracoes').select('*').eq('user_id', user.id).maybeSingle()
      ]);

      if (resAlunos.error) throw resAlunos.error;
      if (resProf.error) throw resProf.error;
      if (resMat.error) throw resMat.error;
      if (resMens.error) throw resMens.error;
      if (resTurmas.error) throw resTurmas.error;
      
      setAlunos(resAlunos.data || []);
      setProfessores(resProf.data || []);
      setMateriais(resMat.data || []);
      setMensalidades(resMens.data || []);
      setTurmas(resTurmas.data || []);
      setFrequencias(resFreq.data || []);
      setConfigs(resConf.data || { unit_name: 'Reforço Escolar', whatsapp: '' });

      // Lógica de Geração Mensal Automática
      await gerarMensalidadesPendentes(resAlunos.data || [], resMens.data || [], user.id);

      setLastSync(new Date());
      setConnectionError(false);
    } catch (error) {
      setConnectionError(true);
      console.error("Erro na sincronização:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Função para garantir que todos os alunos tenham a mensalidade do mês atual gerada
  const gerarMensalidadesPendentes = async (listaAlunos: any[], listaMensalidades: any[], userId: string) => {
    const today = new Date();
    const mesAtual = String(today.getMonth() + 1).padStart(2, '0');
    const anoAtual = today.getFullYear();
    const refAtual = `${mesAtual}/${anoAtual}`; // Ex: "04/2026"

    const alunosAtivos = listaAlunos.filter(a => a.valor_mensalidade && parseFloat(a.valor_mensalidade) > 0);

    for (const aluno of alunosAtivos) {
      const jaExisteNoMes = listaMensalidades.some(m => 
        m.nome === aluno.nome && m.data.includes(refAtual)
      );

      if (!jaExisteNoMes) {
        console.log(`Gerando mensalidade de ${refAtual} para ${aluno.nome}`);
        await ConectorSupabase.from('mensalidades').insert([{
          nome: aluno.nome,
          curso: aluno.turma || 'Reforço',
          valor: `R$ ${aluno.valor_mensalidade}`,
          data: `${aluno.vencimento || '10'}/${refAtual}`,
          status: 'PENDENTE',
          user_id: userId
        }]);
      }
    }
  };

  // Funções Utilitárias para Mutar Dados
  const addAluno = async (aluno: any) => {
    try {
      const { data: { user } } = await ConectorSupabase.auth.getUser();
      if (!user) return;

      const { data: newAluno, error: errorAluno } = await ConectorSupabase
        .from('alunos')
        .insert([{
          ...aluno,
          user_id: user.id,
          matricula: `#${Math.floor(1000 + Math.random() * 9000)}` 
        }])
        .select();

      if (errorAluno) { 
        console.error("Erro ao inserir aluno:", errorAluno); 
        alert(`Erro ao cadastrar aluno: ${errorAluno.message}`);
        return; 
      }
      
      await sincronizar();
    } catch (err) {
      console.error(err);
    }
  };

  const updateAluno = async (id: string, novosDados: any) => {
    const { data: { user } } = await ConectorSupabase.auth.getUser();
    if (!user) return;
    await ConectorSupabase.from('alunos').update(novosDados).eq('id', id).eq('user_id', user.id);
    sincronizar();
  };

  const deleteAluno = async (id: string) => {
    const { data: { user } } = await ConectorSupabase.auth.getUser();
    if (!user) return;
    const { error } = await ConectorSupabase.from('alunos').delete().eq('id', id).eq('user_id', user.id);
    if (error) {
      console.error("Erro ao excluir aluno:", error);
      alert("Erro ao excluir aluno.");
    }
    sincronizar();
  };

  const updateProfessor = async (id: string, novosDados: any) => {
    const { data: { user } } = await ConectorSupabase.auth.getUser();
    if (!user) return;
    await ConectorSupabase.from('professores').update(novosDados).eq('id', id).eq('user_id', user.id);
    sincronizar();
  };

  const deleteProfessor = async (id: string) => {
    const { data: { user } } = await ConectorSupabase.auth.getUser();
    if (!user) return;
    await ConectorSupabase.from('professores').delete().eq('id', id).eq('user_id', user.id);
    sincronizar();
  };

  const addTurma = async (turmaData: any) => {
    try {
      const { data: { user } } = await ConectorSupabase.auth.getUser();
      if (!user) return;

      const { error } = await ConectorSupabase.from('turmas').insert([{ 
        ...turmaData, 
        user_id: user.id 
      }]);

      if (error) {
        console.error("Erro Supabase (Turma):", error);
        alert(`Erro ao salvar turma: ${error.message} (Verifique se a coluna user_id existe no banco)`);
        return;
      }

      await sincronizar();
    } catch (err) {
      console.error("Erro Inesperado (Turma):", err);
      alert("Ocorreu um erro inesperado ao salvar a turma.");
    }
  };

  const updateTurma = async (id: string, novosDados: any) => {
    const { data: { user } } = await ConectorSupabase.auth.getUser();
    if (!user) return;
    await ConectorSupabase.from('turmas').update(novosDados).eq('id', id).eq('user_id', user.id);
    sincronizar();
  };

  const deleteTurma = async (id: string) => {
    const { data: { user } } = await ConectorSupabase.auth.getUser();
    if (!user) return;
    await ConectorSupabase.from('turmas').delete().eq('id', id).eq('user_id', user.id);
    sincronizar();
  };

  const updateMensalidadeStatus = async (id: string, novoStatus: string) => {
    const { data: { user } } = await ConectorSupabase.auth.getUser();
    if (!user) return;
    await ConectorSupabase.from('mensalidades').update({ status: novoStatus }).eq('id', id).eq('user_id', user.id);
    sincronizar();
  };

  const addProfessor = async (profData: any) => {
    const { data: { user } } = await ConectorSupabase.auth.getUser();
    if (!user) return;
    await ConectorSupabase.from('professores').insert([{ ...profData, user_id: user.id }]);
    sincronizar();
  };

  const addMaterial = async (mat: any) => {
    const { data: { user } } = await ConectorSupabase.auth.getUser();
    if (!user) return;
    await ConectorSupabase.from('materiais').insert([{ ...mat, user_id: user.id }]);
    sincronizar();
  };

  const registrarFrequencia = async (chamada: any[]) => {
    const { data: { user } } = await ConectorSupabase.auth.getUser();
    if (!user) return;
    const body = chamada.map(c => ({ ...c, user_id: user.id }));
    await ConectorSupabase.from('frequencias').insert(body);
    sincronizar();
  };

  const salvarConfigs = async (novasConfigs: any) => {
    const { data: { user } } = await ConectorSupabase.auth.getUser();
    if (!user) return;
    
    if (configs?.id) {
       await ConectorSupabase.from('configuracoes').update(novasConfigs).eq('id', configs.id);
    } else {
       await ConectorSupabase.from('configuracoes').insert([{ ...novasConfigs, user_id: user.id }]);
    }
    sincronizar();
  };

  // Escutar mudanças de autenticação para limpar dados ou re-sincronizar
  useEffect(() => {
    const { data: { subscription } } = ConectorSupabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        sincronizar(); // Login ou Token renovado: Sincroniza novos dados
      } else {
        // Logout: Limpa todos os estados locais para evitar vazamento de dados
        setAlunos([]);
        setProfessores([]);
        setMateriais([]);
        setMensalidades([]);
        setTurmas([]);
        setFrequencias([]);
        setConfigs(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sincronizar em intervalos regulares (a cada 5 minutos)
  useEffect(() => {
    sincronizar(); // Puxada Inicial

    const interval = setInterval(() => {
      sincronizar();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { 
    isSyncing, connectionError, lastSync, sincronizar, 
    alunos, professores, materiais, mensalidades, turmas, frequencias, configs,
    addAluno, updateAluno, deleteAluno, 
    addProfessor, updateProfessor, deleteProfessor, 
    addMaterial, updateMensalidadeStatus,
    addTurma, updateTurma, deleteTurma,
    registrarFrequencia, salvarConfigs
  };
}

// UI de Sincronização e Erro
export const SyncStatusUI = ({ isSyncing, connectionError, sincronizar }: any) => {
  if (connectionError) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-secondary border border-red-200 p-4 rounded-lg shadow-lg flex items-center gap-3">
        <AlertCircle className="text-red-500 w-6 h-6" />
        <div className="flex flex-col">
          <span className="text-sm font-bold text-foreground">Erro de Conexão</span>
          <span className="text-xs opacity-70">Falha ao conectar com Supabase.</span>
        </div>
        <button 
          onClick={sincronizar}
          className="ml-4 bg-primary text-secondary px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-90 flex items-center gap-2"
        >
          <RefreshCw className="w-3 h-3" /> Tentar
        </button>
      </div>
    );
  }

  if (isSyncing) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-secondary border border-primary/20 p-4 rounded-lg shadow-lg flex items-center gap-3">
        <Loader2 className="text-primary w-5 h-5 animate-spin" />
        <span className="text-sm font-bold text-foreground">Sincronizando dados...</span>
      </div>
    );
  }

  return null;
}
