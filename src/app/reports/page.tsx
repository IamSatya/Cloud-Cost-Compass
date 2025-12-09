'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import AppSidebar from "@/components/layout/sidebar";
import AppHeader from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function ReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const { toast } = useToast();

  const handleDownload = () => {
    if (!selectedMonth) {
      toast({
        variant: 'destructive',
        title: 'No month selected',
        description: 'Please select a month to download the report.',
      });
      return;
    }
    // Placeholder for actual download logic
    toast({
      title: 'Download Started',
      description: `Downloading report for ${selectedMonth}...`,
    });
    console.log(`Downloading report for ${selectedMonth}`);
  };

  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return {
      value: d.toLocaleString('default', { month: 'long', year: 'numeric' }),
      label: d.toLocaleString('default', { month: 'long', year: 'numeric' }),
    };
  });

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <AppSidebar />
      <div className="flex flex-col">
        {/* @ts-ignore */}
        <AppHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <Card>
            <CardHeader>
              <CardTitle>Download Reports</CardTitle>
              <CardDescription>Select a month to download your billing report.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 max-w-sm">
              <Select onValueChange={setSelectedMonth} value={selectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleDownload} disabled={!selectedMonth}>
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
