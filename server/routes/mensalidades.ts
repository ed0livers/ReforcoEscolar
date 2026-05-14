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

// GET /api/mensalidades
router.get('/', auth, async (req: Request, res: Response) => {
  const [rows] = await pool.query(
    'SELECT * FROM mensalidades WHERE user_id = ? ORDER BY criado_em DESC',
    [(req as any).userId]
  );
  res.json(rows);
});

// POST /api/mensalidades
router.post('/', auth, async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { nome, curso, valor, data, status } = req.body;

  const [result]: any = await pool.query(
    `INSERT INTO mensalidades (user_id, nome, curso, valor, data, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, nome, curso, valor, data, status || 'PENDENTE']
  );

  const [rows] = await pool.query('SELECT * FROM mensalidades WHERE id = ?', [result.insertId]);
  res.status(201).json((rows as any[])[0]);
});

// PATCH /api/mensalidades/:id/status
router.patch('/:id/status', auth, async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { status } = req.body;

  await pool.query(
    'UPDATE mensalidades SET status = ? WHERE id = ? AND user_id = ?',
    [status, req.params.id, userId]
  );
  res.json({ success: true });
});

export default router;
