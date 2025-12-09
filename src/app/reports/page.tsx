import AppSidebar from "@/components/layout/sidebar";
import AppHeader from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ReportsPage() {
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
              <CardTitle>Reports</CardTitle>
              <CardDescription>This is where your reports will be displayed.</CardDescription>
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
