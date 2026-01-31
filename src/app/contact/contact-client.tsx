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
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
        <p className="text-muted-foreground">
          Send a message and we’ll get back to you. This is a demo form that displays a success
          toast.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4 p-6">
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
                <Input id="name" {...form.register("name")} />
                {form.formState.errors.name ? (
                  <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...form.register("email")} />
                {form.formState.errors.email ? (
                  <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" rows={6} {...form.register("message")} />
              {form.formState.errors.message ? (
                <p className="text-xs text-destructive">{form.formState.errors.message.message}</p>
              ) : null}
            </div>

            <Button type="submit" disabled={form.formState.isSubmitting}>
              Send message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

