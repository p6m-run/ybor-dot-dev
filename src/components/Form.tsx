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
  issue: z.string().min(1, {
    message: "Selecting an issue is required.",
  }),
  message: z.string().min(2, {
    message: "Message is required.",
  }),
  privacy: z.boolean(),
});

export default function ContactForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      issue: undefined,
      message: "",
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
    <div className="gradient-bg py-24 mt-24 px-4 md:px-0">
      <div className="mx-auto max-w-sm md:max-w-4xl xl:max-w-7xl pt-8">
        <div className="grid md:grid-cols-2 gap-x-4">
          <div>
            <h3 className="text-xs text-white mb-6">Contact us</h3>
            <h2 className="text-4xl font-semibold mb-6 text-white">
              Get in Touch
            </h2>
            <p className="jetbrains-mono text-white mb-8">
              Schedule a demo to see how Ybor can accelerate your business
              today.
            </p>
            <img src={GetInTouchImage.src} alt="Get in Touch" />
          </div>

          <Form {...form}>
            <form
              className="text-white space-y-8 pt-12 md:pt-0"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
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
                    <FormLabel>Work E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your work email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="issue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Issue to Solve</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
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
                      <Textarea placeholder="Enter your message" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="privacy"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-4">
                    <FormControl>
                      <Checkbox
                        className="m-0 mr-2"
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(!!checked)}
                      />
                    </FormControl>
                    <FormLabel
                    >
                      By selecting this you agree to our <a className="underline hover:text-brand-green" href="#">Privacy Policy</a>.{" "}
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="w-full bg-brand-green text-black font-semibold jetbrains-mono text-sm uppercase px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                SEND MESSAGE
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
