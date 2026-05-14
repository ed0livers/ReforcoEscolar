import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from './db';
import { sendWelcomeEmail, sendPasswordChangeNotification, sendPasswordResetEmail } from './emailService';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'reforco_escolar_secret_key_2024';
const JWT_EXPIRES = '7d';

// Gerar token JWT
function gerarToken(userId: number, email: string) {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { nome, email, password, data_nasc } = req.body;

    if (!nome || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
    }

    // Verificar se email já existe
    const [rows]: any = await pool.query(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );
    if (rows.length > 0) {
      return res.status(409).json({ error: 'Este e-mail já está cadastrado.' });
    }

    const senhaHash = await bcrypt.hash(password, 12);

    const [result]: any = await pool.query(
      'INSERT INTO usuarios (nome, email, senha_hash, data_nasc) VALUES (?, ?, ?, ?)',
      [nome, email, senhaHash, data_nasc || null]
    );

    const userId = result.insertId;
    const token  = gerarToken(userId, email);

    // Criar configuração padrão para o novo usuário
    await pool.query(
      'INSERT INTO configuracoes (user_id, unit_name) VALUES (?, ?)',
      [userId, 'Reforço Escolar']
    );

    // Enviar e-mail de boas-vindas (sem await para não travar a resposta)
    sendWelcomeEmail(email, nome);

    return res.status(201).json({ token, user: { id: userId, nome, email } });
  } catch (err: any) {
    console.error('Erro no registro:', err);
    return res.status(500).json({ error: 'Erro interno ao registrar usuário.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    const [rows]: any = await pool.query(
      'SELECT id, nome, email, senha_hash FROM usuarios WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    const usuario = rows[0];
    const senhaValida = await bcrypt.compare(password, usuario.senha_hash);

    if (!senhaValida) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    const token = gerarToken(usuario.id, usuario.email);

    return res.json({
      token,
      user: { id: usuario.id, nome: usuario.nome, email: usuario.email },
    });
  } catch (err: any) {
    console.error('Erro no login:', err);
    return res.status(500).json({ error: 'Erro interno ao fazer login.' });
  }
});

// GET /api/auth/me
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token não fornecido.' });

    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);

    const [rows]: any = await pool.query(
      'SELECT id, nome, email FROM usuarios WHERE id = ?',
      [decoded.userId]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });

    return res.json({ user: rows[0] });
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido.' });
  }
});

// POST /api/auth/update-email
router.post('/update-email', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token não fornecido.' });

    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);

    const { currentPassword, newEmail } = req.body;

    const [rows]: any = await pool.query(
      'SELECT senha_hash FROM usuarios WHERE id = ?',
      [decoded.userId]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });

    const senhaValida = await bcrypt.compare(currentPassword, rows[0].senha_hash);
    if (!senhaValida) return res.status(401).json({ error: 'Senha atual incorreta.' });

    // Verificar se novo email já existe
    const [existing]: any = await pool.query(
      'SELECT id FROM usuarios WHERE email = ? AND id != ?',
      [newEmail, decoded.userId]
    );
    if (existing.length > 0) return res.status(409).json({ error: 'Este e-mail já está em uso.' });

    await pool.query('UPDATE usuarios SET email = ? WHERE id = ?', [newEmail, decoded.userId]);

    return res.json({ success: true, message: 'E-mail atualizado com sucesso.' });
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido.' });
  }
});

// POST /api/auth/update-password
router.post('/update-password', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token não fornecido.' });

    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);

    const { currentPassword, newPassword } = req.body;

    const [rows]: any = await pool.query(
      'SELECT senha_hash FROM usuarios WHERE id = ?',
      [decoded.userId]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });

    const senhaValida = await bcrypt.compare(currentPassword, rows[0].senha_hash);
    if (!senhaValida) return res.status(401).json({ error: 'Senha atual incorreta.' });

    const novoHash = await bcrypt.hash(newPassword, 12);
    await pool.query('UPDATE usuarios SET senha_hash = ? WHERE id = ?', [novoHash, decoded.userId]);

    // Buscar nome do usuário para o e-mail
    const [userRows]: any = await pool.query('SELECT nome FROM usuarios WHERE id = ?', [decoded.userId]);
    if (userRows.length > 0) {
      sendPasswordChangeNotification(decoded.email, userRows[0].nome);
    }

    return res.json({ success: true, message: 'Senha atualizada com sucesso.' });
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido.' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'O e-mail é obrigatório.' });

    const [rows]: any = await pool.query('SELECT id, nome FROM usuarios WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Este e-mail não está cadastrado no sistema.' });
    }

    const user = rows[0];
    const token = jwt.sign({ userId: user.id, type: 'reset' }, JWT_SECRET, { expiresIn: '1h' });
    
    // Enviar e-mail (sem await para resposta rápida)
    sendPasswordResetEmail(email, user.nome, token);

    return res.json({ 
      success: true, 
      message: `Link de recuperação enviado com sucesso para ${email}!`,
      userNome: user.nome
    });
  } catch (err) {
    console.error('Erro no forgot-password:', err);
    return res.status(500).json({ error: 'Erro ao processar solicitação.' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ error: 'Token e nova senha são obrigatórios.' });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== 'reset') throw new Error('Token inválido para esta operação.');

    const senhaHash = await bcrypt.hash(newPassword, 12);
    await pool.query('UPDATE usuarios SET senha_hash = ? WHERE id = ?', [senhaHash, decoded.userId]);

    return res.json({ success: true, message: 'Senha redefinida com sucesso!' });
  } catch (err: any) {
    console.error('Erro no reset-password:', err);
    return res.status(401).json({ error: 'Link de recuperação inválido ou expirado.' });
  }
});

export default router;
