import { createTestAccount, createTransport, getTestMessageUrl, Transporter } from 'nodemailer';
import { env } from '../config/env';

let transporter: Transporter | null = null;

async function getTransporter(): Promise<Transporter> {
  if (transporter) {
    return transporter;
  }

  if (env.NODE_ENV === 'production' && env.SMTP_HOST) {
    transporter = createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD,
      },
    });
  } else {
    const testAccount = await createTestAccount();

    transporter = createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  return transporter;
}

export async function sendVerificationEmail(to: string, code: string) {
  const transport = await getTransporter();

  const info = await transport.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject: 'Verify your email',
    text: `Your verification code is: ${code}\n\nExpires in 15 minutes.`,
    html: `
          <p>Your verification code is:</p>
          <h2 style="letter-spacing: 0.25em">${code}</h2>
          <p>Expires in 15 minutes.</p>
        `,
  });

  if (env.NODE_ENV !== 'production') {
    console.log('📧 Preview URL:', getTestMessageUrl(info));
  }
}
