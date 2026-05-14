-- ============================================================
-- Inserts Dummy para ReforçoEscolar (Usuário ID: 1)
-- ============================================================

USE reforco_escolar;

-- ------------------------------------------------------------
-- Turmas (3)
-- ------------------------------------------------------------
INSERT INTO turmas (id, user_id, nome, professor, horario, sala, capacidade, status) VALUES
(UUID(), 1, 'Matemática Avançada', 'Prof. Carlos Alberto', 'Segunda e Quarta - 14:00', 'Sala 01', 20, 'ATIVA'),
(UUID(), 1, 'Português e Redação', 'Profa. Ana Beatriz', 'Terça e Quinta - 15:30', 'Sala 02', 25, 'ATIVA'),
(UUID(), 1, 'Inglês Iniciante', 'Prof. Ricardo Mendes', 'Sexta - 10:00', 'Sala 03', 15, 'ATIVA');

-- ------------------------------------------------------------
-- Alunos (45)
-- ------------------------------------------------------------
INSERT INTO alunos (id, user_id, nome, turma, status, email, data_nascimento, nome_responsavel, telefone_responsavel, valor_mensalidade, vencimento) VALUES
(UUID(), 1, 'Alice Silva Ferreira', 'Matemática Avançada', 'ATIVO', 'alice.ferreira@email.com', '2012-05-14', 'Marta Silva', '(11) 98877-6655', 250.00, '5'),
(UUID(), 1, 'Bernardo Santos Oliveira', 'Matemática Avançada', 'ATIVO', 'bernardo.oliveira@email.com', '2013-02-20', 'João Oliveira', '(11) 97766-5544', 250.00, '5'),
(UUID(), 1, 'Caio Souza Lima', 'Matemática Avançada', 'ATIVO', 'caio.lima@email.com', '2012-11-30', 'Sandra Souza', '(11) 96655-4433', 250.00, '10'),
(UUID(), 1, 'Davi Lucca Rocha', 'Matemática Avançada', 'ATIVO', 'davi.rocha@email.com', '2014-08-05', 'Pedro Rocha', '(11) 95544-3322', 250.00, '10'),
(UUID(), 1, 'Enzo Gabriel Costa', 'Matemática Avançada', 'ATIVO', 'enzo.costa@email.com', '2013-06-12', 'Luciana Costa', '(11) 94433-2211', 250.00, '15'),
(UUID(), 1, 'Felipe Augusto Martins', 'Matemática Avançada', 'ATIVO', 'felipe.martins@email.com', '2012-01-25', 'Marcos Martins', '(11) 93322-1100', 250.00, '15'),
(UUID(), 1, 'Giovanna Melo Ramos', 'Matemática Avançada', 'ATIVO', 'giovanna.ramos@email.com', '2014-04-02', 'Carla Melo', '(11) 92211-0099', 250.00, '5'),
(UUID(), 1, 'Heitor Vinícius Souza', 'Matemática Avançada', 'ATIVO', 'heitor.souza@email.com', '2013-09-18', 'Renato Souza', '(11) 91100-9988', 250.00, '5'),
(UUID(), 1, 'Isabella Beatriz Lima', 'Matemática Avançada', 'ATIVO', 'isabella.lima@email.com', '2012-12-25', 'Cláudia Lima', '(11) 90099-8877', 250.00, '10'),
(UUID(), 1, 'João Pedro Carvalho', 'Matemática Avançada', 'ATIVO', 'joao.carvalho@email.com', '2013-03-10', 'Antônio Carvalho', '(11) 99988-7766', 250.00, '10'),
(UUID(), 1, 'Kauan Henrique Silva', 'Matemática Avançada', 'ATIVO', 'kauan.silva@email.com', '2014-07-22', 'Fernanda Silva', '(11) 98877-6655', 250.00, '15'),
(UUID(), 1, 'Laura Sofia Mendes', 'Matemática Avançada', 'ATIVO', 'laura.mendes@email.com', '2012-08-14', 'Patrícia Mendes', '(11) 97766-5544', 250.00, '15'),
(UUID(), 1, 'Miguel Arcanjo Neves', 'Matemática Avançada', 'ATIVO', 'miguel.neves@email.com', '2013-05-30', 'Roberto Neves', '(11) 96655-4433', 250.00, '5'),
(UUID(), 1, 'Nicolas Teodoro Paz', 'Matemática Avançada', 'ATIVO', 'nicolas.paz@email.com', '2014-11-12', 'Sônia Teodoro', '(11) 95544-3322', 250.00, '5'),
(UUID(), 1, 'Otávio Augusto Reis', 'Matemática Avançada', 'ATIVO', 'otavio.reis@email.com', '2012-04-05', 'Vânia Reis', '(11) 94433-2211', 250.00, '10'),
(UUID(), 1, 'Pietro Valentim Luz', 'Português e Redação', 'ATIVO', 'pietro.luz@email.com', '2013-10-20', 'Marcia Luz', '(11) 93322-1100', 220.00, '5'),
(UUID(), 1, 'Queila Cristina Dias', 'Português e Redação', 'ATIVO', 'queila.dias@email.com', '2014-01-15', 'Jorge Dias', '(11) 92211-0099', 220.00, '5'),
(UUID(), 1, 'Rafaela Vitória Cruz', 'Português e Redação', 'ATIVO', 'rafaela.cruz@email.com', '2012-06-30', 'Eliane Cruz', '(11) 91100-9988', 220.00, '10'),
(UUID(), 1, 'Samuel Isaac Farias', 'Português e Redação', 'ATIVO', 'samuel.farias@email.com', '2013-11-22', 'Wilson Farias', '(11) 90099-8877', 220.00, '10'),
(UUID(), 1, 'Talita Maria Gomes', 'Português e Redação', 'ATIVO', 'talita.gomes@email.com', '2014-09-08', 'Gislaine Gomes', '(11) 99988-7766', 220.00, '15'),
(UUID(), 1, 'Uriel Benício Leite', 'Português e Redação', 'ATIVO', 'uriel.leite@email.com', '2012-02-14', 'Mauro Leite', '(11) 98877-6655', 220.00, '15'),
(UUID(), 1, 'Valentina Rosa Flor', 'Português e Redação', 'ATIVO', 'valentina.flor@email.com', '2013-07-25', 'Débora Flor', '(11) 97766-5544', 220.00, '5'),
(UUID(), 1, 'Wagner Luiz Santos', 'Português e Redação', 'ATIVO', 'wagner.santos@email.com', '2014-12-30', 'Luiz Santos', '(11) 96655-4433', 220.00, '5'),
(UUID(), 1, 'Xavier Junior Neto', 'Português e Redação', 'ATIVO', 'xavier.neto@email.com', '2012-03-18', 'Beatriz Neto', '(11) 95544-3322', 220.00, '10'),
(UUID(), 1, 'Yara Sofia Branco', 'Português e Redação', 'ATIVO', 'yara.branco@email.com', '2013-08-12', 'Aline Branco', '(11) 94433-2211', 220.00, '10'),
(UUID(), 1, 'Zeca Pagodinho Filho', 'Português e Redação', 'ATIVO', 'zeca.filho@email.com', '2014-05-02', 'Zeca Silva', '(11) 93322-1100', 220.00, '15'),
(UUID(), 1, 'Arthur Silva Rocha', 'Português e Redação', 'ATIVO', 'arthur.rocha@email.com', '2012-10-25', 'Carlos Rocha', '(11) 92211-0099', 220.00, '15'),
(UUID(), 1, 'Beatriz Lima Sousa', 'Português e Redação', 'ATIVO', 'beatriz.sousa@email.com', '2013-01-14', 'Regina Sousa', '(11) 91100-9988', 220.00, '5'),
(UUID(), 1, 'Caio Cesar Pereira', 'Português e Redação', 'ATIVO', 'caio.pereira@email.com', '2014-06-30', 'Mario Pereira', '(11) 90099-8877', 220.00, '5'),
(UUID(), 1, 'Daniela Maria Paz', 'Português e Redação', 'ATIVO', 'daniela.paz@email.com', '2012-11-22', 'Lia Paz', '(11) 99988-7766', 220.00, '10'),
(UUID(), 1, 'Eduarda Sofia Luz', 'Inglês Iniciante', 'ATIVO', 'eduarda.luz@email.com', '2013-09-08', 'Helena Luz', '(11) 98877-6655', 180.00, '5'),
(UUID(), 1, 'Francisco Bento Gil', 'Inglês Iniciante', 'ATIVO', 'francisco.gil@email.com', '2014-02-14', 'Joaquim Gil', '(11) 97766-5544', 180.00, '5'),
(UUID(), 1, 'Geraldo Alckmin Jr', 'Inglês Iniciante', 'ATIVO', 'geraldo.jr@email.com', '2012-07-25', 'Luiza Alckmin', '(11) 96655-4433', 180.00, '10'),
(UUID(), 1, 'Heloísa Helena Paz', 'Inglês Iniciante', 'ATIVO', 'heloisa.paz@email.com', '2013-12-30', 'Pedro Paz', '(11) 95544-3322', 180.00, '10'),
(UUID(), 1, 'Iago Oliveira Santos', 'Inglês Iniciante', 'ATIVO', 'iago.santos@email.com', '2014-03-18', 'Vera Oliveira', '(11) 94433-2211', 180.00, '15'),
(UUID(), 1, 'Júlia Gabriela Lima', 'Inglês Iniciante', 'ATIVO', 'julia.lima@email.com', '2012-08-12', 'Renata Lima', '(11) 93322-1100', 180.00, '15'),
(UUID(), 1, 'Kleber Machado Neto', 'Inglês Iniciante', 'ATIVO', 'kleber.neto@email.com', '2013-05-02', 'Kleber Silva', '(11) 92211-0099', 180.00, '5'),
(UUID(), 1, 'Lorena Sofia Rocha', 'Inglês Iniciante', 'ATIVO', 'lorena.rocha@email.com', '2014-10-25', 'Bruna Rocha', '(11) 91100-9988', 180.00, '5'),
(UUID(), 1, 'Manuela Maria Lima', 'Inglês Iniciante', 'ATIVO', 'manuela.lima@email.com', '2012-01-14', 'Davi Lima', '(11) 90099-8877', 180.00, '10'),
(UUID(), 1, 'Nathan Henrique Paz', 'Inglês Iniciante', 'ATIVO', 'nathan.paz@email.com', '2013-06-30', 'Igor Paz', '(11) 99988-7766', 180.00, '10'),
(UUID(), 1, 'Olivia Sofia Luz', 'Inglês Iniciante', 'ATIVO', 'olivia.luz@email.com', '2014-11-22', 'Sara Luz', '(11) 98877-6655', 180.00, '15'),
(UUID(), 1, 'Paulo Henrique Gil', 'Inglês Iniciante', 'ATIVO', 'paulo.gil@email.com', '2012-04-08', 'Tania Gil', '(11) 97766-5544', 180.00, '15'),
(UUID(), 1, 'Rosa Maria Paz', 'Inglês Iniciante', 'ATIVO', 'rosa.paz@email.com', '2013-09-14', 'Vitor Paz', '(11) 96655-4433', 180.00, '5'),
(UUID(), 1, 'Silas Malafaia Jr', 'Inglês Iniciante', 'ATIVO', 'silas.jr@email.com', '2014-02-25', 'Mara Malafaia', '(11) 95544-3322', 180.00, '5'),
(UUID(), 1, 'Theo Gabriel Lima', 'Inglês Iniciante', 'ATIVO', 'theo.lima@email.com', '2012-07-30', 'Guto Lima', '(11) 94433-2211', 180.00, '10');
