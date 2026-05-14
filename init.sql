-- ============================================================
-- init.sql — ReforçoEscolar
-- Script de inicialização do banco de dados MySQL
-- Execute: mysql -u root -p < init.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS reforco_escolar
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE reforco_escolar;

-- ------------------------------------------------------------
-- Tabela de Usuários (autenticação)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nome        VARCHAR(255)        NOT NULL,
  email       VARCHAR(255)        NOT NULL UNIQUE,
  senha_hash  VARCHAR(255)        NOT NULL,
  data_nasc   DATE,
  criado_em   DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado  DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabela de Alunos
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS alunos (
  id                   VARCHAR(36)  PRIMARY KEY DEFAULT (UUID()),
  user_id              INT          NOT NULL,
  nome                 VARCHAR(255) NOT NULL,
  turma                VARCHAR(255),
  status               VARCHAR(50)  NOT NULL DEFAULT 'ATIVO',
  email                VARCHAR(255),
  data_nascimento      DATE,
  nome_responsavel     VARCHAR(255),
  telefone_responsavel VARCHAR(50),
  valor_mensalidade    DECIMAL(10,2),
  vencimento           VARCHAR(10),
  matricula            VARCHAR(20),
  criado_em            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabela de Professores
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS professores (
  id          VARCHAR(36)  PRIMARY KEY DEFAULT (UUID()),
  user_id     INT          NOT NULL,
  nome        VARCHAR(255) NOT NULL,
  email       VARCHAR(255),
  telefone    VARCHAR(50),
  disciplina  VARCHAR(255),
  status      VARCHAR(50)  NOT NULL DEFAULT 'ATIVO',
  criado_em   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabela de Turmas
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS turmas (
  id          VARCHAR(36)  PRIMARY KEY DEFAULT (UUID()),
  user_id     INT          NOT NULL,
  nome        VARCHAR(255) NOT NULL,
  professor   VARCHAR(255),
  horario     VARCHAR(255),
  sala        VARCHAR(100),
  capacidade  INT          DEFAULT 30,
  status      VARCHAR(50)  NOT NULL DEFAULT 'ATIVA',
  criado_em   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabela de Materiais
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS materiais (
  id          VARCHAR(36)  PRIMARY KEY DEFAULT (UUID()),
  user_id     INT          NOT NULL,
  nome        VARCHAR(255) NOT NULL,
  tipo        VARCHAR(100),
  turma       VARCHAR(255),
  descricao   TEXT,
  url         VARCHAR(500),
  criado_em   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabela de Mensalidades
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mensalidades (
  id          VARCHAR(36)  PRIMARY KEY DEFAULT (UUID()),
  user_id     INT          NOT NULL,
  nome        VARCHAR(255) NOT NULL,
  curso       VARCHAR(255),
  valor       VARCHAR(50),
  data        VARCHAR(20),
  status      VARCHAR(50)  NOT NULL DEFAULT 'PENDENTE',
  criado_em   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabela de Frequências
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS frequencias (
  id          VARCHAR(36)  PRIMARY KEY DEFAULT (UUID()),
  user_id     INT          NOT NULL,
  aluno_id    VARCHAR(36),
  turma_id    VARCHAR(36),
  aluno_nome  VARCHAR(255),
  turma_nome  VARCHAR(255),
  data        DATE         NOT NULL,
  presente    TINYINT(1)   NOT NULL DEFAULT 0,
  criado_em   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabela de Configurações
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS configuracoes (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT          NOT NULL UNIQUE,
  unit_name   VARCHAR(255) NOT NULL DEFAULT 'Reforço Escolar',
  whatsapp    VARCHAR(50),
  atualizado  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;
