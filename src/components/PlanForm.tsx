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
  role: z.string().min(1, {
    message: "Selecting a role is required.",
  }),
  apiCalls: z.string().min(1, {
    message: "Selecting API calls range is required.",
  }),
  companySize: z.string().min(1, {
    message: "Selecting company size is required.",
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
      role: "",
      apiCalls: "",
      companySize: "",
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
        body: JSON.stringify({
          ...data,
          messageType: "plan",
        }),
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
    <div id="get-in-touch" className="bg-background rounded-lg p-6 border border-gray-900">
      <Form {...form}>
        <form
          className="text-gray-900 space-y-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Name <span>*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="First, Last Name"
                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 h-12 rounded-lg"
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
                <FormLabel>
                  Company <span>*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Company Name"
                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 h-12 rounded-lg"
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
                <FormLabel>
                  Work Email <span>*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Email"
                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 h-12 rounded-lg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Your Role <span>*</span>
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full bg-white border-gray-300 text-gray-900 h-12 rounded-lg">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="engineering-manager">
                        Engineering Manager
                      </SelectItem>
                      <SelectItem value="cto">CTO</SelectItem>
                      <SelectItem value="product-manager">
                        Product Manager
                      </SelectItem>
                      <SelectItem value="devops">DevOps</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="apiCalls"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Monthly API Calls <span>*</span>
                </FormLabel>
                <FormControl>
                  <div className="flex flex-wrap gap-3">
                    {[
                      "0-1,000",
                      "1,000-10k",
                      "10k-100k",
                      "100k-500k",
                      "500K+",
                    ].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => field.onChange(option)}
                        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          field.value === option
                            ? "bg-gray-900 text-white"
                            : "bg-white border border-gray-300 text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companySize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Company Size <span>*</span>
                </FormLabel>
                <FormControl>
                  <div className="flex flex-wrap gap-3">
                    {[
                      "0-1",
                      "2-50",
                      "50-100",
                      "100-500",
                      "500-1,000",
                      "1,000+",
                    ].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => field.onChange(option)}
                        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          field.value === option
                            ? "bg-gray-900 text-white"
                            : "bg-white border border-gray-300 text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
            className="w-full bg-gray-900 text-white font-semibold text-base px-4 py-6 rounded-full hover:bg-gray-800 transition-colors duration-200"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
