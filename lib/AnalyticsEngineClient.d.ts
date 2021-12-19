export default class AnalyticsEngineClient {
    private static connected;
    private static connectionCallbacks;
    static connect(): Promise<void>;
    static onConnection(callback: () => void): void;
    static sendMetric(metric: string, globalMetric?: string): Promise<void>;
    private static getUserId;
    private static setUserId;
}
