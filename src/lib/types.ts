export interface CostDataPoint {
    date: string; // YYYY-MM-DD
    cost: number;
}
  
export interface ServiceCost {
    serviceName: string;
    cost: number;
}
  
export interface AccountCost {
    accountId: string;
    accountName: string;
    cost: number;
}

export interface PeriodCostData {
    totalCost: number;
    costTrend: number; // percentage change
    timeline: CostDataPoint[];
    byService: ServiceCost[];
    byAccount: AccountCost[];
}
  
export interface AwsCostData {
    daily: PeriodCostData;
    weekly: PeriodCostData;
    monthly: PeriodCostData;
}
