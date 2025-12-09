'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { AwsCostData, AccountCost } from '@/lib/types';
import { generateMockData } from '@/lib/mock-data';
import AppSidebar from '@/components/layout/sidebar';
import AppHeader from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ServiceOverview from '@/components/dashboard/service-overview';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

export default function AccountDetailPage({ params }: { params: { accountId: string } }) {
  const [account, setAccount] = useState<AccountCost | null | undefined>(undefined);
  const [costData, setCostData] = useState<AwsCostData | null>(null);
  const [timePeriod, setTimePeriod] = useState<keyof AwsCostData>('daily');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const data = generateMockData();
    const periodData = data[timePeriod];
    const currentAccount = periodData.byAccount.find(
      (a) => a.accountId === params.accountId
    );
    
    // Simulate network delay
    const timer = setTimeout(() => {
        setCostData(data);
        setAccount(currentAccount);
        setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [params.accountId, timePeriod]);
  
  const periodData = costData?.[timePeriod];
  const accountSpecificServices = periodData?.byService.map(service => ({
      ...service,
      cost: service.cost * (Math.random() * 0.5 + 0.2) // Simulate account-specific service cost
  })).sort((a,b) => b.cost - a.cost);
  const accountTotal = accountSpecificServices?.reduce((sum, s) => sum + s.cost, 0);


  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <AppSidebar />
      <div className="flex flex-col">
        <AppHeader timePeriod={timePeriod} setTimePeriod={setTimePeriod} />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href="/"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            {isLoading && <Skeleton className="h-8 w-64" />}
            {account === undefined && !isLoading && (
                 <h1 className="text-xl font-semibold text-destructive">Account not found</h1>
            )}
            {account && (
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{account.accountName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-xl font-semibold">{account.accountName}</h1>
                        <p className="text-sm text-muted-foreground">{account.accountId}</p>
                    </div>
                </div>
            )}
          </div>
          
          {account === null && !isLoading && (
            <Card>
                <CardHeader>
                    <CardTitle>No Data</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>There is no cost data available for this account in the selected period.</p>
                </CardContent>
            </Card>
          )}

          {account && (
             <ServiceOverview
                data={accountSpecificServices}
                totalCost={accountTotal}
                isLoading={isLoading}
             />
          )}

        </main>
      </div>
    </div>
  );
}
