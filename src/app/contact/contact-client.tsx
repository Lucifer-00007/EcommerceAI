"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { User, Mail, Phone, Send, Loader2, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactValues = z.infer<typeof contactSchema>;

export function ContactClient() {
  const [isSuccess, setIsSuccess] = useState(false);
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
    mode: "onChange",
  });

  const onSubmit = async (data: ContactValues) => {
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    console.log(data);
    setIsSuccess(true);
    toast.success("Message sent successfully!");
    form.reset();
  };

  if (isSuccess) {
    return (
      <Card className="border-none shadow-lg overflow-hidden animate-in fade-in zoom-in duration-500">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-6">
          <div className="rounded-full bg-green-100 p-6 dark:bg-green-900/20">
            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-500 animate-in zoom-in duration-300 delay-150" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Message Sent!</h2>
            <p className="text-muted-foreground max-w-xs mx-auto">
              Thank you for reaching out. We&apos;ll get back to you within 24 hours.
            </p>
          </div>
          <Button 
            onClick={() => setIsSuccess(false)} 
            variant="outline" 
            className="mt-4 transition-all hover:scale-105"
          >
            Send another message
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <CardContent className="space-y-6 py-2 px-8">
        <div className="mb-2">
          <h2 className="text-2xl font-bold">Send us a message</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Fill out the form below and we&apos;ll get back to you as soon as possible.
          </p>
        </div>
        <form
          className="space-y-5 pt-5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="relative group">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input 
                  id="name" 
                  {...form.register("name")} 
                  placeholder="Your Name" 
                  className="pl-9 transition-all border-input focus:border-primary focus:ring-1 focus:ring-primary"
                  aria-label="Your Name"
                />
              </div>
              {form.formState.errors.name && (
                <p className="text-xs text-destructive animate-in slide-in-from-left-1 pl-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="relative group">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input 
                  id="phone" 
                  type="tel"
                  {...form.register("phone")} 
                  placeholder="Phone Number (Optional)" 
                  className="pl-9 transition-all border-input focus:border-primary focus:ring-1 focus:ring-primary"
                  aria-label="Phone Number"
                />
              </div>
              {form.formState.errors.phone && (
                <p className="text-xs text-destructive animate-in slide-in-from-left-1 pl-1">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative group">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input 
                id="email" 
                type="email" 
                {...form.register("email")} 
                placeholder="Email Address" 
                className="pl-9 transition-all border-input focus:border-primary focus:ring-1 focus:ring-primary"
                aria-label="Email Address"
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-xs text-destructive animate-in slide-in-from-left-1 pl-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="relative group">
              <Textarea 
                id="message" 
                rows={5} 
                {...form.register("message")} 
                placeholder="How can we help you?" 
                className="pl-3 min-h-[120px] resize-none transition-all border-input focus:border-primary focus:ring-1 focus:ring-primary"
                aria-label="Message"
              />
            </div>
            {form.formState.errors.message && (
              <p className="text-xs text-destructive animate-in slide-in-from-left-1 pl-1">
                {form.formState.errors.message.message}
              </p>
            )}
          </div>

          <div className="pt-2 justify-center flex">
            <Button 
              type="submit" 
              size="lg" 
              className="rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98]" 
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

