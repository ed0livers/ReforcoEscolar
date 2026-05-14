import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../db';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'reforco_escolar_secret_key_2024';

function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido.' });
  try {
    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);
    (req as any).userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido.' });
  }
}

// GET /api/frequencias
router.get('/', auth, async (req: Request, res: Response) => {
  const [rows] = await pool.query(
    'SELECT * FROM frequencias WHERE user_id = ? ORDER BY data DESC',
    [(req as any).userId]
  );
  res.json(rows);
});

// POST /api/frequencias (bulk insert/update de chamada)
router.post('/', auth, async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const chamada: any[] = req.body;

  if (!Array.isArray(chamada) || chamada.length === 0) {
    return res.status(400).json({ error: 'Corpo inválido.' });
  }

  try {
    // Usamos uma transação ou loop para garantir integridade com ON DUPLICATE KEY UPDATE
    for (const c of chamada) {
      await pool.query(
        `INSERT INTO frequencias (user_id, aluno_id, turma_id, aluno_nome, turma_nome, data, presente)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
            presente = VALUES(presente),
            aluno_nome = VALUES(aluno_nome),
            turma_nome = VALUES(turma_nome)`,
        [userId, c.aluno_id, c.turma_id, c.aluno_nome, c.turma_nome, c.data, c.presente ? 1 : 0]
      );
    }

    res.status(201).json({ success: true });
  } catch (err: any) {
    console.error('Erro ao salvar frequência:', err);
    res.status(500).json({ error: 'Erro interno ao salvar frequência.' });
  }
});

export default router;
