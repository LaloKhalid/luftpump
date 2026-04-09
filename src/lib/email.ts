import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export interface LeadEmailData {
  name: string;
  phone: string;
  email: string;
  address: string;
  houseSize: number;
  floors: number;
  heatingSystem: string;
  message?: string;
}

export interface BookingEmailData {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  type: string;
}

export async function sendNewLeadEmail(data: LeadEmailData): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL!;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: adminEmail,
    subject: `Ny offertförfrågan från ${data.name}`,
    html: `
      <h2>Ny offertförfrågan</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Namn</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.name}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Telefon</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.phone}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>E-post</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.email}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Adress</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.address}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Bostadsyta</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.houseSize} m²</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Antal våningar</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.floors}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Nuvarande värmesystem</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.heatingSystem}</td></tr>
        ${data.message ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Meddelande</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.message}</td></tr>` : ""}
      </table>
      <p style="color: #666; margin-top: 16px;">Logga in på adminpanelen för att hantera denna förfrågan.</p>
    `,
  });

  // Confirmation to customer
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: data.email,
    subject: "Tack för din offertförfrågan – Luftpump AB",
    html: `
      <h2>Tack för din förfrågan, ${data.name}!</h2>
      <p>Vi har mottagit din offertförfrågan och återkommer till dig inom 24 timmar.</p>
      <h3>Din förfrågan:</h3>
      <ul>
        <li>Adress: ${data.address}</li>
        <li>Bostadsyta: ${data.houseSize} m²</li>
        <li>Antal våningar: ${data.floors}</li>
        <li>Nuvarande värmesystem: ${data.heatingSystem}</li>
      </ul>
      <p>Har du frågor? Ring oss på ${process.env.NEXT_PUBLIC_COMPANY_PHONE || "+46 70 123 45 67"}</p>
      <p>Med vänliga hälsningar,<br><strong>Luftpump AB</strong></p>
    `,
  });
}

export async function sendNewBookingEmail(
  data: BookingEmailData
): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL!;
  const bookingTypeLabel =
    data.type === "CONSULTATION" ? "Konsultation" : "Installation";

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: adminEmail,
    subject: `Ny bokning: ${bookingTypeLabel} – ${data.name}`,
    html: `
      <h2>Ny bokning</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Namn</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.name}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Telefon</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.phone}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>E-post</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.email}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Typ</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${bookingTypeLabel}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Datum</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.date}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Tid</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.time}</td></tr>
      </table>
    `,
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: data.email,
    subject: `Bokningsbekräftelse – ${bookingTypeLabel}`,
    html: `
      <h2>Din bokning är bekräftad!</h2>
      <p>Hej ${data.name},</p>
      <p>Vi har mottagit din bokning för <strong>${bookingTypeLabel}</strong>.</p>
      <h3>Bokningsdetaljer:</h3>
      <ul>
        <li>Datum: <strong>${data.date}</strong></li>
        <li>Tid: <strong>${data.time}</strong></li>
      </ul>
      <p>Vi ser fram emot att träffa dig!</p>
      <p>Med vänliga hälsningar,<br><strong>Luftpump AB</strong></p>
    `,
  });
}

// Prepared for future SMS integration
export interface SmsNotification {
  to: string;
  message: string;
}

export async function sendSms(_data: SmsNotification): Promise<void> {
  // TODO: Integrate Twilio or Vonage here
  // await twilioClient.messages.create({ to: data.to, from: ..., body: data.message })
}
