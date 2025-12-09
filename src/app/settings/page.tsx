import AppSidebar from "@/components/layout/sidebar";
import AppHeader from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <AppSidebar />
      <div className="flex flex-col">
        {/* The header requires props that aren't relevant for this placeholder. */}
        {/* @ts-ignore */}
        <AppHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Manage your application settings here.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This page is under construction.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
