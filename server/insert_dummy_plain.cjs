const mysql = require('mysql2/promise');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'reforco_escolar',
});

async function insertDummy() {
  try {
    console.log('🚀 Limpando dados antigos e iniciando inserção...');
    
    // Pegar o ID do usuário pelo email
    const [userRows] = await pool.query('SELECT id FROM usuarios WHERE email = ?', ['eobneto@gmail.com']);
    if (userRows.length === 0) {
      console.error('❌ Usuário eobneto@gmail.com não encontrado.');
      process.exit(1);
    }
    const userId = userRows[0].id;

    // Limpar dados anteriores para este usuário
    await pool.query('DELETE FROM alunos WHERE user_id = ?', [userId]);
    await pool.query('DELETE FROM turmas WHERE user_id = ?', [userId]);
    console.log('✅ Dados antigos removidos.');
    
    const turmas = [
      { nome: 'Matemática Avançada', professor: 'Prof. Carlos Alberto', horario: 'Segunda e Quarta - 14:00', sala: 'Sala 01', cap: 20 },
      { nome: 'Português e Redação', professor: 'Profa. Ana Beatriz', horario: 'Terça e Quinta - 15:30', sala: 'Sala 02', cap: 25 },
      { nome: 'Inglês Iniciante', professor: 'Prof. Ricardo Mendes', horario: 'Sexta - 10:00', sala: 'Sala 03', cap: 15 }
    ];

    for (const t of turmas) {
      await pool.query(
        'INSERT INTO turmas (id, user_id, nome, professor, horario, sala, capacidade, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [crypto.randomUUID(), userId, t.nome, t.professor, t.horario, t.sala, t.cap, 'ATIVA']
      );
    }
    console.log('✅ 3 Turmas inseridas.');

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
      const turmaIndex = Math.floor(i / 15);
      const turmaNome = turmas[turmaIndex].nome;
      const mensalidade = 150 + Math.floor(Math.random() * 150);
      const vencimento = (5 + (i % 3) * 5).toString();

      await pool.query(
        'INSERT INTO alunos (id, user_id, nome, turma, status, email, data_nascimento, nome_responsavel, telefone_responsavel, valor_mensalidade, vencimento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          crypto.randomUUID(), 
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
  } catch (err) {
    console.error('❌ Erro na inserção:', err.message);
    process.exit(1);
  }
}

insertDummy();
