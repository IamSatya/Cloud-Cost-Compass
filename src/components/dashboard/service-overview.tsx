"use client"

import type { ServiceCost } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { SERVICE_ICONS } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";

interface ServiceOverviewProps {
  data: ServiceCost[] | undefined;
  totalCost: number | undefined;
  isLoading: boolean;
}

export default function ServiceOverview({ data, totalCost, isLoading }: ServiceOverviewProps) {
  const sortedData = data?.sort((a, b) => b.cost - a.cost);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Overview</CardTitle>
        <CardDescription>Top cost-generating services.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead className="text-right">Cost / % of Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-6 w-6 rounded-sm" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24 ml-auto" />
                    <Skeleton className="h-2 w-full mt-2" />
                  </TableCell>
                </TableRow>
              ))}
            {sortedData?.map((service) => {
              const Icon = SERVICE_ICONS[service.serviceName] || SERVICE_ICONS['Other'];
              const percentage = totalCost ? (service.cost / totalCost) * 100 : 0;
              return (
                <TableRow key={service.serviceName}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{service.serviceName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-medium">
                      ${service.cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {percentage.toFixed(2)}%
                    </div>
                    <Progress value={percentage} className="h-1 mt-1" />
                  </TableCell>
                </TableRow>
              );
            })}
             {!isLoading && (!sortedData || sortedData.length === 0) && (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">
                  No service data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
