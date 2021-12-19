import { Application } from 'express';
import { Collection } from 'mags-mongodb';
import { PageLoadedData, SendMetricData } from './types';

export default class AnalyticsEngine {
	private static connected = false;
	private static collection: Collection;

	public static connect (collection: Collection): void {
		AnalyticsEngine.connected = true;
		AnalyticsEngine.collection = collection;
		console.log('Successfully connected to AnalyticsEngine');
	}

	public static routes (app: Application): void {
		if (!AnalyticsEngine.connected) throw new Error('Analytics Engine must be connected first. Run AnalyticsEngine.connect(collection)');
	
		app.post('/pageLoaded', async (req, res) => {
			const reqData: PageLoadedData = req.body;
			console.log(reqData);
			const resData = await AnalyticsEngine.pageLoaded(reqData.userId);
			res.status(200).send(resData);
		});

		app.post('/sendMetric', async (req, res) => {
			const reqData: SendMetricData = req.body;
			console.log(reqData);
			const resData = await AnalyticsEngine.sendMetric(reqData.userId, reqData.metric, reqData.globalMetric);
			res.status(200).send(resData);
		});
	}

	private static async pageLoaded (userId: string): Promise<object> {
		if (!AnalyticsEngine.connected) throw new Error('Analytics Engine must be connected first. Run AnalyticsEngine.connect(collection)');
		
		const user = await AnalyticsEngine.collection.getDocumentByField(userId);

		return Promise.all([
			AnalyticsEngine.newView(),
			(!user) ? AnalyticsEngine.newUniqueVisitor() : '',
			AnalyticsEngine.updateUser(userId)
		]);
	}

	private static async newView (): Promise<object> {
		if (!AnalyticsEngine.connected) throw new Error('Analytics Engine must be connected first. Run AnalyticsEngine.connect(collection)');
		
		return await AnalyticsEngine.collection.createOrUpdateDocument(
			{ totalViews: { $type: 'number' } },
			{ $inc: { totalViews: 1 } }
		);
	}

	private static async newUniqueVisitor (): Promise<object> {
		if (!AnalyticsEngine.connected) throw new Error('Analytics Engine must be connected first. Run AnalyticsEngine.connect(collection)');

		return await AnalyticsEngine.collection.createOrUpdateDocument(
			{ totalUniqueVisitors: { $type: 'number' } },
			{ $inc: { totalUniqueVisitors: 1 } }
		);
	}
	
	private static async updateUser (userId: string): Promise<object> {
		if (!AnalyticsEngine.connected) throw new Error('Analytics Engine must be connected first. Run AnalyticsEngine.connect(collection)');

		return await AnalyticsEngine.collection.createOrUpdateDocument(
			{ users: { $type: 'object' } },
			{
				$set: { users: {} },
				$inc: { [`${userId}.totalViews`]: 1 }
			}
		);
	}

	private static async sendMetric (userId: string, metric: string, globalMetric: string = metric): Promise<object> {
		if (!AnalyticsEngine.connected) throw new Error('Analytics Engine must be connected first. Run AnalyticsEngine.connect(collection)');

		return Promise.all([
			AnalyticsEngine.collection.createOrUpdateDocument(
				{ users: { $type: 'object' } },
				{
					$set: { users: {} },
					$inc: { [`${userId}.metrics.${metric}`]: 1 }
				}
			),
			AnalyticsEngine.collection.createOrUpdateDocument(
				{ metrics: { $type: 'object' } },
				{
					$set: { metrics: {} },
					$inc: { [globalMetric]: 1 }
				}
			)
		]);
	}
}
