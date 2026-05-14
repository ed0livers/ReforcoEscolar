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

// GET /api/turmas
router.get('/', auth, async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  console.log(`🔍 [GET /api/turmas] Buscando turmas para o usuário ID: ${userId}`);
  const [rows]: any = await pool.query(
    'SELECT * FROM turmas WHERE user_id = ? ORDER BY criado_em ASC',
    [userId]
  );
  console.log(`✅ [GET /api/turmas] Retornadas ${rows.length} turmas.`);
  res.json(rows);
});

// POST /api/turmas
router.post('/', auth, async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { nome, professor, horario, sala, capacidade, status } = req.body;

  await pool.query(
    `INSERT INTO turmas (user_id, nome, professor, horario, sala, capacidade, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, nome, professor, horario, sala, capacidade || 30, status || 'ATIVA']
  );

  const [rows] = await pool.query(
    'SELECT * FROM turmas WHERE user_id = ? ORDER BY criado_em ASC',
    [userId]
  );
  res.status(201).json((rows as any[]));
});

// PATCH /api/turmas/:id
router.patch('/:id', auth, async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { id } = req.params;
  const fields = req.body;

  const updates = Object.keys(fields).map(k => `${k} = ?`).join(', ');
  const values  = [...Object.values(fields), id, userId];

  await pool.query(
    `UPDATE turmas SET ${updates} WHERE id = ? AND user_id = ?`,
    values
  );
  res.json({ success: true });
});

// DELETE /api/turmas/:id
router.delete('/:id', auth, async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  await pool.query('DELETE FROM turmas WHERE id = ? AND user_id = ?', [req.params.id, userId]);
  res.json({ success: true });
});

export default router;
