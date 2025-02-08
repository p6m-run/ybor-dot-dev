export const prerender = false;
import type { APIRoute } from "astro";
import { Client } from "@notionhq/client";

const notion = new Client({ auth: 'ntn_e99831864317zxNQ37Z0ZrEcIAkPdYXcvcb46M5llk1gjJ' });

export const POST: APIRoute = async ({ request }) => {
    try {
      const data = await request.json();

      await notion.blocks.children.append({
        block_id: '1942530b55ff80bfba01c1324c5fb10f',
        children: [
          {
            "object": "block",
            "type": "heading_3",
            "heading_3": {
              "rich_text": [{ "type": "text", "text": { "content": data.fullName } }]
            }
          },
          {
            "object": "block",
            "type": "paragraph",
            "paragraph": {
              "rich_text": [
                {
                  "type": "text",
                  "text": {
                    "content": data.email + " - " + data.phoneNumber,
                  }
                }
              ]
            }
          },
          {
            "object": "block",
            "type": "paragraph",
            "paragraph": {
              "rich_text": [
                {
                  "type": "text",
                  "text": {
                    "content": data.message,
                  }
                }
              ]
            }
          }
        ],
      });
      
      return new Response(JSON.stringify({
        message: "SENT"
      }), {
        status: 200
      })
    } catch (error) {
      return new Response(null, { status: 400 });
    }
  }