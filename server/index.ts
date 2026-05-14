import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './db';

// Rotas
import authRoutes from './auth';
import alunosRoutes from './routes/alunos';
import professoresRoutes from './routes/professores';
import turmasRoutes from './routes/turmas';
import materiaisRoutes from './routes/materiais';
import mensalidadesRoutes from './routes/mensalidades';
import frequenciasRoutes from './routes/frequencias';
import configuracoesRoutes from './routes/configuracoes';

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

// Middlewares globais
app.use(cors({
  origin: '*', 
  credentials: true,
}));
app.use(express.json());

// Rotas da API
app.use('/api/auth',          authRoutes);
app.use('/api/alunos',        alunosRoutes);
app.use('/api/professores',   professoresRoutes);
app.use('/api/turmas',        turmasRoutes);
app.use('/api/materiais',     materiaisRoutes);
app.use('/api/mensalidades',  mensalidadesRoutes);
app.use('/api/frequencias',   frequenciasRoutes);
app.use('/api/configuracoes', configuracoesRoutes);

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Inicializar servidor
app.listen(PORT, async () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log('📡 Verificando conexão com o banco de dados...');
  await testConnection();
  console.log('✅ Backend pronto!\n');
});

export default app;
