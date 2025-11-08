("use client");

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import GetInTouchImage from "@/assets/get-in-touch.svg";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";

const commonEmailProviders = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "aol.com",
  "icloud.com",
  "protonmail.com",
  "zoho.com",
  "mail.com",
  "gmx.com",
  "msn.com",
];

const FormSchema = z.object({
  name: z.string().min(3, {
    message: "Full name must be at least 3 characters.",
  }),
  company: z.string().min(3, {
    message: "Company name must be at least 3 characters.",
  }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .refine(
      (email) => {
        const domain = email.split("@")[1];
        return !commonEmailProviders.includes(domain);
      },
      { message: "Only work emails are allowed" }
    ),
  reason: z.string().min(1, {
    message: "Selecting an reason is required.",
  }),
  message: z.string().min(2, {
    message: "Message is required.",
  }),
  privacy: z.boolean().refine((val) => val === true, {
    message: "You must agree to the privacy policy.",
  }),
});

export default function ContactForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      reason: undefined,
      message: "",
      privacy: false,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.status !== 200) {
        console.error("Failed to send message:", response.statusText);
        throw new Error("Failed to send message");
      }

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
    <div id="get-in-touch" >
      <div className="md:pt-8 border-t mt-8">
      <Form {...form}>
            <form
              className="text-gray-900 space-y-6 md:pt-12 pt-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Name" 
                            className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Name" 
                            className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                            {...field} 
                          />
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Email" 
                            className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason for Interest</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full bg-white border-gray-300 text-gray-900">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="increasing-developer-speed">
                                Increasing developer speed
                              </SelectItem>
                              <SelectItem value="modernizing-infrastructure">
                                Modernizing our infrastructure
                              </SelectItem>
                              <SelectItem value="building-for-scale">
                                Building for Scale
                              </SelectItem>
                              <SelectItem value="security-and-compliance">
                                Security and compliance
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Type your message" 
                            className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Bottom Section */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="privacy"
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          className="mt-1"
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(!!checked)}
                        />
                      </FormControl>
                      <div className="flex flex-col">
                        <FormLabel className="text-gray-900 text-sm font-normal">
                          By selecting this you agree to our{" "}
                          <a
                            className="underline hover:text-blue-600"
                            href="/privacy-policy"
                          >
                            Privacy Policy
                          </a>
                          .
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <Button
                  className="w-full bg-gray-900 text-white font-semibold text-sm px-4 py-3 rounded-full hover:bg-gray-800 transition-colors duration-200"
                  type="submit"
                  disabled={form.formState.isSubmitting}
                >
                  Send Message
                </Button>
              </div>
                </div>
              </div>

            </form>
          </Form>
      </div>
    </div>
  );
}
