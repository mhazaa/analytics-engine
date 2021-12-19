"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AnalyticsEngine {
    static connected = false;
    static collection;
    static connect(collection) {
        AnalyticsEngine.connected = true;
        AnalyticsEngine.collection = collection;
        console.log('Successfully connected to AnalyticsEngine');
    }
    static routes(app) {
        if (!AnalyticsEngine.connected)
            throw new Error('Analytics Engine must be connected first. Run AnalyticsEngine.connect(collection)');
        app.post('/pageLoaded', async (req, res) => {
            const reqData = req.body;
            console.log(reqData);
            const resData = await AnalyticsEngine.pageLoaded(reqData.userId);
            res.status(200).send(resData);
        });
        app.post('/sendMetric', async (req, res) => {
            const reqData = req.body;
            console.log(reqData);
            const resData = await AnalyticsEngine.sendMetric(reqData.userId, reqData.metric, reqData.globalMetric);
            res.status(200).send(resData);
        });
    }
    static async pageLoaded(userId) {
        if (!AnalyticsEngine.connected)
            throw new Error('Analytics Engine must be connected first. Run AnalyticsEngine.connect(collection)');
        const user = await AnalyticsEngine.collection.getDocumentByField(userId);
        return Promise.all([
            AnalyticsEngine.newView(),
            (!user) ? AnalyticsEngine.newUniqueVisitor() : '',
            AnalyticsEngine.updateUser(userId)
        ]);
    }
    static async newView() {
        if (!AnalyticsEngine.connected)
            throw new Error('Analytics Engine must be connected first. Run AnalyticsEngine.connect(collection)');
        return await AnalyticsEngine.collection.createOrUpdateDocument({ totalViews: { $type: 'number' } }, { $inc: { totalViews: 1 } });
    }
    static async newUniqueVisitor() {
        if (!AnalyticsEngine.connected)
            throw new Error('Analytics Engine must be connected first. Run AnalyticsEngine.connect(collection)');
        return await AnalyticsEngine.collection.createOrUpdateDocument({ totalUniqueVisitors: { $type: 'number' } }, { $inc: { totalUniqueVisitors: 1 } });
    }
    static async updateUser(userId) {
        if (!AnalyticsEngine.connected)
            throw new Error('Analytics Engine must be connected first. Run AnalyticsEngine.connect(collection)');
        return await AnalyticsEngine.collection.createOrUpdateDocument({ users: { $type: 'object' } }, {
            $set: { users: {} },
            $inc: { [`${userId}.totalViews`]: 1 }
        });
    }
    static async sendMetric(userId, metric, globalMetric = metric) {
        if (!AnalyticsEngine.connected)
            throw new Error('Analytics Engine must be connected first. Run AnalyticsEngine.connect(collection)');
        return Promise.all([
            AnalyticsEngine.collection.createOrUpdateDocument({ users: { $type: 'object' } }, {
                $set: { users: {} },
                $inc: { [`${userId}.metrics.${metric}`]: 1 }
            }),
            AnalyticsEngine.collection.createOrUpdateDocument({ metrics: { $type: 'object' } }, {
                $set: { metrics: {} },
                $inc: { [globalMetric]: 1 }
            })
        ]);
    }
}
exports.default = AnalyticsEngine;
