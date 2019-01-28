export interface Report {
    onetime: number;
    daily: number;
    monthly: number;
    yearly: number;
    profit: number;
    date: string;
    lineName?: string;
    dailyProfit: number;
    monthlyProfit: number;
    yearlyProfit: number;
    onetimeProfit: number;
}
