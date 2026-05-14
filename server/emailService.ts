import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_PORT === '465', // true para 465, false para outras portas
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const from = process.env.SMTP_FROM || '"Reforço Escolar" <no-reply@reforcoescolar.com>';

/**
 * Envia e-mail de boas-vindas após o cadastro
 */
export async function sendWelcomeEmail(to: string, nome: string) {
  try {
    await transporter.sendMail({
      from,
      to,
      subject: 'Bem-vindo ao Reforço Escolar! 📚',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #4f46e5;">Olá, ${nome}!</h2>
          <p>Seja muito bem-vindo(a) ao sistema de <strong>Reforço Escolar</strong>.</p>
          <p>Seu cadastro foi realizado com sucesso. Agora você pode gerenciar seus alunos, turmas e cronogramas de forma muito mais simples.</p>
          <div style="margin-top: 30px; padding: 15px; background-color: #f3f4f6; border-radius: 5px;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">Este é um e-mail automático, por favor não responda.</p>
          </div>
        </div>
      `,
    });
    console.log(`📧 E-mail de boas-vindas enviado para: ${to}`);
  } catch (error) {
    console.error('❌ Erro ao enviar e-mail de boas-vindas:', error);
  }
}

/**
 * Envia notificação de alteração de senha
 */
export async function sendPasswordChangeNotification(to: string, nome: string) {
  try {
    await transporter.sendMail({
      from,
      to,
      subject: 'Alerta de Segurança: Senha Alterada 🔒',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #dc2626;">Olá, ${nome}.</h2>
          <p>Este é um aviso de segurança para informar que a <strong>senha da sua conta foi alterada com sucesso</strong> recentemente.</p>
          <p>Se foi você quem realizou essa alteração, pode desconsiderar este e-mail.</p>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="color: #b91c1c; font-weight: bold;">⚠️ Não foi você?</p>
          <p>Se você não reconhece esta atividade, entre em contato com o suporte imediatamente ou tente recuperar sua conta.</p>
        </div>
      `,
    });
    console.log(`📧 Alerta de alteração de senha enviado para: ${to}`);
  } catch (error) {
    console.error('❌ Erro ao enviar e-mail de alteração de senha:', error);
  }
}

/**
 * Envia link para recuperação de senha
 */
export async function sendPasswordResetEmail(to: string, nome: string, token: string) {
  try {
    const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    
    await transporter.sendMail({
      from,
      to,
      subject: 'Recuperação de Senha 🔑',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #4f46e5;">Olá, ${nome}!</h2>
          <p>Você solicitou a recuperação de sua senha no sistema <strong>Reforço Escolar</strong>.</p>
          <p>Para criar uma nova senha, clique no botão abaixo:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #8126cf; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Redefinir Minha Senha</a>
          </div>
          <p style="font-size: 14px; color: #6b7280;">Este link é válido por 1 hora. Se você não solicitou a troca de senha, ignore este e-mail.</p>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 12px; color: #9ca3af;">Se o botão não funcionar, copie e cole o link abaixo no seu navegador:</p>
          <p style="font-size: 12px; color: #9ca3af; word-break: break-all;">${resetUrl}</p>
        </div>
      `,
    });
    console.log(`📧 E-mail de recuperação enviado para: ${to}`);
  } catch (error) {
    console.error('❌ Erro ao enviar e-mail de recuperação:', error);
  }
}
