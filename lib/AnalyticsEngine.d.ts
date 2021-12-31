import { Application } from 'express';
import { Collection, Config } from '@mhazaa/mongo-controller';
export default class AnalyticsEngine {
    private static connected;
    private static collection;
    static connectUsingCollection(collection: Collection): void;
    static connectUsingDBConfig(config: Config): Promise<void>;
    static routes(app: Application): void;
    private static pageLoaded;
    private static newView;
    private static newUniqueVisitor;
    private static updateUser;
    private static sendMetric;
}
