type Metrics = { [key: string] : number; }[];

export interface AnalyticsDataSchema {
	totalViews: number;
	totalUniqueVisitors: number;
	metrics: Metrics;
	users: { 
		[key: string]: {
			totalViews: number;
			metrics: Metrics;
		}
	};
}

export interface PageLoadedData {
	userId: string;
}

export interface SendMetricData {
	userId: string;
	metric: string;
	globalMetric?: string;
}