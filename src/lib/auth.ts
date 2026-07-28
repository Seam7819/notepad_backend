import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify SMTP connection
transporter.verify((err) => {
  if (err) {
    console.error("SMTP Error:", err);
  } else {
    console.log("SMTP Server Connected");
  }
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [process.env.APP_URL!],

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,

    sendVerificationEmail: async ({ user, url }) => {
      const info = await transporter.sendMail({
        from: `"Prisma Blog" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: "Verify your email address",

        html: `
        <div style="max-width:600px;margin:auto;padding:30px;font-family:Arial,sans-serif;background:#f8fafc;border-radius:10px;">
          <h2 style="color:#0f172a;">Welcome to Prisma Blog 👋</h2>

          <p>
            Hello <strong>${user.name ?? "User"}</strong>,
          </p>

          <p>
            Thanks for signing up! Please verify your email address by clicking the button below.
          </p>

          <div style="text-align:center;margin:30px 0;">
            <a
              href="${url}"
              style="
                background:#2563eb;
                color:#fff;
                padding:12px 24px;
                text-decoration:none;
                border-radius:6px;
                display:inline-block;
                font-weight:bold;
              "
            >
              Verify Email
            </a>
          </div>

          <p>If the button doesn't work, copy and paste this link into your browser:</p>

          <p style="word-break:break-all;">
            ${url}
          </p>

          <hr style="margin:30px 0;" />

          <p style="font-size:13px;color:#64748b;">
            If you didn't create this account, you can safely ignore this email.
          </p>

          <p>
            Regards,<br />
            <strong>Prisma Blog Team</strong>
          </p>
        </div>
        `,
      });

      console.log("Verification email sent:", info.messageId);
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      prompt: "select_account consent",
      accessType: "offline",
    },
  },
});