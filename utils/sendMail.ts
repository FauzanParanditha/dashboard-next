import { EmailLog, createEmailLog } from "@/server/models/log_email";
import axios from "axios";
import fs from "fs";
import handlebars from "handlebars";
import { ObjectId } from "mongodb";
import { v4 as uuidv4 } from "uuid";

interface EmailPayload {
  to: string;
  subject: string;
  body: any; // html
}

export const SendEmail = async (mailData: EmailPayload) => {
  if (
    !process.env.MAIL_TOKEN ||
    !process.env.MAIL_FORM ||
    !process.env.MAIL_ADDRESS ||
    !process.env.MAIL_URL
  ) {
    throw new Error("Mail configuration is incomplete");
  }

  const data = new FormData();
  data.append("token", process.env.MAIL_TOKEN);
  data.append("from", process.env.MAIL_FORM);
  data.append("mailer", process.env.MAIL_ADDRESS);
  data.append("to", mailData.to);
  data.append("subject", mailData.subject);
  data.append("body", mailData.body);
  const url = process.env.MAIL_URL;
  try {
    const response = await axios.post(`${url}/api/v1/mail`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Email sent successfully:", response.data);
    const email: EmailLog = {
      _id: new ObjectId(),
      _created: new Date(),
      _modified: new Date(),
      email: mailData.to,
      messages: response.data,
      status: response.data.code,
      do_time: new Date(),
    };
    await createEmailLog(email);
    return response.data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

export const generateForgotPasswordLink = (
  token: string,
  email: string
): string => {
  const baseUrl = process.env.FRONTEND_URL;
  return `${baseUrl}/auth/forgot-password?token=${token}&email=${email}`;
};

export const generateVerificationToken = (): string => {
  return uuidv4();
};

export const encodeToBase64 = (input: string) => {
  const buffer = Buffer.from(input, "utf-8");
  return buffer.toString("base64");
};

export const SendForgotPassword = async (
  url: string,
  emailTo: string,
  name: string
) => {
  const templateSource = fs.readFileSync(
    "./components/mail/email.html",
    "utf8"
  );
  const template = handlebars.compile(templateSource);
  const body = `
    <table class="message mt-2">
    <tr class="text-left">
        <td>
            <strong>Hallo, ${name} </strong>
        </td>
    </tr>
    <tr class="text-center">
        <td>
            <p>Ini adalah email reset password</p>
            <p>Jika anda tidak merasa melakukan reset password <span class="text-red">ABAIKAN EMAIL INI</span></p>
            <a href="${url}" class="btn mt-2 mb-2">RESET PASSWORD</a>
            <p class="mb-2">Atau Copy Link di Bawah</p>
            <p class="text-blue">${url}</p>
        </td>
    </tr>
  </table>
    `;
  const emailHtml = template({ Body: body });
  const mailData: EmailPayload = {
    to: emailTo,
    subject: "Forgot Password",
    body: encodeToBase64(emailHtml),
  };
  await SendEmail(mailData);
};
