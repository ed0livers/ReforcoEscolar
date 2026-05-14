import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../db';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'reforco_escolar_secret_key_2024';

// Middleware de autenticação
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

// GET /api/alunos
router.get('/', auth, async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  console.log(`🔍 [GET /api/alunos] Buscando alunos para o usuário ID: ${userId}`);
  
  const [rows]: any = await pool.query(
    'SELECT * FROM alunos WHERE user_id = ? ORDER BY criado_em DESC',
    [userId]
  );
  
  console.log(`✅ [GET /api/alunos] Retornados ${rows.length} alunos.`);
  res.json(rows);
});

// POST /api/alunos
router.post('/', auth, async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { nome, turma, status, email, data_nascimento, nome_responsavel,
          telefone_responsavel, valor_mensalidade, vencimento } = req.body;
  const matricula = `#${Math.floor(1000 + Math.random() * 9000)}`;

  const [result]: any = await pool.query(
    `INSERT INTO alunos 
      (user_id, nome, turma, status, email, data_nascimento, nome_responsavel, 
       telefone_responsavel, valor_mensalidade, vencimento, matricula)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, nome, turma, status || 'ATIVO', email, data_nascimento,
     nome_responsavel, telefone_responsavel, valor_mensalidade, vencimento, matricula]
  );

  const [rows] = await pool.query('SELECT * FROM alunos WHERE id = ?', [result.insertId]);
  res.status(201).json((rows as any[])[0]);
});

// PATCH /api/alunos/:id
router.patch('/:id', auth, async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { id } = req.params;
  const fields = req.body;

  const updates = Object.keys(fields).map(k => `${k} = ?`).join(', ');
  const values  = [...Object.values(fields), id, userId];

  await pool.query(
    `UPDATE alunos SET ${updates} WHERE id = ? AND user_id = ?`,
    values
  );
  res.json({ success: true });
});

// DELETE /api/alunos/:id
router.delete('/:id', auth, async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  await pool.query('DELETE FROM alunos WHERE id = ? AND user_id = ?', [req.params.id, userId]);
  res.json({ success: true });
});

export default router;
