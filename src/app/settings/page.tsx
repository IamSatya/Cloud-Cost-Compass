'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import AppSidebar from "@/components/layout/sidebar";
import AppHeader from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";

const accountFormSchema = z.object({
  accountName: z.string().min(2, "Account name must be at least 2 characters."),
  accountId: z.string().regex(/^\d{12}$/, "Account ID must be 12 digits."),
  accessKey: z.string().min(16, "Access key is required."),
  secretKey: z.string().min(32, "Secret key is required."),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export default function SettingsPage() {
  const { toast } = useToast();
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      accountName: "",
      accountId: "",
      accessKey: "",
      secretKey: "",
    },
  });

  function onSubmit(data: AccountFormValues) {
    console.log("Adding new account:", data);
    // Placeholder for actual logic to save the account
    toast({
      title: "Account Added",
      description: `The account "${data.accountName}" has been added successfully.`,
    });
    form.reset();
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <AppSidebar />
      <div className="flex flex-col">
        {/* @ts-ignore */}
        <AppHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Add New Account</CardTitle>
              <CardDescription>
                Enter the details for the new AWS account you want to track.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="accountName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Production" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="accountId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account ID</FormLabel>
                        <FormControl>
                          <Input placeholder="123456789012" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="accessKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>AWS Access Key ID</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="AKIA..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="secretKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>AWS Secret Access Key</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••••••••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Add Account</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
