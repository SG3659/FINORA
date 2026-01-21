import { Env } from "../config/env.config.js";

import nodemailer, { createTransport } from "nodemailer"
const transporter = nodemailer.createTransport({
   service: "gmail",
   auth: {
      user: Env.EMAIL,
      pass: Env.PASSWORD,
   },
});

// Verify the transporter configuration
transporter.verify((error, success) => {
   if (error) {
      console.log("Error setting up email transporter:", error);
   } else {
      console.log("Email transporter ready for messages:", success);
   }
});

type Params = {
   to: string | string[];
   subject: string;
   text: string;
   html: string;
   from?: string;
};

const mailer_sender = `AuroraFI <${Env.EMAIL}>`;

export const sendEmail = async ({
   to,
   from = mailer_sender,
   subject,
   text,
   html,
}: Params) => {


   return await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
   })
};