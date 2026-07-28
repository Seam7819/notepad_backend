import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

import nodemailer from "nodemailer";
// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustOrigin: [process.env.APP_URL || "http://localhost:3000"],
    user: {
      additionalFields: {
        role :{
          type: "string",
          defaultValue: "USER",
          required: false,
        },
        phone :{
          type: "string",
          required: false,
        }
      }
    },
    emailAndPassword: { 
    enabled: true, 
    autoSignup: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ( { user, url, token }, request) => {
      const info = await transporter.sendMail({
    from: '"notepad" <team@example.com>', // sender address
    to: "siamahme766@gmail.com, bob@example.com", // list of recipients
    subject: "Hello", // subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // HTML body
  });

  console.log("Message sent: %s");
    },
  },
});