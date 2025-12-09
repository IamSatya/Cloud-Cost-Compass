"use client"

import type { AwsCostData } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Server } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SERVICE_ICONS } from "@/components/icons";

interface CostSummaryCardsProps {
  data: AwsCostData[keyof AwsCostData] | undefined;
  isLoading: boolean;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default function CostSummaryCards({ data, isLoading }: CostSummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-6 w-6 rounded-sm" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-40 mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const topService = data?.byService.reduce((max, service) => service.cost > max.cost ? service : max, data.byService[0] || { serviceName: 'N/A', cost: 0 });
  const TopServiceIcon = topService ? SERVICE_ICONS[topService.serviceName] || Server : Server;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(data?.totalCost || 0)}</div>
          <p className="text-xs text-muted-foreground">For the selected period</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cost Trend</CardTitle>
          {data && data.costTrend >= 0 ? <TrendingUp className="h-4 w-4 text-accent" /> : <TrendingDown className="h-4 w-4 text-destructive" />}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${data && data.costTrend >= 0 ? 'text-accent' : 'text-destructive'}`}>
            {data && data.costTrend >= 0 ? '+' : ''}{data?.costTrend.toFixed(2)}%
          </div>
          <p className="text-xs text-muted-foreground">vs. previous period</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Spender</CardTitle>
          <TopServiceIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topService?.serviceName || 'N/A'}</div>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(topService?.cost || 0)} of total
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
