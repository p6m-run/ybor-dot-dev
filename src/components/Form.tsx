import React from 'react'

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from './ui/textarea'

const FormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email(),
  phoneNumber: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  message: z.string().min(2, {
    message: "Message must be at least 2 characters.",
  }),
})

export default function ContactForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      message: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    // send data to Notion
    // const notion = new Client({
    //   auth: 'Bearer ntn_e99831864317zxNQ37Z0ZrEcIAkPdYXcvcb46M5llk1gjJ', 
    // })
    try {
      await fetch("https://api.notion.com/v1/blocks/1942530b55ff80bfba01c1324c5fb10f/children",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Notion-Version": "2022-02-22",
            Authorization: `Bearer ntn_e99831864317zxNQ37Z0ZrEcIAkPdYXcvcb46M5llk1gjJ`,
          },
          body: JSON.stringify({
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
          }),
        }
      );
      toast({
        title: "Thank you for your message!",
        description: "We will get back to you soon.",
      });
      form.reset();
    } catch (error) {
      console.error("Error sending data to Notion:", error);
    }
    
    
  }

  return (
    <Form {...form}>
      
      <form className="h-96 text-white mx-auto max-w-sm md:max-w-4xl xl:max-w-7xl space-y-8 p-8" onSubmit={form.handleSubmit(onSubmit)}>
      <h2>Get in touch with Ybor:</h2>
        <div className="grid grid-cols-3 gap-8">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Full Name</FormLabel> */}
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Enter your work email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Enter your phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Enter your message" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
