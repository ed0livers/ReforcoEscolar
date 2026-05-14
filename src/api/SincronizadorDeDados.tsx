import { useState, useEffect, useCallback } from 'react';
import { ConectorAPI, checkConnection } from './ConectorAPI';
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
  const sincronizar = useCallback(async () => {
    setIsSyncing(true);

    const isConnected = await verificarConexao();
    if (!isConnected) {
      setIsSyncing(false);
      return;
    }

    try {
      const { data: { user } } = await ConectorAPI.auth.getUser();
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
        ConectorAPI.from('alunos').select('*').order('criado_em', { ascending: false }),
        ConectorAPI.from('professores').select('*').order('criado_em', { ascending: false }),
        ConectorAPI.from('materiais').select('*').order('criado_em', { ascending: false }),
        ConectorAPI.from('mensalidades').select('*').order('criado_em', { ascending: false }),
        ConectorAPI.from('turmas').select('*').order('criado_em', { ascending: true }),
        ConectorAPI.from('frequencias').select('*').order('data', { ascending: false }),
        ConectorAPI.from('configuracoes').select('*').maybeSingle(),
      ]);

      const alunosList     = Array.isArray(resAlunos.data) ? resAlunos.data : [];
      const profList       = Array.isArray(resProf.data) ? resProf.data : [];
      const matList        = Array.isArray(resMat.data) ? resMat.data : [];
      const mensList       = Array.isArray(resMens.data) ? resMens.data : [];
      const turmasList     = Array.isArray(resTurmas.data) ? resTurmas.data : [];
      const freqList       = Array.isArray(resFreq.data) ? resFreq.data : [];
      const configData     = resConf.data || { unit_name: 'Reforço Escolar', whatsapp: '' };

      setAlunos(alunosList);
      setProfessores(profList);
      setMateriais(matList);
      setMensalidades(mensList);
      setTurmas(turmasList);
      setFrequencias(freqList);
      setConfigs(configData);

      // Lógica de Geração Mensal Automática
      await gerarMensalidadesPendentes(alunosList, mensList, user.id);

      setLastSync(new Date());
      setConnectionError(false);
    } catch (error) {
      setConnectionError(true);
      console.error('Erro na sincronização:', error);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Função para garantir que todos os alunos tenham a mensalidade do mês atual gerada
  const gerarMensalidadesPendentes = async (listaAlunos: any[], listaMensalidades: any[], _userId: any) => {
    const today = new Date();
    const mesAtual = String(today.getMonth() + 1).padStart(2, '0');
    const anoAtual = today.getFullYear();
    const refAtual = `${mesAtual}/${anoAtual}`;

    const alunosAtivos = listaAlunos.filter(a => a.valor_mensalidade && parseFloat(a.valor_mensalidade) > 0);

    for (const aluno of alunosAtivos) {
      const jaExisteNoMes = listaMensalidades.some(m =>
        m.nome === aluno.nome && m.data && m.data.includes(refAtual)
      );

      if (!jaExisteNoMes) {
        console.log(`Gerando mensalidade de ${refAtual} para ${aluno.nome}`);
        await ConectorAPI.from('mensalidades').insert([{
          nome: aluno.nome,
          curso: aluno.turma || 'Reforço',
          valor: `R$ ${aluno.valor_mensalidade}`,
          data: `${aluno.vencimento || '10'}/${refAtual}`,
          status: 'PENDENTE',
        }]);
      }
    }
  };

  // Funções Utilitárias para Mutar Dados
  const addAluno = async (aluno: any) => {
    try {
      const { data: newAluno, error } = await ConectorAPI.from('alunos').insert([{
        nome: aluno.nome || aluno.name,
        turma: aluno.turma,
        status: aluno.status,
        email: aluno.email,
        data_nascimento: aluno.data_nascimento || aluno.dataNascimento,
        nome_responsavel: aluno.nome_responsavel || aluno.nomeResponsavel,
        telefone_responsavel: aluno.telefone_responsavel || aluno.telefoneResponsavel,
        valor_mensalidade: aluno.valor_mensalidade || aluno.valorMensalidade,
        vencimento: aluno.vencimento,
      }]);

      if (error) {
        console.error('Erro ao inserir aluno:', error);
        alert(`Erro ao cadastrar aluno: ${error.message}`);
        return;
      }

      await sincronizar();
    } catch (err) {
      console.error(err);
    }
  };

  const updateAluno = async (id: string, novosDados: any) => {
    await ConectorAPI.from('alunos').eq('id', id).update(novosDados);
    sincronizar();
  };

  const deleteAluno = async (id: string) => {
    const { error } = await ConectorAPI.from('alunos').eq('id', id).delete();
    if (error) {
      console.error('Erro ao excluir aluno:', error);
      alert('Erro ao excluir aluno.');
    }
    sincronizar();
  };

  const updateProfessor = async (id: string, novosDados: any) => {
    await ConectorAPI.from('professores').eq('id', id).update(novosDados);
    sincronizar();
  };

  const deleteProfessor = async (id: string) => {
    await ConectorAPI.from('professores').eq('id', id).delete();
    sincronizar();
  };

  const addTurma = async (turmaData: any) => {
    try {
      const { error } = await ConectorAPI.from('turmas').insert([turmaData]);
      if (error) {
        console.error('Erro (Turma):', error);
        alert(`Erro ao salvar turma: ${error.message}`);
        return;
      }
      await sincronizar();
    } catch (err) {
      console.error('Erro Inesperado (Turma):', err);
      alert('Ocorreu um erro inesperado ao salvar a turma.');
    }
  };

  const updateTurma = async (id: string, novosDados: any) => {
    await ConectorAPI.from('turmas').eq('id', id).update(novosDados);
    sincronizar();
  };

  const deleteTurma = async (id: string) => {
    await ConectorAPI.from('turmas').eq('id', id).delete();
    sincronizar();
  };

  const updateMensalidadeStatus = async (id: string, novoStatus: string) => {
    await ConectorAPI.from('mensalidades').eq('id', id).update({ status: novoStatus });
    sincronizar();
  };

  const addProfessor = async (profData: any) => {
    await ConectorAPI.from('professores').insert([profData]);
    sincronizar();
  };

  const addMaterial = async (mat: any) => {
    await ConectorAPI.from('materiais').insert([mat]);
    sincronizar();
  };

  const registrarFrequencia = async (chamada: any[]) => {
    try {
      const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';
      const { getToken } = await import('./ConectorAPI');
      await fetch(`${BASE_URL}/api/frequencias`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(chamada),
      });
      sincronizar();
    } catch (err) {
      console.error('Erro ao registrar frequência:', err);
    }
  };

  const salvarConfigs = async (novasConfigs: any) => {
    await ConectorAPI.from('configuracoes').insert([novasConfigs]);
    sincronizar();
  };

  // Escutar mudanças de autenticação para limpar dados
  useEffect(() => {
    const { data: { subscription } } = ConectorAPI.auth.onAuthStateChange((event, session) => {
      if (!session) {
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
  }, [sincronizar]);

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
      <div className="fixed top-4 right-4 z-50 bg-white border border-red-200 p-4 rounded-lg shadow-lg flex items-center gap-3">
        <AlertCircle className="text-red-500 w-6 h-6" />
        <div className="flex flex-col">
          <span className="text-sm font-bold text-indigo-900">Erro de Conexão</span>
          <span className="text-xs opacity-70">Falha ao conectar com o servidor.</span>
        </div>
        <button
          onClick={sincronizar}
          className="ml-4 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-700 flex items-center gap-2 transition-all"
        >
          <RefreshCw className="w-3 h-3" /> Tentar
        </button>
      </div>
    );
  }

  if (isSyncing) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-white border border-indigo-100 p-4 rounded-lg shadow-lg flex items-center gap-3">
        <Loader2 className="text-indigo-600 w-5 h-5 animate-spin" />
        <span className="text-sm font-bold text-indigo-900">Sincronizando dados...</span>
      </div>
    );
  }

  return null;
}
