"use client";

import { useState, useEffect } from "react";
import type { AwsCostData } from "@/lib/types";
import { generateMockData } from "@/lib/mock-data";

import AppSidebar from "@/components/layout/sidebar";
import AppHeader from "@/components/layout/header";
import CostSummaryCards from "@/components/dashboard/cost-summary-cards";
import CostChart from "@/components/dashboard/cost-chart";
import ServiceOverview from "@/components/dashboard/service-overview";
import AccountOverview from "@/components/dashboard/account-overview";

export default function Dashboard() {
  const [costData, setCostData] = useState<AwsCostData | null>(null);
  const [timePeriod, setTimePeriod] = useState<keyof AwsCostData>('daily');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const data = generateMockData();
    // Simulate network delay
    const timer = setTimeout(() => {
      setCostData(data);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [timePeriod]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCostData(generateMockData());
    }, 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

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
          <CostSummaryCards data={periodData} isLoading={isLoading} />
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
          <AccountOverview data={periodData?.byAccount} isLoading={isLoading} />
        </main>
      </div>
    </div>
  );
}
