export const prerender = false;
import type { APIRoute } from "astro";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    if (request.headers.get("Content-Type") === "application/json") {
      const body = await request.json();
      const { name, company, email, reason, message, privacy } = body;

      if (!name || !company || !email || !reason || !message || privacy === undefined) {
        return new Response("Missing required fields", { status: 400 });
      }

      const { data, error } = await resend.emails.send({
        from: "YBOR.AI WEBSITE CONTACT FORM <no-reply@ybor.ai>",
        to: ["salesinquiries@ybor.ai"],
        subject: "New Contact Us Form Submission",
        html: `
                <h1>Contact Us Form Submission</h1>
                <p>Name: ${name},</p>
                <p>Company: ${company}</p>
                <p>Email: ${email}</p>
                <p>Reason: ${reason}</p>
                <p>Message: ${message}</p>
                <p>Privacy: ${privacy ? "Accepted" : "Declined"}</p>
              `,
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
  } catch (error) {
    return new Response(null, { status: 400 });
  }
};
