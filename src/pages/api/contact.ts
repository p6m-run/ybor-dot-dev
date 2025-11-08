export const prerender = false;
import type { APIRoute } from "astro";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    if (request.headers.get("Content-Type") === "application/json") {
      const body = await request.json();
      const {
        name,
        company,
        email,
        reason,
        message,
        privacy,
        role,
        apiCalls,
        companySize,
        messageType = "contact",
      } = body;

      // Validate based on message type
      if (messageType === "plan") {
        if (
          !name ||
          !company ||
          !email ||
          !role ||
          !apiCalls ||
          privacy === undefined
        ) {
          return new Response("Missing required fields", { status: 400 });
        }
      } else {
        if (
          !name ||
          !company ||
          !email ||
          !reason ||
          !message ||
          privacy === undefined
        ) {
          return new Response("Missing required fields", { status: 400 });
        }
      }

      let emailBody = `
                <h1>Contact Us Form Submission</h1>
                <p>Name: ${name},</p>
                <p>Company: ${company}</p>
                <p>Email: ${email}</p>
                <p>Reason: ${reason}</p>
                <p>Message: ${message}</p>
                <p>Privacy: ${privacy ? "Accepted" : "Declined"}</p>
              `;

      if (messageType === "plan") {
        emailBody = `
          <h1>Plan Request Form Submission</h1>
          <p>Name: ${name},</p>
          <p>Company: ${company}</p>
          <p>Email: ${email}</p>
          <p>Role: ${role}</p>
          <p>Monthly API Calls: ${apiCalls}</p>
          <p>Company Size: ${companySize}</p>
          <p>Privacy: ${privacy ? "Accepted" : "Declined"}</p>
        `;
      }

      const { data, error } = await resend.emails.send({
        from: "YBOR.AI WEBSITE CONTACT FORM <no-reply@ybor.ai>",
        to: ["salesinquiries@ybor.ai"],
        subject:
          messageType === "contact"
            ? "New Contact Us Form Submission"
            : "New Plan Request Form Submission",
        html: emailBody,
      });

      if (error) {
        console.error("Error sending email:", error);
        throw new Response(error.message, {
          status: 400,
        });
      }

      return new Response(
        JSON.stringify({
          message: "SENT",
        }),
        {
          status: 200,
        }
      );
    }

    return new Response("Invalid Content-Type", { status: 400 });
  } catch (error) {
    return new Response(null, { status: 400 });
  }
};
