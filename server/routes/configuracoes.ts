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

// GET /api/configuracoes
router.get('/', auth, async (req: Request, res: Response) => {
  const [rows] = await pool.query(
    'SELECT * FROM configuracoes WHERE user_id = ?',
    [(req as any).userId]
  );
  const config = (rows as any[])[0] || { unit_name: 'Reforço Escolar', whatsapp: '' };
  res.json(config);
});

// POST /api/configuracoes (upsert)
router.post('/', auth, async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { unit_name, whatsapp } = req.body;

  await pool.query(
    `INSERT INTO configuracoes (user_id, unit_name, whatsapp)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE unit_name = VALUES(unit_name), whatsapp = VALUES(whatsapp)`,
    [userId, unit_name, whatsapp]
  );

  const [rows] = await pool.query('SELECT * FROM configuracoes WHERE user_id = ?', [userId]);
  res.json((rows as any[])[0]);
});

export default router;
