'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { collection } from 'firebase/firestore';

import AppSidebar from "@/components/layout/sidebar";
import AppHeader from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import type { AwsAccount } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReportsPage() {
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const { toast } = useToast();

  const { user } = useUser();
  const firestore = useFirestore();

  const accountsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/awsAccounts`);
  }, [user, firestore]);

  const { data: accounts, isLoading: areAccountsLoading } = useCollection<AwsAccount>(accountsQuery);

  const handleDownload = () => {
    if (!selectedMonth || !selectedAccount) {
      toast({
        variant: 'destructive',
        title: 'Selection missing',
        description: 'Please select an account and a month to download the report.',
      });
      return;
    }
    const accountName = accounts?.find(acc => acc.id === selectedAccount)?.accountName || 'the selected account';
    // Placeholder for actual download logic
    toast({
      title: 'Download Started',
      description: `Downloading report for ${accountName} for ${selectedMonth}...`,
    });
    console.log(`Downloading report for account ${selectedAccount} for ${selectedMonth}`);
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
              <CardDescription>Select an account and a month to download your billing report.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 max-w-sm">
                {areAccountsLoading ? (
                    <Skeleton className="h-10 w-full" />
                ) : (
                    <Select onValueChange={setSelectedAccount} value={selectedAccount}>
                        <SelectTrigger>
                        <SelectValue placeholder="Select an account" />
                        </SelectTrigger>
                        <SelectContent>
                        {accounts && accounts.length > 0 ? (
                            accounts.map(account => (
                            <SelectItem key={account.id} value={account.id}>
                                {account.accountName} ({account.accountId})
                            </SelectItem>
                            ))
                        ) : (
                            <SelectItem value="no-accounts" disabled>No accounts found</SelectItem>
                        )}
                        </SelectContent>
                    </Select>
                )}

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
              <Button onClick={handleDownload} disabled={!selectedMonth || !selectedAccount || areAccountsLoading}>
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
