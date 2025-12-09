"use client";

import { subDays, format, startOfWeek, startOfMonth } from 'date-fns';
import type { AwsCostData, CostDataPoint, ServiceCost, AccountCost } from './types';

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
  // Normalize service costs
  const serviceTotal = byService.reduce((acc, s) => acc + s.cost, 0);
  byService.forEach(s => s.cost = (s.cost / serviceTotal) * totalCost);


  const byAccount: AccountCost[] = ACCOUNTS.map(account => ({
    accountId: account.id,
    accountName: account.name,
    cost: totalCost * (Math.random() * 0.3 + 0.1),
  }));
   // Normalize account costs
  const accountTotal = byAccount.reduce((acc, a) => acc + a.cost, 0);
  byAccount.forEach(a => a.cost = (a.cost / accountTotal) * totalCost);


  const costTrend = (Math.random() - 0.4) * 20;

  return { totalCost, costTrend, byService, byAccount };
};


export function generateMockData(): AwsCostData {
  const today = new Date();

  // Daily
  const dailyTimeline = generateTimeline(1, 1500);
  const dailyAggregates = aggregateData(dailyTimeline);

  // Weekly
  const startOfThisWeek = startOfWeek(today);
  const daysInThisWeek = today.getDay() + 1;
  const weeklyTimeline = generateTimeline(daysInThisWeek, 1200).filter(d => new Date(d.date) >= startOfThisWeek);
  const weeklyAggregates = aggregateData(weeklyTimeline);

  // Monthly
  const startOfThisMonth = startOfMonth(today);
  const daysInThisMonth = today.getDate();
  const monthlyTimeline = generateTimeline(daysInThisMonth, 1100).filter(d => new Date(d.date) >= startOfThisMonth);
  const monthlyAggregates = aggregateData(monthlyTimeline);

  return {
    daily: {
      ...dailyAggregates,
      timeline: generateTimeline(7, 1500), // show 7 days trend for daily view
    },
    weekly: {
      ...weeklyAggregates,
      timeline: generateTimeline(14, 1200), // show 14 days trend for weekly view
    },
    monthly: {
      ...monthlyAggregates,
      timeline: generateTimeline(30, 1100), // show 30 days trend for monthly view
    },
  };
}
