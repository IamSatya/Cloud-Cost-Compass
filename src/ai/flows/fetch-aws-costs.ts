'use server';
/**
 * @fileoverview A flow for fetching AWS cost data.
 *
 * This file defines a Genkit flow that simulates fetching cost and usage data
 * from AWS Cost Explorer. In a real-world scenario, this flow would contain
 * the logic to interact with the AWS SDK, but for now, it returns mock data.
 *
 * - fetchAwsCostData: A function that takes AWS credentials and returns cost data.
 * - FetchAwsCostDataInput: The input schema for the flow.
 * - FetchAwsCostDataOutput: The output schema for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { subDays, format, startOfWeek, startOfMonth } from 'date-fns';
import type { AwsCostData, CostDataPoint, ServiceCost, AccountCost } from '@/lib/types';


// Input schema for the flow
const FetchAwsCostDataInputSchema = z.object({
  accountId: z.string().describe('The AWS account ID.'),
  accessKeyId: z.string().describe('The AWS Access Key ID.'),
  secretAccessKey: z.string().describe('The AWS Secret Access Key.'),
});
export type FetchAwsCostDataInput = z.infer<typeof FetchAwsCostDataInputSchema>;


// Manually define the Zod schema for the output based on the TypeScript types
const CostDataPointSchema = z.object({
    date: z.string(),
    cost: z.number(),
});

const ServiceCostSchema = z.object({
    serviceName: z.string(),
    cost: z.number(),
});

const AccountCostSchema = z.object({
    accountId: z.string(),
    accountName: z.string(),
    cost: z.number(),
});

const PeriodCostDataSchema = z.object({
    totalCost: z.number(),
    costTrend: z.number(),
    timeline: z.array(CostDataPointSchema),
    byService: z.array(ServiceCostSchema),
    byAccount: z.array(AccountCostSchema),
});

const FetchAwsCostDataOutputSchema = z.object({
    daily: PeriodCostDataSchema,
    weekly: PeriodCostDataSchema,
    monthly: PeriodCostDataSchema,
});

export type FetchAwsCostDataOutput = z.infer<typeof FetchAwsCostDataOutputSchema>;

// Mock data generation logic, moved from the client
const SERVICES = ['EC2', 'S3', 'Lambda', 'RDS', 'VPC', 'CloudWatch'];
const ACCOUNTS = [
  { id: '123456789012', name: 'Production' },
  { id: '234567890123', name: 'Development' },
  { id: '345678901234', name: 'Staging' },
  { id: '456789012345', name: 'Analytics' },
];

const getRandomCost = (base: number) => base + Math.random() * base;

const generateTimeline = (days: number, dailyBase: number): CostDataPoint[] => {
  return Array.from({ length: days }).map((_, i) => {
    const date = subDays(new Date(), days - 1 - i);
    return {
      date: format(date, 'yyyy-MM-dd'),
      cost: getRandomCost(dailyBase) * (1 + Math.sin(i) * 0.1),
    };
  }).reverse();
};

const aggregateData = (timeline: CostDataPoint[]) => {
  const totalCost = timeline.reduce((acc, p) => acc + p.cost, 0);

  const byService: ServiceCost[] = SERVICES.map(serviceName => ({
    serviceName,
    cost: totalCost * (Math.random() * 0.2 + 0.05),
  }));
  const serviceTotal = byService.reduce((acc, s) => acc + s.cost, 0);
  byService.forEach(s => s.cost = (s.cost / serviceTotal) * totalCost);

  const byAccount: AccountCost[] = ACCOUNTS.map(account => ({
    accountId: account.id,
    accountName: account.name,
    cost: totalCost * (Math.random() * 0.3 + 0.1),
  }));
  const accountTotal = byAccount.reduce((acc, a) => acc + a.cost, 0);
  byAccount.forEach(a => a.cost = (a.cost / accountTotal) * totalCost);

  const costTrend = (Math.random() - 0.4) * 20;

  return { totalCost, costTrend, byService, byAccount };
};

function generateMockData(): AwsCostData {
  const today = new Date();
  const dailyTimeline = generateTimeline(1, 1500);
  const dailyAggregates = aggregateData(dailyTimeline);
  const startOfThisWeek = startOfWeek(today);
  const daysInThisWeek = today.getDay() + 1;
  const weeklyTimeline = generateTimeline(daysInThisWeek, 1200).filter(d => new Date(d.date) >= startOfThisWeek);
  const weeklyAggregates = aggregateData(weeklyTimeline);
  const startOfThisMonth = startOfMonth(today);
  const daysInThisMonth = today.getDate();
  const monthlyTimeline = generateTimeline(daysInThisMonth, 1100).filter(d => new Date(d.date) >= startOfThisMonth);
  const monthlyAggregates = aggregateData(monthlyTimeline);

  return {
    daily: {
      ...dailyAggregates,
      timeline: generateTimeline(7, 1500),
    },
    weekly: {
      ...weeklyAggregates,
      timeline: generateTimeline(14, 1200),
    },
    monthly: {
      ...monthlyAggregates,
      timeline: generateTimeline(30, 1100),
    },
  };
}


/**
 * The main exported function that calls the Genkit flow.
 */
export async function fetchAwsCostData(input: FetchAwsCostDataInput): Promise<FetchAwsCostDataOutput> {
  return fetchAwsCostDataFlow(input);
}


/**
 * The Genkit flow definition.
 * In a real implementation, this flow would use the input credentials to
 * initialize the AWS SDK and fetch data from AWS Cost Explorer.
 * For now, it just returns mock data.
 */
const fetchAwsCostDataFlow = ai.defineFlow(
  {
    name: 'fetchAwsCostDataFlow',
    inputSchema: FetchAwsCostDataInputSchema,
    outputSchema: FetchAwsCostDataOutputSchema,
  },
  async (input) => {
    console.log(`Simulating fetch for AWS Account: ${input.accountId}`);
    // Here you would add the logic to call the AWS SDK
    // For example:
    // const costexplorer = new CostExplorerClient({
    //   region: "us-east-1",
    //   credentials: {
    //     accessKeyId: input.accessKeyId,
    //     secretAccessKey: input.secretAccessKey,
    //   },
    // });
    // const command = new GetCostAndUsageCommand(...);
    // const output = await costexplorer.send(command);
    //
    // Then, you would transform the 'output' into the FetchAwsCostDataOutput schema.

    // For now, we just return the same mock data regardless of input.
    const mockData = generateMockData();
    return mockData;
  }
);
