"use client";

import { useState, useEffect } from "react";
import type { AwsCostData } from "@/lib/types";
import { useCollection, useUser, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { AwsAccount } from "@/lib/types";
import { fetchAwsCostData } from "@/ai/flows/fetch-aws-costs";

import AppSidebar from "@/components/layout/sidebar";
import AppHeader from "@/components/layout/header";
import CostSummaryCards from "@/components/dashboard/cost-summary-cards";
import CostChart from "@/components/dashboard/cost-chart";
import ServiceOverview from "@/components/dashboard/service-overview";
import AccountOverview from "@/components/dashboard/account-overview";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function Dashboard() {
  const [costData, setCostData] = useState<AwsCostData | null>(null);
  const [timePeriod, setTimePeriod] = useState<keyof AwsCostData>('daily');
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useUser();
  const firestore = useFirestore();

  const accountsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/awsAccounts`);
  }, [user, firestore]);

  const { data: accounts, isLoading: areAccountsLoading } = useCollection<AwsAccount>(accountsQuery);

  useEffect(() => {
    async function getCostData() {
      if (!accounts || accounts.length === 0) {
        setIsLoading(false);
        setCostData(null);
        return;
      }
      
      // For now, we'll just use the credentials from the first account.
      // A more advanced implementation might aggregate data from all accounts.
      const primaryAccount = accounts[0];

      try {
        setIsLoading(true);
        const data = await fetchAwsCostData({
          accountId: primaryAccount.accountId,
          accessKeyId: primaryAccount.accessKeyId,
          secretAccessKey: primaryAccount.secretAccessKey,
        });
        setCostData(data);
      } catch (error) {
        console.error("Failed to fetch cost data:", error);
        setCostData(null);
      } finally {
        setIsLoading(false);
      }
    }

    if (!areAccountsLoading) {
        getCostData();
    }
    
  }, [accounts, areAccountsLoading, timePeriod]);


  const periodData = costData?.[timePeriod];

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <AppSidebar />
      <div className="flex flex-col">
        <AppHeader
          timePeriod={timePeriod}
          setTimePeriod={setTimePeriod}
        />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            {!areAccountsLoading && (!accounts || accounts.length === 0) ? (
                 <Card>
                    <CardHeader>
                        <CardTitle>Welcome to CloudCost Compass</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Get started by adding an AWS account in the Settings page.</p>
                    </CardContent>
                 </Card>
            ) : (
                <>
                    <CostSummaryCards data={periodData} isLoading={isLoading} />
                    <AccountOverview />
                    <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                        <div className="xl:col-span-2">
                        <CostChart data={periodData?.timeline} isLoading={isLoading} />
                        </div>
                        <ServiceOverview
                        data={periodData?.byService}
                        totalCost={periodData?.totalCost}
                        isLoading={isLoading}
                        />
                    </div>
                </>
            )}
        </main>
      </div>
    </div>
  );
}
