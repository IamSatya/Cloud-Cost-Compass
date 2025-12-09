export interface CostDataPoint {
    date: string; // YYYY-MM-DD
    cost: number;
}
  
export interface ServiceCost {
    serviceName: string;
    cost: number;
}
  
export interface AccountCost {
    id: string;
    accountId: string;
    accountName: string;
    cost: number;
}

export interface AwsAccount {
    id: string;
    accountId: string;
    accountName: string;
    accessKeyId: string;
    secretAccessKey: string;
}

export interface PeriodCostData {
    totalCost: number;
    costTrend: number; // percentage change
    timeline: CostDataPoint[];
    byService: ServiceCost[];
    byAccount: Omit<AccountCost, 'cost'>[]; // The mock flow returns accounts without cost
}
  
export interface AwsCostData {
    daily: PeriodCostData;
    weekly: PeriodCostData;
    monthly: PeriodCostData;
}
