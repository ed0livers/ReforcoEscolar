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

// GET /api/professores
router.get('/', auth, async (req: Request, res: Response) => {
  const [rows] = await pool.query(
    'SELECT * FROM professores WHERE user_id = ? ORDER BY criado_em DESC',
    [(req as any).userId]
  );
  res.json(rows);
});

// POST /api/professores
router.post('/', auth, async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { nome, email, telefone, disciplina, status } = req.body;

  const [result]: any = await pool.query(
    `INSERT INTO professores (user_id, nome, email, telefone, disciplina, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, nome, email, telefone, disciplina, status || 'ATIVO']
  );

  const [rows] = await pool.query('SELECT * FROM professores WHERE id = ?', [result.insertId]);
  res.status(201).json((rows as any[])[0]);
});

// PATCH /api/professores/:id
router.patch('/:id', auth, async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { id } = req.params;
  const fields = req.body;

  const updates = Object.keys(fields).map(k => `${k} = ?`).join(', ');
  const values  = [...Object.values(fields), id, userId];

  await pool.query(
    `UPDATE professores SET ${updates} WHERE id = ? AND user_id = ?`,
    values
  );
  res.json({ success: true });
});

// DELETE /api/professores/:id
router.delete('/:id', auth, async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  await pool.query('DELETE FROM professores WHERE id = ? AND user_id = ?', [req.params.id, userId]);
  res.json({ success: true });
});

export default router;
