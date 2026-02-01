"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10),
});

type ContactValues = z.infer<typeof contactSchema>;

export function ContactClient() {
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
    mode: "onBlur",
  });

  return (
    <Card className="border-none shadow-lg">
      <CardContent className="space-y-4 p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Send us a message</h2>
          <p className="text-muted-foreground mt-2">
            Fill out the form below and we&apos;ll get back to you as soon as possible.
          </p>
        </div>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(async () => {
            await new Promise((r) => setTimeout(r, 350));
            toast.success("Message sent");
            form.reset();
          })}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...form.register("name")} placeholder="Your name" />
              {form.formState.errors.name ? (
                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register("email")} placeholder="you@example.com" />
              {form.formState.errors.email ? (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" rows={6} {...form.register("message")} placeholder="How can we help you?" />
            {form.formState.errors.message ? (
              <p className="text-xs text-destructive">{form.formState.errors.message.message}</p>
            ) : null}
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
            Send Message
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

