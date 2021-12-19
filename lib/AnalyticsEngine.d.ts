import { Application } from 'express';
import { Collection } from 'mags-mongodb';
export default class AnalyticsEngine {
    private static connected;
    private static collection;
    static connect(collection: Collection): void;
    static routes(app: Application): void;
    private static pageLoaded;
    private static newView;
    private static newUniqueVisitor;
    private static updateUser;
    private static sendMetric;
}
