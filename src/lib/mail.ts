import nodemailer from "nodemailer";

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    return null;
  }
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export function isMailConfigured(): boolean {
  return !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  );
}

export async function sendMailMessage(options: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}): Promise<boolean> {
  const transport = getTransport();
  if (!transport) {
    console.warn("[mail] SMTP غير مُهيأ — تم تخطّي إرسال البريد.");
    return false;
  }

  const from = process.env.MAIL_FROM ?? `ميدنوفا <${process.env.SMTP_USER}>`;

  await transport.sendMail({
    from,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html ?? options.text.replace(/\n/g, "<br/>"),
    ...(options.replyTo ? { replyTo: options.replyTo } : {}),
  });

  return true;
}

export async function sendContactEmail(payload: {
  name: string;
  email: string;
  message: string;
}): Promise<boolean> {
  const to = process.env.CONTACT_RECEIVER_EMAIL ?? process.env.SMTP_USER;
  if (!to) return false;

  const subject = `[ميدنوفا] رسالة من ${payload.name}`;
  const text = [
    `الاسم: ${payload.name}`,
    `البريد: ${payload.email}`,
    "",
    payload.message,
  ].join("\n");

  return sendMailMessage({
    to,
    subject,
    text,
    replyTo: payload.email,
  });
}

export async function sendBookingConfirmationEmail(payload: {
  to: string;
  patientName: string;
  doctorName: string;
  whenLabel: string;
  notes?: string;
}): Promise<boolean> {
  const subject = "تأكيد موعد — ميدنوفا";
  const text = [
    `مرحباً ${payload.patientName}،`,
    "",
    `تم تأكيد موعدك مع ${payload.doctorName}.`,
    `الوقت: ${payload.whenLabel}`,
    payload.notes ? `\nملاحظاتك: ${payload.notes}` : "",
    "",
    "مع تحيات فريق ميدنوفا",
  ]
    .filter(Boolean)
    .join("\n");

  return sendMailMessage({
    to: payload.to,
    subject,
    text,
  });
}

export async function sendAppointmentReminderEmail(payload: {
  to: string;
  patientName: string;
  doctorName: string;
  whenLabel: string;
}): Promise<boolean> {
  const subject = "تذكير بموعدك — ميدنوفا";
  const text = [
    `مرحباً ${payload.patientName}،`,
    "",
    `تذكير: لديك موعد مع ${payload.doctorName}.`,
    `الوقت: ${payload.whenLabel}`,
    "",
    "مع تحيات فريق ميدنوفا",
  ].join("\n");

  return sendMailMessage({
    to: payload.to,
    subject,
    text,
  });
}
