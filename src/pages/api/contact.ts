export const prerender = false;
import type { APIRoute } from "astro";
import { Client } from "@notionhq/client";

const notion = new Client({ auth: import.meta.env.NOTION_TOKEN });

export const POST: APIRoute = async ({ request }) => {
    try {
      const data = await request.json();

      await notion.blocks.children.append({
        block_id: import.meta.env.PAGE_ID ?? '',
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