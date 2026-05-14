import { pool } from './db';
import { v4 as uuidv4 } from 'uuid';

async function insertDummy() {
  try {
    console.log('🚀 Iniciando inserção de dados dummy...');
    
    // 3 Turmas
    const turmas = [
      { nome: 'Matemática Avançada', professor: 'Prof. Carlos Alberto', horario: 'Segunda e Quarta - 14:00', sala: 'Sala 01', cap: 20 },
      { nome: 'Português e Redação', professor: 'Profa. Ana Beatriz', horario: 'Terça e Quinta - 15:30', sala: 'Sala 02', cap: 25 },
      { nome: 'Inglês Iniciante', professor: 'Prof. Ricardo Mendes', horario: 'Sexta - 10:00', sala: 'Sala 03', cap: 15 }
    ];

    for (const t of turmas) {
      await pool.query(
        'INSERT INTO turmas (id, user_id, nome, professor, horario, sala, capacidade, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [uuidv4(), 1, t.nome, t.professor, t.horario, t.sala, t.cap, 'ATIVA']
      );
    }
    console.log('✅ 3 Turmas inseridas.');

    // 45 Alunos
    const nomes = [
      'Alice Silva Ferreira', 'Bernardo Santos Oliveira', 'Caio Souza Lima', 'Davi Lucca Rocha', 'Enzo Gabriel Costa',
      'Felipe Augusto Martins', 'Giovanna Melo Ramos', 'Heitor Vinícius Souza', 'Isabella Beatriz Lima', 'João Pedro Carvalho',
      'Kauan Henrique Silva', 'Laura Sofia Mendes', 'Miguel Arcanjo Neves', 'Nicolas Teodoro Paz', 'Otávio Augusto Reis',
      'Pietro Valentim Luz', 'Queila Cristina Dias', 'Rafaela Vitória Cruz', 'Samuel Isaac Farias', 'Talita Maria Gomes',
      'Uriel Benício Leite', 'Valentina Rosa Flor', 'Wagner Luiz Santos', 'Xavier Junior Neto', 'Yara Sofia Branco',
      'Zeca Pagodinho Filho', 'Arthur Silva Rocha', 'Beatriz Lima Sousa', 'Caio Cesar Pereira', 'Daniela Maria Paz',
      'Eduarda Sofia Luz', 'Francisco Bento Gil', 'Geraldo Alckmin Jr', 'Heloísa Helena Paz', 'Iago Oliveira Santos',
      'Júlia Gabriela Lima', 'Kleber Machado Neto', 'Lorena Sofia Rocha', 'Manuela Maria Lima', 'Nathan Henrique Paz',
      'Olivia Sofia Luz', 'Paulo Henrique Gil', 'Rosa Maria Paz', 'Silas Malafaia Jr', 'Theo Gabriel Lima'
    ];

    for (let i = 0; i < nomes.length; i++) {
      const turmaIndex = Math.floor(i / 15); // Distribui 15 por turma
      const turmaNome = turmas[turmaIndex].nome;
      const mensalidade = 150 + Math.floor(Math.random() * 150);
      const vencimento = (5 + (i % 3) * 5).toString();

      await pool.query(
        'INSERT INTO alunos (id, user_id, nome, turma, status, email, data_nascimento, nome_responsavel, telefone_responsavel, valor_mensalidade, vencimento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          uuidv4(), 
          1, 
          nomes[i], 
          turmaNome, 
          'ATIVO', 
          `${nomes[i].toLowerCase().replace(/ /g, '.')}@email.com`,
          '2012-01-01',
          'Responsável Exemplo',
          '(11) 99999-9999',
          mensalidade,
          vencimento
        ]
      );
    }
    console.log('✅ 45 Alunos inseridos.');
    
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Erro na inserção:', err.message);
    process.exit(1);
  }
}

insertDummy();
