import nodemailer from 'nodemailer'

export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  cc?: string | string[] | null,
  bcc?: string | string[] | null,
  attachments: any[] = []
): Promise<void> => {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      to,
      subject,
      html,
      cc: cc || undefined,
      bcc: bcc || undefined,
      attachments,
      from: `MY_FIRST_PROJECT <${process.env.USER_EMAIL}>`,
    });

    console.log("Message sent:", info.messageId);

}